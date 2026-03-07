<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "machinery_db");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed"]));
}

/* =========================
   DELETE RECORD
========================= */
if (isset($_GET['delete'])) {
    $id = intval($_GET['delete']);

    $stmt = $conn->prepare("DELETE FROM work_entry WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();

    echo json_encode(["message" => "Deleted successfully"]);
    exit();
}

/* =========================
   UPDATE RECORD
========================= */
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    $id = intval($data['id']);
    $machine_code = $data['machine_code'];
    $description = $data['description'];
    $work = $data['work'];
    $notes = $data['notes'];
    $staff = $data['staff'];
    $work_date = $data['work_date'];

    $stmt = $conn->prepare("UPDATE work_entry SET 
        machine_code = ?, 
        description = ?, 
        work = ?, 
        notes = ?, 
        staff = ?, 
        work_date = ?
        WHERE id = ?");

    $stmt->bind_param(
        "ssssssi",
        $machine_code,
        $description,
        $work,
        $notes,
        $staff,
        $work_date,
        $id
    );

    if ($stmt->execute()) {
        echo json_encode(["message" => "Updated successfully"]);
    } else {
        echo json_encode(["error" => "Update failed"]);
    }

    $stmt->close();
    exit();
}

/* =========================
   FETCH DATA
========================= */

$result = $conn->query("SELECT * FROM work_entry ORDER BY id DESC");

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$conn->close();
?>