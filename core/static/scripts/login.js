document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');

    loginBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert("يرجى إدخال اسم المستخدم وكلمة المرور!");
            return;
        }

        const payload = {
            username: username,
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