<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit();
}

$conn = new mysqli("localhost", "root", "", "machinery_db");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty(trim($data['sub_name']))) {
    echo json_encode(["success" => false, "message" => "Sub name required"]);
    exit();
}

$sub_name = trim($data['sub_name']);

$stmt = $conn->prepare("INSERT INTO sub_consumables (sub_name) VALUES (?)");

if (!$stmt) {
    echo json_encode(["success" => false, "message" => $conn->error]);
    exit();
}

$stmt->bind_param("s", $sub_name);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>