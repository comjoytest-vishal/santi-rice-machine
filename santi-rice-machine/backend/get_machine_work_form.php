<?php
// Turn off error display (important)
error_reporting(0);
ini_set('display_errors', 0);

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {

    $conn = new mysqli("localhost", "root", "", "machinery_db");

    if ($conn->connect_error) {
        throw new Exception("Database connection failed");
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['machine_code']) || empty($data['machine_code'])) {
        echo json_encode([
            "success" => false,
            "message" => "Machine code required"
        ]);
        exit();
    }

    $machine_code = trim($data['machine_code']);

    $stmt = $conn->prepare("SELECT machine_description FROM machines WHERE machine_code = ?");
    $stmt->bind_param("s", $machine_code);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode([
            "success" => true,
            "description" => $row['machine_description']
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Machine not found"
        ]);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
