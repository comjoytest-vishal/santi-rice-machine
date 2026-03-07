<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$conn = new mysqli("localhost", "root", "", "machinery_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);

$machineCode = trim($data['machineCode'] ?? '');
$description = trim($data['description'] ?? '');
$work = trim($data['work'] ?? '');
$notes = trim($data['notes'] ?? '');
$staff = trim($data['staff'] ?? '');
$date = trim($data['date'] ?? '');

// Basic validation
if ($machineCode == '' || $work == '' || $date == '') {
    echo json_encode([
        "success" => false,
        "message" => "Required fields missing"
    ]);
    exit();
}

/* ================= CHECK DUPLICATE ================= */
$check = $conn->prepare("SELECT id FROM work_entry WHERE machine_code = ? AND work = ? AND work_date = ?");
$check->bind_param("sss", $machineCode, $work, $date);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Work entry already exists for this machine on this date"
    ]);
    $check->close();
    $conn->close();
    exit();
}
$check->close();

/* ================= INSERT ================= */
$stmt = $conn->prepare("INSERT INTO work_entry 
(machine_code, description, work, notes, staff, work_date) 
VALUES (?, ?, ?, ?, ?, ?)");

$stmt->bind_param("ssssss", $machineCode, $description, $work, $notes, $staff, $date);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Work entry added successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error inserting data"
    ]);
}

$stmt->close();
$conn->close();
?>