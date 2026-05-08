async function handleSignUp(isAdmin) {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
        alert("يرجى تعبئة جميع الحقول!");
        return;
    }


    const payload = {
        username: email,
        email: email,
        password: password,
        is_admin: isAdmin
    };

    try {
        // 2. Make an HTTP POST request to your Django Backend
        const response = await fetch('http://127.0.0.1:8000/account/api/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        // 3. Handle the response
        if (response.ok) {
            if (isAdmin) {
                alert("تم التسجيل كمسؤول بنجاح! سيتم تحويلك لصفحة تسجيل الدخول.");
            } else {
                alert("تم التسجيل بنجاح! سيتم تحويلك لصفحة تسجيل الدخول.");
            }
            window.location.href = "login.html";
        } else {
            // Show errors from the backend (e.g., username/email already exists)
            alert("خطأ في التسجيل: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("تعذر الاتصال بالخادم. تأكد من تشغيل سيرفر Django.");
    }
}

// Attach event listeners to both buttons
document.getElementById('sign-up-btn').addEventListener('click', () => handleSignUp(false));
document.getElementById('sign-up-admin-btn').addEventListener('click', () => handleSignUp(true));