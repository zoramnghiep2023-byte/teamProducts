function register() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("regEmail").value;
    let pass = document.getElementById("regPass").value;
    if (name === "" || email === "" || pass === "") {
        alert("Please enter all information!");
        return;
    }
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("pass", pass);
    alert("Register successful!");
}

function login() {
    let email = document.getElementById("loginEmail").value;
    let pass = document.getElementById("loginPass").value;
    if (
        email === localStorage.getItem("email") &&
        pass === localStorage.getItem("pass") &&
        email !== ""
    ) {
        alert("Login successful!");
        showAccount();
    } else {
        alert("Wrong email or password!");
    }
}