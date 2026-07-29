// ======================================
// Elements
// ======================================

const form = document.getElementById("adminLoginForm");

// ======================================
// Admin Login
// ======================================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // Validation

    if (!username || !password) {

        Swal.fire({

            icon: "warning",

            title: "Missing Details",

            text: "Please enter your username and password."

        });

        return;

    }

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

        const response = await fetch("/api/admin/login", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                username,
                password

            })

        });

        const result = await response.json();

        if (result.success) {

            localStorage.setItem("admin", "true");

            // Close loading popup
            Swal.close();

            // Show success toast
            showToast("success", "Admin Login Successful!");

            // Redirect after toast
            setTimeout(() => {

                window.location.href = "admin-dashboard.html";

            }, 1200);

        }

        else {

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

    if (password.type === "password") {

        password.type = "text";

    }

    else {

        password.type = "password";

    }

}