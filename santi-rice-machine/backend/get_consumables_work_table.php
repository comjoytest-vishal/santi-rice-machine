<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "machinery_db");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit();
}

/* =====================================================
   ✅ UPDATE PART (POST REQUEST)
===================================================== */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $id = $_POST['id'];

    // Remove id from update fields
    unset($_POST['id']);

    $fields = [];
    $values = [];
    $types = "";

    foreach ($_POST as $key => $value) {
        $fields[] = "$key=?";
        $values[] = $value;
        $types .= "s";
    }

    $types .= "i"; // for id
    $values[] = $id;

    $sql = "UPDATE consumable_entries SET " . implode(",", $fields) . " WHERE id=?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$values);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Updated successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Update failed"
        ]);
    }

    $stmt->close();
    $conn->close();
    exit();
}

/* =====================================================
   ✅ FETCH PART (GET REQUEST)
===================================================== */

$date = isset($_GET['date']) ? $_GET['date'] : "";

if ($date != "") {
    $stmt = $conn->prepare("
        SELECT * FROM consumable_entries 
        WHERE entry_date = ? 
        ORDER BY id DESC
    ");
    $stmt->bind_param("s", $date);
} else {
    $stmt = $conn->prepare("
        SELECT * FROM consumable_entries 
        ORDER BY id DESC
    ");
}

$stmt->execute();
$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $data
]);

$stmt->close();
$conn->close();
?>