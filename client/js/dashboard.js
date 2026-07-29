// =====================================
// Student Authentication
// =====================================

const student = JSON.parse(localStorage.getItem("student"));

if (!student) {
    window.location.href = "login.html";
}

// =====================================
// Display Student Information
// =====================================

document.getElementById("welcome").innerText =
    `Welcome, ${student.studentName || student.name} 👋`;

document.getElementById("studentName").innerText =
    student.studentName || student.name;

document.getElementById("studentId").innerText =
    student.studentId;

// =====================================
// Logout
// =====================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        const result = await Swal.fire({
            title: "Logout?",
            text: "Are you sure you want to logout?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33"
        });

        if (!result.isConfirmed) {
            return;
        }

        Swal.fire({
            title: "Logging Out...",
            text: "Please wait",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        setTimeout(() => {

            localStorage.removeItem("student");

            Swal.close();

            if (typeof showToast === "function") {
                showToast("success", "Logged out successfully!");
            }

            setTimeout(() => {
                window.location.href = "login.html";
            }, 800);

        }, 1000);

    });

}

// =====================================
// Load Dashboard Data
// =====================================

async function loadDashboard() {

    try {

        const response = await fetch("/api/complaints");

        if (!response.ok) {
            throw new Error("Failed to fetch complaints.");
        }

        const complaints = await response.json();

        // Current student's complaints
        const myComplaints = complaints.filter(c =>
            c.studentId === student.studentId
        );

        // Statistics
        const total = myComplaints.length;

        const pending = myComplaints.filter(c =>
            c.status === "Pending"
        ).length;

        const progress = myComplaints.filter(c =>
            c.status === "In Progress"
        ).length;

        const resolved = myComplaints.filter(c =>
            c.status === "Resolved"
        ).length;

        document.getElementById("totalComplaints").innerText = total;
        document.getElementById("pendingComplaints").innerText = pending;
        document.getElementById("progressComplaints").innerText = progress;
        document.getElementById("resolvedComplaints").innerText = resolved;

        // Recent Complaints Table
        const table = document.getElementById("recentComplaints");

        table.innerHTML = "";

        const recent = myComplaints.slice(-5).reverse();

        if (recent.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;">
                        No complaints submitted yet.
                    </td>
                </tr>
            `;

            return;
        }

        recent.forEach(c => {

            table.innerHTML += `
                <tr>
                    <td>${c.complaintId}</td>
                    <td>${c.category}</td>
                    <td>${c.title}</td>
                    <td>${c.status}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error("Dashboard Error:", error);

        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Unable to load dashboard."
        });

    }

}

// =====================================
// Initial Load
// =====================================

loadDashboard();