// ===============================
// Admin Authentication
// ===============================

const admin = localStorage.getItem("admin");

if (!admin) {
    window.location.href = "admin-login.html";
}

// ===============================
// Elements
// ===============================

const table = document.getElementById("complaintsTable");
const search = document.getElementById("search");

const modal = document.getElementById("complaintModal");
const details = document.getElementById("complaintDetails");
const closeModal = document.getElementById("closeModal");

let complaints = [];

// ===============================
// Load Complaints
// ===============================

async function loadComplaints() {

    try {

        const response = await fetch("/api/complaints");

        complaints = await response.json();

        displayComplaints(complaints);

    } catch (error) {

        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Unable to load complaints."
        });

    }

}

// ===============================
// Display Complaints
// ===============================

function displayComplaints(data) {

    table.innerHTML = "";

    if (data.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="10">No Complaints Found</td>
            </tr>
        `;

        return;
    }

    data.forEach(c => {

        table.innerHTML += `

        <tr>

            <td>${c.complaintId}</td>

            <td>${c.studentId}</td>

            <td>${c.studentName}</td>

            <td>${c.category}</td>

            <td>${c.priority}</td>

            <td>

                <select onchange="changeStatus('${c.complaintId}', this.value)">

                    <option value="Pending" ${c.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="In Progress" ${c.status === "In Progress" ? "selected" : ""}>
                        In Progress
                    </option>

                    <option value="Resolved" ${c.status === "Resolved" ? "selected" : ""}>
                        Resolved
                    </option>

                </select>

            </td>

            <td>${c.date}</td>

            <td>

                <button onclick="viewComplaint('${c.complaintId}')">
                    View
                </button>

            </td>

            <td>

                <button onclick="saveStatus('${c.complaintId}')">
                    Save
                </button>

            </td>

            <td>

                <button
                    style="background:#dc2626"
                    onclick="deleteComplaint('${c.complaintId}')">
                    Delete
                </button>

            </td>

        </tr>

        `;

    });

}

// ===============================
// View Complaint
// ===============================

function viewComplaint(id) {

    const c = complaints.find(item => item.complaintId === id);

    if (!c) return;

    details.innerHTML = `

        <p><strong>Complaint ID:</strong> ${c.complaintId}</p>

        <p><strong>Student ID:</strong> ${c.studentId}</p>

        <p><strong>Student Name:</strong> ${c.studentName}</p>

        <p><strong>Category:</strong> ${c.category}</p>

        <p><strong>Priority:</strong> ${c.priority}</p>

        <p><strong>Title:</strong> ${c.title}</p>

        <p><strong>Description:</strong></p>

        <p>${c.description}</p>

        <p><strong>Status:</strong> ${c.status}</p>

        <p><strong>Date:</strong> ${c.date}</p>

    `;

    modal.style.display = "block";

}

// ===============================
// Close Modal
// ===============================

closeModal.onclick = () => {

    modal.style.display = "none";

};

window.onclick = (event) => {

    if (event.target === modal) {

        modal.style.display = "none";

    }

};

// ===============================
// Change Status
// ===============================

function changeStatus(id, status) {

    const complaint = complaints.find(c => c.complaintId === id);

    if (complaint) {

        complaint.status = status;

    }

}

// ===============================
// Save Status
// ===============================

async function saveStatus(id) {

    const complaint = complaints.find(c => c.complaintId === id);

    try {

        Swal.fire({

            title: "Updating Status...",

            text: "Please wait",

            allowOutsideClick: false,

            allowEscapeKey: false,

            didOpen: () => {

                Swal.showLoading();

            }

        });

        const response = await fetch("/api/complaints/update", {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(complaint)

        });

        const result = await response.json();

        if (result.success) {

            await Swal.fire({

                icon: "success",

                title: "Status Updated",

                text: result.message,

                timer: 1500,

                showConfirmButton: false

            });

        } else {

            Swal.fire({

                icon: "error",

                title: "Update Failed",

                text: result.message

            });

        }

        loadComplaints();

    } catch (error) {

        console.error(error);

        Swal.fire({

            icon: "error",

            title: "Server Error",

            text: "Unable to update complaint."

        });

    }

}

// ===============================
// Delete Complaint
// ===============================

async function deleteComplaint(id) {

    const confirmation = await Swal.fire({

        title: "Delete Complaint?",

        text: "This action cannot be undone.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#d33",

        cancelButtonColor: "#3085d6",

        confirmButtonText: "Yes, Delete",

        cancelButtonText: "Cancel"

    });

    if (!confirmation.isConfirmed) {

        return;

    }

    try {

        Swal.fire({

            title: "Deleting Complaint...",

            text: "Please wait",

            allowOutsideClick: false,

            allowEscapeKey: false,

            didOpen: () => {

                Swal.showLoading();

            }

        });

        const response = await fetch("/api/complaints/delete/" + id, {

            method: "DELETE"

        });

        const result = await response.json();

        if (result.success) {

            await Swal.fire({

                icon: "success",

                title: "Deleted Successfully",

                text: result.message,

                timer: 1500,

                showConfirmButton: false

            });

        } else {

            Swal.fire({

                icon: "error",

                title: "Delete Failed",

                text: result.message

            });

        }

        loadComplaints();

    } catch (error) {

        console.error(error);

        Swal.fire({

            icon: "error",

            title: "Server Error",

            text: "Unable to delete complaint."

        });

    }

}

// ===============================
// Search
// ===============================

search.addEventListener("input", () => {

    const value = search.value.toLowerCase();

    const filtered = complaints.filter(c =>

        c.complaintId.toLowerCase().includes(value) ||

        c.studentId.toLowerCase().includes(value) ||

        c.studentName.toLowerCase().includes(value) ||

        c.category.toLowerCase().includes(value)

    );

    displayComplaints(filtered);

});

// ===============================
// Start
// ===============================

loadComplaints();
// Make functions available to HTML buttons
window.viewComplaint = viewComplaint;
window.changeStatus = changeStatus;
window.saveStatus = saveStatus;
window.deleteComplaint = deleteComplaint;