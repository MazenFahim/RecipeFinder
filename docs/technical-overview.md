# RecipeFinder3 — Technical Overview

> For the TA discussion. Covers architecture, request flow, and likely questions.

---

## 1. Architecture at a Glance

```
┌─────────────────────────────────────────────────────┐
│                    Browser                           │
│  HTML Templates ← Django Templates                  │
│  Vanilla JS (fetch / DOM)                           │
│  sessionStorage (currentUser, isAdmin)              │
└────────┬────────────────────────┬───────────────────┘
         │                        │
    Page load (GET)          AJAX (JSON)
         │                        │
         ▼                        ▼
┌─────────────────────────────────────────────────────┐
│                 Django Server                        │
│                                                      │
│  URL Router (core/urls.py)                           │
│      │                                               │
│      ├──→ Template Views (render HTML)               │
│      │        accounts: signup_view                  │
│      │        recipes:  recipe_home_view             │
│      │        recipes:  admin_dashboard, etc.        │
│      │        favorites: favorite_list               │
│      │                                               │
│      └──→ REST API Views (return JSON)               │
│               accounts: SignupAPI, LoginAPI          │
│               recipes:  ListCreate, GetUpdateDelete  │
│               favorites: fav_toggle                  │
│                                                      │
│  Auth Layer: SessionAuthentication                   │
│  Permissions: IsAuthenticated + IsAdminOrReadOnly    │
│                                                      │
│  Serializers → validate / transform data             │
│  Models (ORM) → interact with DB                     │
│                                                      │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
         ┌──────────────────┐
         │    SQLite        │
         │  (db.sqlite3)    │
         └──────────────────┘
```

### Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend framework | Django 5.2.13 |
| REST API framework | Django REST Framework 3.17.1 |
| Frontend | Vanilla JS (no framework) |
| Database | SQLite (development) |
| Authentication | Session-based (DRF SessionAuthentication) |
| CORS | django-cors-headers 4.9.0 |
| Image handling | Pillow 12.2.0 |
| Python | 3.11 |

---

## 2. Detailed Request Flows

### Flow A: Normal User Browses Recipes

```
1. User opens browser → GET /recipes/home/
2. Django URL router matches to recipe_home_view
3. Decorator @login_required checks session cookie
4. View queries Recipe.objects (with prefetched ingredients)
5. View also fetches user's favorite IDs
6. Renders index.html with context {recipes, favorites_list, query}
7. Browser gets full HTML page with recipe cards
```

### Flow B: User Logs In (AJAX)

```
1. User fills email + password, clicks login
2. login.js sends POST /account/api/login/ with JSON body
3. LoginAPI (GenericAPIView) receives request
   - authentication_classes = [] (no auth required for login)
   - permission_classes = [AllowAny]
4. LoginSerializer validates:
   - Checks email/password via authenticate(username=email, password=pw)
   - Returns user object on success
5. View calls django.contrib.auth.login(request, user) → creates session
6. Returns JSON {user: {id, username, email, is_admin}, message: "..."}
7. login.js stores email + is_admin in sessionStorage
8. Redirects: admin → /recipes/admin/dashboard/, user → /recipes/home/
```

### Flow C: Admin Creates a Recipe (AJAX + FormData)

```
1. Admin fills form on add-recipe.html (includes image upload)
2. admin.js sends POST /recipes/api/recipes/ with FormData
   - Credentials: 'include' (sends session cookie)
   - CSRF token from hidden input
3. ListCreate (ListCreateAPIView) receives request
   - Permission check: IsAdminOrReadOnly → requires is_admin=True
   - IsAuthenticated → session must be valid
4. RecipeSerializer deserializes:
   - Parses ingredients from ListField (comma-separated → list)
   - Creates Recipe object
   - For each ingredient: get_or_create Ingredient, add to recipe
   - Handles image file upload
5. Returns 201 + serialized recipe JSON
6. Frontend alerts success, redirects to /recipes/admin/view-recipes/
```

### Flow D: User Toggles Favorite

```
1. User clicks ♡ button on a recipe card
2. favourites.js: toggleFav(btn) → GET /favorites/api/favorite/toggle/{id}/
3. fav_toggle view:
   - @login_required checks session
   - get_object_or_404(Recipe, id=recipe_id)
   - if Favorite exists: delete it → "removed"
   - else: Favorite.objects.create(user, recipe) → "added"
4. Returns JsonResponse({'status': 'added'|'removed'})
5. JS updates heart icon (❤️ or 🤍)
```

### Flow E: CRUD API Recipe Operations

