// ======================================
// Student Authentication
// ======================================

const student = JSON.parse(localStorage.getItem("student"));

if (!student) {
    window.location.href = "login.html";
}

// ======================================
// Elements
// ======================================

const form = document.getElementById("complaintForm");

// Check if form exists
if (!form) {
    console.error("Complaint form not found! Make sure your form has id='complaintForm'.");
}

// ======================================
// Submit Complaint
// ======================================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const category = document.getElementById("category").value;
    const priority = document.getElementById("priority").value;
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!category || !priority || !title || !description) {

        Swal.fire({
            icon: "warning",
            title: "Missing Details",
            text: "Please fill in all the fields."
        });

        return;
    }

    const complaint = {

        studentId: student.studentId,
        studentName: student.studentName || student.name,
        category,
        priority,
        title,
        description

    };

    try {

        Swal.fire({

            title: "Submitting Complaint...",
            text: "Please wait",
            allowOutsideClick: false,
            allowEscapeKey: false,

            didOpen: () => {
                Swal.showLoading();
            }

        });

        const response = await fetch("/api/complaints", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(complaint)

        });

        const result = await response.json();

        if (result.success) {

            Swal.close();

            showToast("success", "Complaint Submitted Successfully!");

            setTimeout(() => {
                window.location.href = "complaints.html";
            }, 1200);

        } else {

            Swal.fire({

                icon: "error",
                title: "Submission Failed",
                text: result.message || "Unable to submit complaint."

            });

        }

    } catch (error) {

        console.error("Complaint Error:", error);

        Swal.fire({

            icon: "error",
            title: "Server Error",
            text: "Unable to connect to the server."

        });

    }

});