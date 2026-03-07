<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json");

// DATABASE CONNECTION
$conn = new mysqli("localhost", "root", "", "machinery_db");

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

/* =========================================================
   FETCH DATA (GET)
   ========================================================= */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $search = $_GET['search'] ?? '';

    if (!empty($search)) {
        $stmt = $conn->prepare("SELECT * FROM consumables 
                                WHERE consumable_name LIKE ?
                                ORDER BY consumable_name ASC");
        $like = "%" . $search . "%";
        $stmt->bind_param("s", $like);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = $conn->query("SELECT * FROM consumables ORDER BY consumable_name ASC");
    }

    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
    exit();
}

/* =========================================================
   UPDATE DATA (POST)
   ========================================================= */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        echo json_encode(["success" => false, "message" => "Invalid JSON"]);
        exit();
    }

    $action = $input['action'] ?? '';

    if ($action === 'update') {

        $id = $input['id'] ?? null;
        $name = $input['consumable_name'] ?? '';

        if (!$id || empty($name)) {
            echo json_encode(["success" => false, "message" => "Missing data"]);
            exit();
        }

        $stmt = $conn->prepare("UPDATE consumables SET consumable_name=? WHERE id=?");
        $stmt->bind_param("si", $name, $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }

        $stmt->close();
        exit();
    }

    echo json_encode(["success" => false, "message" => "Invalid action"]);
    exit();
}

echo json_encode(["success" => false, "message" => "Invalid request"]);
exit();