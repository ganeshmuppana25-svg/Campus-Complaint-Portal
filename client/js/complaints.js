// =====================================
// Student Authentication
// =====================================

const student = JSON.parse(localStorage.getItem("student"));

if (!student) {
    window.location.href = "login.html";
}

// =====================================
// Elements
// =====================================

const table = document.getElementById("complaintsTable");
const search = document.getElementById("search");

const modal = document.getElementById("complaintModal");
const details = document.getElementById("complaintDetails");
const closeModal = document.getElementById("closeModal");

let complaints = [];

// =====================================
// Load Complaints
// =====================================

async function loadComplaints() {

    try {

        const response = await fetch("/api/complaints");

        const allComplaints = await response.json();

        complaints = allComplaints.filter(c =>
            c.studentId === student.studentId
        );

        displayComplaints(complaints);

    } catch (error) {

        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Unable to Load",
            text: "Unable to load complaints."
        });

    }

}

// =====================================
// Display Complaints
// =====================================

function displayComplaints(data) {

    table.innerHTML = "";

    if (data.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8">No complaints found.</td>
            </tr>
        `;

        return;
    }

    data.slice().reverse().forEach(c => {

        let statusClass = "";

        if (c.status === "Pending") {

            statusClass = "pending";

        } else if (c.status === "In Progress") {

            statusClass = "progress";

        } else {

            statusClass = "resolved";

        }

        let priorityClass = "";

        if (c.priority === "High") {

            priorityClass = "high";

        } else if (c.priority === "Medium") {

            priorityClass = "medium";

        } else {

            priorityClass = "low";

        }

        table.innerHTML += `

        <tr>

            <td>${c.complaintId}</td>

            <td>${c.category}</td>

            <td>${c.title}</td>

            <td>
                <span class="badge ${priorityClass}">
                    ${c.priority}
                </span>
            </td>

            <td>
                <span class="badge ${statusClass}">
                    ${c.status}
                </span>
            </td>

            <td>${c.date}</td>

            <td>
                <button onclick="viewComplaint('${c.complaintId}')">
                    View
                </button>
            </td>

            <td>
                <button onclick="downloadPDF('${c.complaintId}')">
                    📄 PDF
                </button>
            </td>

        </tr>

        `;

    });

}

// =====================================
// View Complaint
// =====================================

function viewComplaint(id) {

    const complaint = complaints.find(c => c.complaintId === id);

    if (!complaint) return;

    details.innerHTML = `

        <p><strong>Complaint ID:</strong> ${complaint.complaintId}</p>

        <p><strong>Student ID:</strong> ${complaint.studentId}</p>

        <p><strong>Student Name:</strong> ${complaint.studentName}</p>

        <p><strong>Category:</strong> ${complaint.category}</p>

        <p><strong>Priority:</strong> ${complaint.priority}</p>

        <p><strong>Title:</strong> ${complaint.title}</p>

        <p><strong>Description:</strong></p>

        <p>${complaint.description}</p>

        <p><strong>Status:</strong> ${complaint.status}</p>

        <p><strong>Date:</strong> ${complaint.date}</p>

    `;

    modal.style.display = "block";

}

// =====================================
// Download PDF
// =====================================

function downloadPDF(id) {

    const complaint = complaints.find(c => c.complaintId === id);

    if (!complaint) return;

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Campus Complaint Portal", 20, 20);

    doc.setFontSize(15);
    doc.text("Complaint Receipt", 20, 32);

    doc.setFontSize(12);

    let y = 50;

    const addLine = (label, value) => {
        doc.text(`${label}: ${value}`, 20, y);
        y += 10;
    };

    addLine("Complaint ID", complaint.complaintId);
    addLine("Student Name", complaint.studentName);
    addLine("Student ID", complaint.studentId);
    addLine("Category", complaint.category);
    addLine("Priority", complaint.priority);
    addLine("Status", complaint.status);
    addLine("Title", complaint.title);

    doc.text("Description:", 20, y);
    y += 8;

    const lines = doc.splitTextToSize(complaint.description, 170);
    doc.text(lines, 20, y);

    y += lines.length * 8 + 10;

    addLine("Date", complaint.date);

    y += 10;

    doc.setFontSize(10);
    doc.text("Generated Automatically by Campus Complaint Portal", 20, y);

    doc.save(`Complaint_${complaint.complaintId}.pdf`);

}

// =====================================
// Close Modal
// =====================================

closeModal.onclick = () => {

    modal.style.display = "none";

};

window.onclick = (event) => {

    if (event.target === modal) {

        modal.style.display = "none";

    }

};

// =====================================
// Search
// =====================================

search.addEventListener("input", () => {

    const value = search.value.toLowerCase();

    const filtered = complaints.filter(c =>

        c.complaintId.toLowerCase().includes(value) ||

        c.category.toLowerCase().includes(value) ||

        c.title.toLowerCase().includes(value)

    );

    displayComplaints(filtered);

});

// =====================================
// Initial Load
// =====================================

loadComplaints();