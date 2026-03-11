<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/* DATABASE */

$conn = new mysqli("localhost","root","","machinery_db");

if ($conn->connect_error) {
    echo json_encode([
        "success"=>false,
        "message"=>$conn->connect_error
    ]);
    exit();
}

/* DELETE OR UPDATE */

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'] ?? null;
    $sub_name = trim($data['sub_name'] ?? '');

    /* DELETE */

    if ($id && $sub_name === '') {

        $stmt = $conn->prepare("DELETE FROM sub_consumables WHERE id=?");
        $stmt->bind_param("i",$id);

        if ($stmt->execute()) {

            echo json_encode([
                "success"=>true,
                "message"=>"Deleted successfully"
            ]);

        } else {

            echo json_encode([
                "success"=>false,
                "message"=>$stmt->error
            ]);

        }

        $stmt->close();
        $conn->close();
        exit();
    }

    /* UPDATE */

    if ($id && $sub_name !== '') {

        $stmt = $conn->prepare("UPDATE sub_consumables SET sub_name=? WHERE id=?");
        $stmt->bind_param("si",$sub_name,$id);

        if ($stmt->execute()) {

            echo json_encode([
                "success"=>true,
                "message"=>"Updated successfully"
            ]);

        } else {

            echo json_encode([
                "success"=>false,
                "message"=>$stmt->error
            ]);

        }

        $stmt->close();
        $conn->close();
        exit();
    }

}

/* FETCH DATA */

$sql = "SELECT id, sub_name, created_at 
        FROM sub_consumables
        ORDER BY id DESC";

$result = $conn->query($sql);

$data = [];

while($row = $result->fetch_assoc()){
    $data[] = $row;
}

echo json_encode([
    "success"=>true,
    "data"=>$data
]);

$conn->close();

?>