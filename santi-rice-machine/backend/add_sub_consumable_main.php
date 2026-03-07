<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

$conn = new mysqli("localhost","root","","machinery_db");

if($conn->connect_error){
    echo json_encode([
        "success"=>false,
        "error"=>$conn->connect_error
    ]);
    exit();
}

/* GET JSON DATA */

$data = json_decode(file_get_contents("php://input"), true);

$machine_code = $data["machine_code"] ?? "";
$machine_description = $data["machine_description"] ?? "";
$parent_name = $data["parent_name"] ?? "";
$sub_name = $data["sub_name"] ?? "";
$date = $data["date"] ?? "";

$opening = intval($data["opening"] ?? 0);
$purchase = intval($data["purchase"] ?? 0);
$use_enter = intval($data["use_enter"] ?? 0);

$dealer = $data["dealer"] ?? "";
$staff = $data["staff"] ?? "";

$closing_entry = intval($data["closing_entry"] ?? 0);


/* INSERT */

$sql = "INSERT INTO sub_consumable_main
(machine_code,machine_description,parent_name,sub_name,date,opening,purchase,use_enter,dealer,staff,closing_entry)
VALUES (?,?,?,?,?,?,?,?,?,?,?)";

$stmt = $conn->prepare($sql);

if(!$stmt){
    echo json_encode([
        "success"=>false,
        "error"=>"Prepare Failed",
        "details"=>$conn->error
    ]);
    exit();
}

$stmt->bind_param(
"sssssiiissi",
$machine_code,
$machine_description,
$parent_name,
$sub_name,
$date,
$opening,
$purchase,
$use_enter,
$dealer,
$staff,
$closing_entry
);

if($stmt->execute()){

    echo json_encode([
        "success"=>true,
        "message"=>"Inserted"
    ]);

}else{

    echo json_encode([
        "success"=>false,
        "error"=>"Insert Failed",
        "details"=>$stmt->error
    ]);

}

$stmt->close();
$conn->close();