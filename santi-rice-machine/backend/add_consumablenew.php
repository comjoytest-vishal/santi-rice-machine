<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Include database connection
require_once "database.php";

$data = json_decode(file_get_contents("php://input"), true);

// Validate if data exists
if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON data"
    ]);
    exit();
}

$name = trim($data['consumable_name'] ?? '');

if ($name == "") {
    echo json_encode([
        "success" => false,
        "message" => "Consumable name required"
    ]);
    exit();
}

/* CHECK DUPLICATE (CASE INSENSITIVE) */
$check = $conn->prepare("SELECT id FROM consumables WHERE LOWER(consumable_name) = LOWER(?)");
$check->bind_param("s", $name);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Consumable already exists"
    ]);
    $check->close();
    exit();
}
$check->close();

/* INSERT DATA */
$stmt = $conn->prepare("INSERT INTO consumables (consumable_name) VALUES (?)");
$stmt->bind_param("s", $name);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Consumable added successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Insert failed: " . $conn->error
    ]);
}

$stmt->close();
$conn->close();
?>