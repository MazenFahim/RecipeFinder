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
            email: email,
            password: password
        };

        try {
            const response = await fetch('/account/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem('currentUser', data.user.email);
                sessionStorage.setItem('isAdmin', data.user.is_admin);

                if (data.user.is_admin) {
                    window.location.href = '/recipes/admin/dashboard/';
                } else {
                    window.location.href = '/recipes/home/';
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