| Method | Endpoint | Permission | Action |
|--------|----------|-----------|--------|
| GET | `/recipes/api/recipes/` | Authenticated | List all recipes (with search filter) |
| GET | `/recipes/api/recipes/{id}/` | Authenticated | Get single recipe |
| POST | `/recipes/api/recipes/` | IsAdmin | Create new recipe |
| PUT | `/recipes/api/recipes/{id}/` | IsAdmin | Full update |
| PATCH | `/recipes/api/recipes/{id}/` | IsAdmin | Partial update |
| DELETE | `/recipes/api/recipes/{id}/` | IsAdmin | Delete recipe |

### Flow F: Search

```
Server-side (recipe_home_view + ListCreate):
  - Both use Q objects with __icontains across name, description, ingredients__name
  - ListCreate also uses DRF's SearchFilter with search_fields

Client-side (favourites.js):
  - fetch("/recipes/api/recipes/?search=" + query)
  - Renders returned JSON results as cards
```

---

## 3. Model Relationships

```
CustomUser 1 ─────────── * Favorite
     (user FK)

Recipe 1 ─────────────── * Favorite
     (recipe FK)

Recipe * ─────────────── * Ingredient
     (ManyToManyField through auto-generated pivot table)
```

**Constraints:**
- `Favorite` has `unique_together = (user, recipe)` — no duplicate favorites
- `CustomUser.email` is `unique=True`
- `Recipe.ingredients` can be `blank=True` (no ingredients required)

---

## 4. Authentication & Authorization

### Authentication (Who you are)
- **Session-based**: Django sets a `sessionid` cookie on successful login
- DRF uses `SessionAuthentication` — reads the session cookie, looks up the user
- No tokens (JWT, etc.) needed

### Authorization (What you can do)

Two enforcement layers:

**a) Permission class: `IsAdminOrReadOnly`**
```python
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:  # GET, HEAD, OPTIONS
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.is_admin
```

**b) Decorator: `admin_required`**
```python
def admin_required(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_admin:
            return redirect('login')
        return view_func(request, *args, **kwargs)
```
Used on admin page views (server-rendered).

---

## 5. Serializer Details

### RecipeSerializer (most complex one)

```python
class RecipeSerializer(serializers.ModelSerializer):
    ingredients = ListField(child=CharField(), write_only=True)
```

**Create flow:**
1. Pop `ingredients` list from validated data
2. Create Recipe without ingredients
3. For each ingredient name: `get_or_create` Ingredient
4. Add each Ingredient to Recipe's M2M field

**Read flow:**
- Overrides `to_representation` to return `[ingredient names]` instead of PKs

---

## 6. Frontend Architecture

No framework — pure JavaScript with specific responsibilities:

| File | Responsibility |
|------|---------------|
| `login.js` | Login form → POST API → store session → redirect |
| `signup.js` | Signup form → POST API → redirect to login |
| `favourites.js` | Toggle favorites (GET), search recipes (GET) |
| `admin.js` | Admin CRUD: list, add (FormData), edit (PATCH), delete (DELETE) |
| `data.js` | Hardcoded recipes (legacy/static prototype data + client-side filtering) |

**State management:**
- `sessionStorage.currentUser` — user's email
- `sessionStorage.isAdmin` — boolean flag for role-based UI
- No global state manager — DOM manipulation throughout

---

## 7. URL Structure Summary

```
/                              → Login page (django auth LoginView)
/login/                        → Login page (same)
/logout/                       → manual_logout (custom view)
/account/signup/               → signup page
/account/api/signup/           → SignupAPI (POST)
/account/api/login/            → LoginAPI (POST)
/recipes/home/                 → Recipe listing (main page)
/recipes/api/recipes/          → ListCreate (GET, POST)
/recipes/api/recipes/{id}/     → GetUpdateDelete (GET, PUT, PATCH, DELETE)
/recipes/admin/dashboard/      → Admin dashboard
/recipes/admin/add-recipe/     → Add recipe form
/recipes/admin/edit-recipe/    → Edit recipe form
/recipes/admin/view-recipes/   → View all (admin)
/favorites/                    → User's favorites list
/favorites/api/favorite/toggle/{id}/ → Toggle favorite
```

---

## 8. Expected TA Questions & Answers

### Q1: Why did you use Vanilla JS instead of React/Vue?

**A:** The project doesn't need a complex SPA. Django templates handle most page rendering efficiently. JavaScript is only used for specific interactive features (login/signup AJAX, favorites toggle, admin CRUD). Adding a frontend framework would be overkill — it would increase build complexity and bundle size with no real benefit here.

### Q2: How does authentication work without tokens?

**A:** Django creates a **session** on the server when the user logs in and sends a `sessionid` cookie to the browser. On every subsequent request, the browser automatically sends this cookie. DRF's `SessionAuthentication` reads the cookie, looks up the session in the database, and identifies the user. No JWT or API tokens needed because this is a same-origin app (frontend and backend are served from the same Django server).

### Q3: How do you prevent users from modifying recipes if they shouldn't?

