document.getElementById('sign-up-btn').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
        alert("يرجى تعبئة جميع الحقول!");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = users.find(user => user.email === email);

    if (userExists) {
        alert("هذا البريد الإلكتروني مسجل مسبقاً!");
        return;
    }

    users.push({ name, email, password });

    localStorage.setItem('users', JSON.stringify(users));
    alert("تم التسجيل بنجاح! سيتم تحويلك لصفحة تسجيل الدخول.");
    window.location.href = "login.html";
});