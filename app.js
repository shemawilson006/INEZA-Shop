const users = {
    admin: { username: "admin", password: "1234" },
    employees: {
      "Uwineza": "uw123",
      "Bernard": "bendo111",
      "Kalisa": "kali123",
      "Happy": "happ123",
      "Imbuto": "imbu123"
    }
  };
  
  function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;
    const error = document.getElementById("loginError");
  
    if (role === "admin") {
      if (username === users.admin.username && password === users.admin.password) {
        window.location.href = "admin.html";
      } else {
        error.textContent = "Invalid admin credentials.";
      }
    } else if (role === "employee") {
      if (users.employees[username] && users.employees[username] === password) {
        window.location.href = "employee.html?user=" + encodeURIComponent(username);
      } else {
        error.textContent = "Invalid employee credentials.";
      }
    } else if (role === "customer") {
      if (username.length > 0) {
        window.location.href = "customer.html?name=" + encodeURIComponent(username);
      } else {
        error.textContent = "Enter your name.";
      }
    }
  }
  