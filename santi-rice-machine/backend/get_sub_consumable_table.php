<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "machinery_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => $conn->connect_error]);
    exit();
}

/* ========================
   UPDATE SECTION (POST)
======================== */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'] ?? '';
    $sub_name = trim($data['sub_name'] ?? '');

    if (!$id || $sub_name === '') {
        echo json_encode(["success" => false, "message" => "Invalid data"]);
        exit();
    }

    $stmt = $conn->prepare("UPDATE sub_consumables SET sub_name=? WHERE id=?");
    $stmt->bind_param("si", $sub_name, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }

    $stmt->close();
    $conn->close();
    exit();
}

/* ========================
   FETCH SECTION (GET)
======================== */

$sql = "SELECT id, sub_name, created_at FROM sub_consumables ORDER BY id DESC";
$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $data
]);

$conn->close();
?>