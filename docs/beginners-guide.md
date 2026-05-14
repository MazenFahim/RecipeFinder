# RecipeFinder3 — Beginner's Guide

## What is this project?

A **recipe sharing website** where users can:
- Browse recipes (by name, ingredient, or description)
- Mark recipes as favorites
- Admin users can add / edit / delete recipes

It uses **Django** (Python web framework) for the backend and **Vanilla JavaScript** for the frontend.

---

## Project Structure (Top Level)

```
RecipeFinder3/
├── core/                  # The Django project (all code lives here)
│   ├── core/              # Project settings (settings.py, urls.py)
│   ├── accounts/          # App: user signup, login, logout
│   ├── recipes/           # App: recipe listing, CRUD, admin pages
│   ├── favorites/         # App: user favorites
│   ├── templates/         # HTML files
│   ├── static/            # CSS, JavaScript, images
│   └── db.sqlite3         # Database file
├── requirements.txt       # List of Python packages needed
└── class-diagram.puml     # Architecture diagram (PlantUML)
```

---

## Three Django Apps

### 1. Accounts (`accounts/`)
Handles **users** — signup, login, logout.

| File | What it does |
|------|-------------|
| `models.py` | Defines `CustomUser` (email + password + is_admin flag) |
| `serializers.py` | Converts user data to/from JSON |
| `views.py` | `SignupAPI`, `LoginAPI` (API endpoints) + `signup_view` (page render) |

### 2. Recipes (`recipes/`)
Handles **recipes** — browse, search, admin CRUD.

| File | What it does |
|------|-------------|
| `models.py` | Defines `Recipe` and `Ingredient` |
| `serializer.py` | Converts recipe data to/from JSON |
| `views.py` | `recipe_home_view` (home page), `ListCreate` (API list+create), `GetUpdateDelete` (API read/update/delete) |
| `admin_views.py` | Admin pages (dashboard, add, edit, view recipes) |
| `permissions.py` | `IsAdminOrReadOnly` — only admins can write |

### 3. Favorites (`favorites/`)
Handles **user favorites** — save/remove recipes.

| File | What it does |
|------|-------------|
| `models.py` | Defines `Favorite` (links a user to a recipe) |
| `views.py` | `fav_toggle` (toggle on/off), `favorite_list` (show user's favorites) |

---

## How the Pieces Fit Together

```
Browser (HTML + JS)
    │
    ├── Request a page → Django Template View → Renders HTML
    │
    └── AJAX call (fetch) → Django REST API → Returns JSON
```

**Two types of requests:**

1. **Page loads** — e.g., visiting `/recipes/home/` → Django queries the database, fills an HTML template, sends the complete page to the browser
2. **AJAX calls** — e.g., clicking the login button → JavaScript sends a JSON request to `/account/api/login/` → Django validates and returns JSON → JavaScript updates the page

---

## Key Concepts

| Term | Meaning |
|------|---------|
| **Django App** | A self-contained module inside a Django project (accounts, recipes, favorites) |
| **Model** | A Python class that maps to a database table |
| **View** | Code that handles a request and returns a response |
| **Template** | HTML file with placeholders that Django fills with data |
| **Serializer** | Converts Python objects ↔ JSON for the REST API |
| **URLconf** | Maps URL patterns to views (e.g., `/recipes/home/` → `recipe_home_view`) |
| **Session** | Django remembers who you are via a cookie in your browser |

---

## How to Run the Project

```bash
# 1. Activate the virtual environment
venv\Scripts\activate

# 2. Start the development server
cd core
python manage.py runserver

# 3. Open http://127.0.0.1:8000/ in your browser
```

---

## User Roles

| Role | Can do |
|------|--------|
| **Regular User** | Browse recipes, search, mark favorites |
| **Admin User** | Everything above + add / edit / delete recipes via the admin dashboard |

The frontend checks `sessionStorage.isAdmin` and shows/hides buttons accordingly.
The backend enforces this via `IsAdminOrReadOnly` permission.

---

## If You Get Lost, Look Here

- **Where are the HTML pages?** → `core/templates/`
- **Where is the CSS?** → `core/static/styles/` and `core/static/Admin_Styles/`
- **Where is the JavaScript?** → `core/static/scripts/`
- **Where is the database?** → `core/db.sqlite3`
- **Where are the URLs?** → `core/core/urls.py` then each app's `urls.py`
