async function handleSignUp(event, isAdmin) {
    event.preventDefault();
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
        const response = await fetch('/account/api/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            if (isAdmin) {
                alert("تم التسجيل كمسؤول بنجاح! سيتم تحويلك لصفحة تسجيل الدخول.");
            } else {
                alert("تم التسجيل بنجاح! سيتم تحويلك لصفحة تسجيل الدخول.");
            }
            window.location.href = "/";
        } else {
            alert("خطأ في التسجيل: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("تعذر الاتصال بالخادم. تأكد من تشغيل سيرفر Django.");
    }
}

document.getElementById('sign-up-btn').addEventListener('click', (e) => handleSignUp(e, false));
document.getElementById('sign-up-admin-btn').addEventListener('click', (e) => handleSignUp(e, true));