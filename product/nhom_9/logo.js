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

function showAccount() {
    let name = localStorage.getItem("name");
    let email = localStorage.getItem("email");
    if (name === null) {
        alert("Please register first!");
        return;
    }
    document.getElementById("account").innerHTML = `
        <h2>My Account</h2>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <button onclick="logout()">Log Out</button>
        <button onclick="closeAccount()">Close</button>
    `;
}

function closeAccount() {
    document.getElementById("account").innerHTML = "";
}

function logout() {
    document.getElementById("account").innerHTML = "";
    alert("You have logged out!");
}