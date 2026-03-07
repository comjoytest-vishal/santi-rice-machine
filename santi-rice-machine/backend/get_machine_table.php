<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json");

// -------------------------------------------------------------------------
// DATABASE CONFIG
// -------------------------------------------------------------------------
$host = '127.0.0.1';
$db   = 'machinery_db';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

$pdo = new PDO($dsn, $user, $pass, $options);

// -------------------------------------------------------------------------
// DELETE MACHINE
// URL: vis.php?delete=ID
// -------------------------------------------------------------------------
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];

    $stmt = $pdo->prepare("DELETE FROM machines WHERE id=?");
    $stmt->execute([$id]);

    echo json_encode(["status" => "deleted"]);
    exit;
}

// -------------------------------------------------------------------------
// UPDATE MACHINE (React will send JSON)
// -------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['id'])) {
        $stmt = $pdo->prepare("UPDATE machines SET machine_code=?, machine_description=? WHERE id=?");
        $stmt->execute([
            $data['machine_code'],
            $data['machine_description'],
            $data['id']
        ]);

        echo json_encode(["status" => "updated"]);
        exit;
    }
}

// -------------------------------------------------------------------------
// SEARCH MACHINE
// URL: vis.php?search=ABC
// -------------------------------------------------------------------------
if (isset($_GET['search'])) {

    $search = "%" . $_GET['search'] . "%";

    $stmt = $pdo->prepare("SELECT * FROM machines WHERE machine_code LIKE ? ORDER BY id DESC");
    $stmt->execute([$search]);

    echo json_encode($stmt->fetchAll());
    exit;
}

// -------------------------------------------------------------------------
// FETCH ALL MACHINES (DEFAULT)
// -------------------------------------------------------------------------
$stmt = $pdo->query("SELECT * FROM machines ORDER BY id DESC");
$machines = $stmt->fetchAll();

echo json_encode($machines);
exit;