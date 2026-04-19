document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    
    loginBtn.addEventListener('click', (event) => {
        event.preventDefault(); 

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];

        const user = users.find(u => u.email === email && u.password === password);

        if (user) { 
            sessionStorage.setItem('currentUser', user.email); 
            console.log("تم تسجيل الدخول بنجاح لـ:", user.email);
            window.location.href = 'index.html'; 
        } else {
            alert("البريد الإلكتروني أو كلمة المرور غير صحيحة!");
        }
    });
});