document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');

    loginBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert("يرجى إدخال البريد الإلكتروني وكلمة المرور!");
            return;
        }

        const payload = {
            username: email,
            password: password
        };

        try {
            // 2. Send the HTTP POST request to Django
            const response = await fetch('http://127.0.0.1:8000/account/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            // 3. Handle the response
            if (response.ok) {
                // Save user session info
                sessionStorage.setItem('currentUser', data.user.email);
                sessionStorage.setItem('isAdmin', data.user.is_admin);
                console.log("تم تسجيل الدخول بنجاح لـ:", data.user.email);

                // Redirect based on the account type (Admin vs Normal User)
                if (data.user.is_admin) {
                    window.location.href = 'admin_dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                alert("البريد الإلكتروني أو كلمة المرور غير صحيحة!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("تعذر الاتصال بالخادم. تأكد من تشغيل سيرفر Django.");
        }
    });
});