**A:** Two layers:
1. **Frontend**: The admin dashboard and CRUD buttons only appear if `sessionStorage.isAdmin === "true"`. Regular users never see them.
2. **Backend** (the real protection): The `IsAdminOrReadOnly` permission class is applied to the `ListCreate` and `GetUpdateDelete` views. Even if someone crafts a POST/PUT/DELETE request manually (e.g., via Postman), the backend checks `request.user.is_admin` and returns **403 Forbidden** if the user isn't an admin.

The frontend restriction is just for UX — security lives on the server.

### Q4: How does the search work?

**A:** Two implementations:
- **Server-side** (home page + API): Uses Django's `Q` objects with `__icontains` across `name`, `description`, and `ingredients__name`. The API version also uses DRF's `SearchFilter` backend. Both use `prefetch_related('ingredients')` to avoid N+1 queries.
- **Client-side** (favorites page): Fetches all recipes from the API with a `?search=` query parameter and re-renders the results dynamically.

### Q5: Why is there a separate `Favorite` model instead of a ManyToManyField on User or Recipe?

**A:** A separate model gives us:
- A `created_at` timestamp (when was it favorited?)
- Easy querying: `Favorite.objects.filter(user=request.user).select_related('recipe')`
- Easy toggle logic: check existence → create or delete
- Room to extend later (e.g., add notes, folders, categories)

If we used a M2M field directly, we'd lose the timestamp and would need a through-model anyway. This way is cleaner.

### Q6: How do you handle the ManyToMany between Recipe and Ingredient in the serializer?

**A:** The `RecipeSerializer` accepts ingredients as a **list of strings** (`write_only=True`). On create/update:
1. We pop the ingredient names from validated data
2. Create the Recipe first (without ingredients)
3. For each name, call `Ingredient.objects.get_or_create(name=i.strip())`
4. Add each Ingredient to the recipe's M2M field

On read, we override `to_representation` to convert the M2M back to a list of names. This means the frontend never deals with ingredient IDs.

### Q7: Is this production-ready? What would you change?

**A:** Not production-ready. We'd need to:
- Switch from SQLite to PostgreSQL
- Set `DEBUG = False` and configure proper error handling
- Use environment variables for `SECRET_KEY` and DB credentials
- Add HTTPS (via a reverse proxy like Nginx)
- Serve static/media files via a CDN or Nginx, not Django
- Add comprehensive test coverage (currently just placeholders)
- Add rate limiting to API endpoints
- Improve password validation and add password reset flow

### Q8: How does the `admin_required` decorator differ from `IsAdminOrReadOnly`?

**A:** They protect different types of views:
- `admin_required` is a **function decorator** for **server-rendered template views** (admin dashboard, add-recipe page, etc.). If a non-admin tries to access these pages, they get redirected to the login page.
- `IsAdminOrReadOnly` is a **DRF permission class** for **API views** (ListCreate, GetUpdateDelete). It returns **403 Forbidden** (not a redirect) because APIs return JSON, not HTML.

Both check `request.user.is_admin`, but one redirects and the other rejects with an error.

### Q9: Why does `MyLogoutView` override `get()` to call `post()`?

**A:** Django's `LogoutView` only handles POST requests by default (as a CSRF safety measure). But this project uses simple links (`<a href="/logout/">`) instead of POST forms. By overriding `get()` to delegate to `post()`, we allow logout via a simple GET request. A real production app should use a POST form with CSRF protection, but this is a development shortcut.

### Q10: Explain the data seeding command.

**A:** The `seed_recipes` management command reads the hardcoded `recipes` array from `core/static/scripts/data.js` (a file with ~70 Arabic recipes). It:
1. Parses the JavaScript object literal into JSON using a custom `js_to_json()` function (handles trailing commas, unquoted keys, comments)
2. For each recipe, creates a `Recipe` record and corresponding `Ingredient` records
3. Copies recipe images from `static/images/` to the media directory
4. Is idempotent — checks recipe names before inserting to avoid duplicates

### Q11: How does the recipe image upload work?

**A:** The `Recipe.image` field is a Django `ImageField(upload_to='recipe_images/')`. When an admin submits the add-recipe form, `admin.js` sends a `FormData` object (which handles multipart file uploads). Django saves the uploaded file to `media/recipe_images/` and stores the path in the database. During development, `core/urls.py` adds `static(settings.MEDIA_URL, ...)` so Django serves these files during development.

### Q12: What are the N+1 query concerns and how did you address them?

**A:** Without optimization, iterating over recipes and accessing their ingredients would trigger a separate query per recipe. We fixed this with:
- `Recipe.objects.prefetch_related('ingredients')` — fetches all ingredients for all recipes in 2 queries total
- `Favorite.objects.filter(user=request.user).select_related('recipe')` — uses a JOIN instead of separate queries
- `Favorite.objects.values_list('recipe_id', flat=True)` — just fetches IDs, not full objects, for the home page badge list
