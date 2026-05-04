function handleSignUp(isAdmin) {
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

    // Add admin status
    users.push({ name, email, password, isAdmin: isAdmin });

    localStorage.setItem('users', JSON.stringify(users));

    // Showaccount type
    if (isAdmin) {
        alert("تم التسجيل كمسؤول بنجاح! سيتم تحويلك لصفحة تسجيل الدخول.");
    } else {
        alert("تم التسجيل بنجاح! سيتم تحويلك لصفحة تسجيل الدخول.");
    }

    window.location.href = "login.html";
}

// Attach event listeners to both buttons
document.getElementById('sign-up-btn').addEventListener('click', () => handleSignUp(false));
document.getElementById('sign-up-admin-btn').addEventListener('click', () => handleSignUp(true));