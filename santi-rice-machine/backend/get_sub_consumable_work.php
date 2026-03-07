<?php

error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

/* ======================
   HANDLE PREFLIGHT
====================== */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/* ======================
   DATABASE CONNECTION
====================== */
$conn = new mysqli("localhost", "root", "", "machinery_db");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed",
        "error" => $conn->connect_error
    ]);
    exit();
}

/* ======================
   UPDATE SECTION
====================== */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'] ?? null;
    $sub_name = trim($data['sub_name'] ?? '');

    if (!$id || $sub_name === '') {
        echo json_encode([
            "success" => false,
            "message" => "Invalid data"
        ]);
        exit();
    }

    $stmt = $conn->prepare("UPDATE sub_consumable_work SET sub_name=? WHERE id=?");

    if (!$stmt) {
        echo json_encode([
            "success" => false,
            "message" => $conn->error
        ]);
        exit();
    }

    $stmt->bind_param("si", $sub_name, $id);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => $stmt->error
        ]);
    }

    $stmt->close();
    $conn->close();
    exit();
}

/* ======================
   FETCH SECTION
====================== */

$sql = "SELECT 
            w.id,
            w.parent_id,
            s.sub_name AS parent_name,
            w.sub_name,
            w.created_at
        FROM sub_consumable_work w
        LEFT JOIN sub_consumables s 
            ON w.parent_id = s.id
        ORDER BY w.id DESC";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit();
}

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