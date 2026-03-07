<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// ================= DATABASE CONNECTION =================
$conn = new mysqli("localhost", "root", "", "machinery_db");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit();
}

// ================= GET JSON DATA =================
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON data"
    ]);
    exit();
}

// ================= VALIDATE REQUIRED FIELDS =================
if (
    empty($data['date']) ||
    empty($data['machine_code']) ||
    empty($data['consumable_name'])
) {
    echo json_encode([
        "success" => false,
        "message" => "Required fields missing"
    ]);
    exit();
}

// ================= PREPARE INSERT QUERY =================
$stmt = $conn->prepare("
    INSERT INTO consumable_entries
    (entry_date, machine_code, machine_description, consumable_name,
     opening, dealer_entry, purchase_entry, use_entry, staff, closing_entry)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "ssssisiisi",
    $data['date'],
    $data['machine_code'],
    $data['machine_description'],
    $data['consumable_name'],
    $data['opening'],
    $data['dealer_entry'],
    $data['purchase_entry'],
    $data['use_entry'],
    $data['staff'],
    $data['closing_entry']
);

// ================= EXECUTE =================
if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Entry saved successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Insert failed"
    ]);
}

$stmt->close();
$conn->close();