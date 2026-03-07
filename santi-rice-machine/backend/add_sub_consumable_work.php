<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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
        "message" => $conn->connect_error
    ]);
    exit();
}

/* ======================
   GET JSON DATA
====================== */
$data = json_decode(file_get_contents("php://input"), true);

$parent_id = $data['parent_id'] ?? null;
$sub_consumables = $data['sub_consumables'] ?? [];

/* ======================
   VALIDATION
====================== */
if (!$parent_id || !is_array($sub_consumables) || count($sub_consumables) === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid data"
    ]);
    exit();
}

/* ======================
   INSERT MULTIPLE ROWS
====================== */
$stmt = $conn->prepare("INSERT INTO sub_consumable_work (parent_id, sub_name) VALUES (?, ?)");

foreach ($sub_consumables as $sub) {

    $sub = trim($sub);

    if ($sub === "") {
        continue;
    }

    $stmt->bind_param("is", $parent_id, $sub);
    $stmt->execute();
}

$stmt->close();

echo json_encode([
    "success" => true,
    "message" => "Sub consumables saved successfully"
]);

$conn->close();
?>