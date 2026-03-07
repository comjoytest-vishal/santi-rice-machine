<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "machinery_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->machine_code) || !isset($data->machine_description)) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit();
}

$machine_code = trim($data->machine_code);
$machine_description = trim($data->machine_description);

/* ================= CHECK DUPLICATE ================= */
$check_stmt = $conn->prepare("SELECT id FROM machines WHERE machine_code = ?");
$check_stmt->bind_param("s", $machine_code);
$check_stmt->execute();
$check_stmt->store_result();

if ($check_stmt->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Machine code already exists"
    ]);
    $check_stmt->close();
    $conn->close();
    exit();
}
$check_stmt->close();

/* ================= INSERT DATA ================= */
$insert_stmt = $conn->prepare("INSERT INTO machines (machine_code, machine_description) VALUES (?, ?)");
$insert_stmt->bind_param("ss", $machine_code, $machine_description);

if ($insert_stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Machine added successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error inserting data"
    ]);
}

$insert_stmt->close();
$conn->close();
?>