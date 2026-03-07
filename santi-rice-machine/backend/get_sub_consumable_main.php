<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

/* DATABASE CONNECTION */

$conn = new mysqli("localhost","root","","machinery_db");

if($conn->connect_error){
    echo json_encode([
        "success"=>false,
        "error"=>$conn->connect_error
    ]);
    exit();
}

/* FETCH DATA */

$sql = "SELECT * FROM sub_consumable_main ORDER BY id DESC";

$result = $conn->query($sql);

$data = [];

if($result){

    while($row = $result->fetch_assoc()){
        $data[] = $row;
    }

    echo json_encode([
        "success"=>true,
        "data"=>$data
    ]);

}else{

    echo json_encode([
        "success"=>false,
        "error"=>$conn->error
    ]);

}

$conn->close();

?>