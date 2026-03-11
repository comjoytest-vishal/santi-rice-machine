<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

/* PREFLIGHT */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/* ONLY POST */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit();
}

/* DATABASE */
$conn = new mysqli("localhost", "root", "", "machinery_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => $conn->connect_error]);
    exit();
}

/* GET JSON */
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "No data received"]);
    exit();
}

////////////////////////////////////////////
//// DELETE SECTION
////////////////////////////////////////////

if (isset($data['id'])) {

    $id = intval($data['id']);

    $stmt = $conn->prepare("DELETE FROM sub_consumables WHERE id=?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Deleted successfully"
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

////////////////////////////////////////////
//// INSERT SECTION
////////////////////////////////////////////

if (empty(trim($data['sub_name']))) {
    echo json_encode(["success" => false, "message" => "Sub name required"]);
    exit();
}

$sub_name = trim($data['sub_name']);

/* CHECK DUPLICATE (CASE INSENSITIVE) */

$check = $conn->prepare(
    "SELECT id FROM sub_consumables WHERE LOWER(sub_name) = LOWER(?)"
);

$check->bind_param("s", $sub_name);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {

    echo json_encode([
        "success" => false,
        "message" => "EXISTS"
    ]);

    exit();
}

$check->close();

/* INSERT */

$stmt = $conn->prepare(
    "INSERT INTO sub_consumables (sub_name) VALUES (?)"
);

$stmt->bind_param("s", $sub_name);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Inserted successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);

}

$stmt->close();
$conn->close();
?>