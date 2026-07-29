// ======================================
// Elements
// ======================================

const form = document.querySelector("form");

// ======================================
// Register Student
// ======================================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const studentName = document.getElementById("name").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const department = document.getElementById("department").value.trim();
    const year = document.getElementById("year").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validation

    if (
        !studentName ||
        !studentId ||
        !email ||
        !phone ||
        !department ||
        !year ||
        !password ||
        !confirmPassword
    ) {

        Swal.fire({
            icon: "warning",
            title: "Missing Details",
            text: "Please fill in all the fields."
        });

        return;

    }

    if (password !== confirmPassword) {

        Swal.fire({
            icon: "error",
            title: "Password Mismatch",
            text: "Password and Confirm Password must be the same."
        });

        return;

    }

    const student = {

        studentName,
        studentId,
        email,
        phone,
        department,
        year,
        password

    };

    try {

        Swal.fire({

            title: "Creating Account...",

            text: "Please wait",

            allowOutsideClick: false,

            allowEscapeKey: false,

            didOpen: () => {

                Swal.showLoading();

            }

        });

        const response = await fetch("/api/register", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(student)

        });

        const result = await response.json();

        if (result.success) {

            // Close loading popup
            Swal.close();

            // Show success toast
            showToast("success", "Registration Successful!");

            // Redirect after toast
            setTimeout(() => {

                window.location.href = "login.html";

            }, 1200);

        }

        else {

            Swal.fire({

                icon: "error",

                title: "Registration Failed",

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
    const confirmPassword = document.getElementById("confirmPassword");

    if (password.type === "password") {

        password.type = "text";
        confirmPassword.type = "text";

    }

    else {

        password.type = "password";
        confirmPassword.type = "password";

    }

}