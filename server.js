const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ======================================
// Middleware
// ======================================

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

// ======================================
// File Paths
// ======================================

const studentsFile = path.join(__dirname, "data", "students.json");
const complaintsFile = path.join(__dirname, "data", "complaints.json");

if (!fs.existsSync(studentsFile)) {
    fs.writeJsonSync(studentsFile, []);
}

if (!fs.existsSync(complaintsFile)) {
    fs.writeJsonSync(complaintsFile, []);
}

// ======================================
// Student Registration
// ======================================

app.post("/api/register", (req, res) => {

    const students = fs.readJsonSync(studentsFile);

    const student = req.body;

    const exists = students.find(
        s => s.studentId === student.studentId
    );

    if (exists) {

        return res.json({
            success: false,
            message: "Student ID already exists!"
        });

    }

    students.push(student);

    fs.writeJsonSync(studentsFile, students);

    res.json({
        success: true,
        message: "Registration Successful!"
    });

});

// ======================================
// Student Login
// ======================================

app.post("/api/login", (req, res) => {

    const { studentId, password } = req.body;

    const students = fs.readJsonSync(studentsFile);

    const student = students.find(
        s =>
            s.studentId === studentId &&
            s.password === password
    );

    if (!student) {

        return res.json({
            success: false,
            message: "Invalid Student ID or Password!"
        });

    }

    res.json({
        success: true,
        message: "Login Successful!",
        student
    });

});

// ======================================
// Submit Complaint
// ======================================

app.post("/api/complaints", (req, res) => {

    const complaints = fs.readJsonSync(complaintsFile);

    const complaint = req.body;

    complaint.complaintId =
        "CMP" + String(complaints.length + 1).padStart(4, "0");

    complaint.status = "Pending";

    complaint.date = new Date().toLocaleDateString();

    complaints.push(complaint);

    fs.writeJsonSync(complaintsFile, complaints);

    res.json({
        success: true,
        message: "Complaint Submitted Successfully!"
    });

});

// ======================================
// Get All Complaints
// ======================================

app.get("/api/complaints", (req, res) => {

    const complaints = fs.readJsonSync(complaintsFile);

    res.json(complaints);

});

// ======================================
// Update Complaint Status
// ======================================

app.put("/api/complaints/update", (req, res) => {

    const updatedComplaint = req.body;

    const complaints = fs.readJsonSync(complaintsFile);

    const index = complaints.findIndex(
        c => c.complaintId === updatedComplaint.complaintId
    );

    if (index === -1) {

        return res.json({
            success: false,
            message: "Complaint Not Found!"
        });

    }

    complaints[index] = updatedComplaint;

    fs.writeJsonSync(complaintsFile, complaints);

    res.json({
        success: true,
        message: "Complaint Status Updated Successfully!"
    });

});

// ======================================
// Delete Complaint
// ======================================

app.delete("/api/complaints/delete/:id", (req, res) => {

    const id = req.params.id;

    let complaints = fs.readJsonSync(complaintsFile);

    const exists = complaints.find(
        c => c.complaintId === id
    );

    if (!exists) {

        return res.json({
            success: false,
            message: "Complaint Not Found!"
        });

    }

    complaints = complaints.filter(
        c => c.complaintId !== id
    );

    fs.writeJsonSync(complaintsFile, complaints);

    res.json({
        success: true,
        message: "Complaint Deleted Successfully!"
    });

});

// ======================================
// Admin Login
// ======================================

app.post("/api/admin/login", (req, res) => {

    const { username, password } = req.body;

    if (
        username === "admin" &&
        password === "admin123"
    ) {

        return res.json({
            success: true,
            message: "Admin Login Successful!"
        });

    }

    res.json({
        success: false,
        message: "Invalid Admin Username or Password!"
    });

});

// ======================================
// Home Page
// ======================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "client", "index.html")
    );

});

// ======================================
// Start Server
// ======================================

app.listen(PORT, () => {

    console.log(`🚀 Server running at http://localhost:${PORT}`);

});