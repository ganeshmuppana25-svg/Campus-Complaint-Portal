// ======================================
// Elements
// ======================================

const form = document.querySelector("form");

// ======================================
// Login
// ======================================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const studentId = document.getElementById("studentId").value.trim();
    const password = document.getElementById("password").value;

    if (!studentId || !password) {

        Swal.fire({
            icon: "warning",
            title: "Missing Details",
            text: "Please enter your Student ID and Password."
        });

        return;
    }

    const loginData = {
        studentId,
        password
    };

    try {

        Swal.fire({
            title: "Signing In...",
            text: "Please wait",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch("/api/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(loginData)

        });

        const result = await response.json();

        if (result.success) {

            localStorage.setItem(
                "student",
                JSON.stringify(result.student)
            );

            // Close loading popup
            Swal.close();

            // Show success toast
            showToast("success", "Login Successful!");

            // Redirect after toast
            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 1200);

        } else {

            Swal.fire({

                icon: "error",

                title: "Login Failed",

                text: result.message

            });

        }

    }

    catch (error) {

        console.error(error);

        Swal.fire({

            icon: "error",

            title: "Server Error",

            text: "Unable to connect to the server."

        });

    }

});

// ======================================
// Show / Hide Password
// ======================================

function togglePassword() {

    const password = document.getElementById("password");

    password.type =
        password.type === "password"
            ? "text"
            : "password";

}