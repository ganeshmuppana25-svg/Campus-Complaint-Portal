// =====================================
// Admin Authentication
// =====================================

const admin = localStorage.getItem("admin");

if (!admin) {
    window.location.href = "admin-login.html";
}

// =====================================
// Logout
// =====================================

document.getElementById("logoutBtn").addEventListener("click", async () => {

    const result = await Swal.fire({

        title: "Logout?",

        text: "Are you sure you want to logout?",

        icon: "question",

        showCancelButton: true,

        confirmButtonColor: "#3085d6",

        cancelButtonColor: "#d33",

        confirmButtonText: "Logout",

        cancelButtonText: "Cancel"

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

        localStorage.removeItem("admin");

        window.location.href = "admin-login.html";

    }, 1000);

});

// =====================================
// Dashboard Statistics
// =====================================

let chart;

async function loadDashboard() {

    try {

        const response = await fetch("/api/complaints");

        const complaints = await response.json();

        const total = complaints.length;

        const pending = complaints.filter(
            c => c.status === "Pending"
        ).length;

        const progress = complaints.filter(
            c => c.status === "In Progress"
        ).length;

        const resolved = complaints.filter(
            c => c.status === "Resolved"
        ).length;

        document.getElementById("total").innerText = total;

        document.getElementById("pending").innerText = pending;

        document.getElementById("progress").innerText = progress;

        document.getElementById("resolved").innerText = resolved;

        drawChart(total, pending, progress, resolved);

    }

    catch (err) {

        console.error(err);

        Swal.fire({

            icon: "error",

            title: "Dashboard Error",

            text: "Unable to load dashboard."

        });

    }

}

// =====================================
// Draw Chart
// =====================================

function drawChart(total, pending, progress, resolved) {

    const ctx = document.getElementById("statusChart");

    if (chart) {

        chart.destroy();

    }

    chart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: [

                "Total",
                "Pending",
                "In Progress",
                "Resolved"

            ],

            datasets: [

                {

                    label: "Complaints",

                    data: [

                        total,
                        pending,
                        progress,
                        resolved

                    ],

                    backgroundColor: [

                        "#2563eb",
                        "#f59e0b",
                        "#8b5cf6",
                        "#10b981"

                    ],

                    borderRadius: 8

                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        stepSize: 1

                    }

                }

            }

        }

    });

}

// =====================================
// Initial Load
// =====================================

loadDashboard();