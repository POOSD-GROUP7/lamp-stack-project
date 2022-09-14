<?php
	if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
		// return only the headers and not the content
		// only allow CORS if we're doing a GET - i.e. no saving for now.
		if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']) &&
			$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] == 'GET') {
		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Headers: X-Requested-With');
		}
		exit;
	}

	// ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);
	
	$inData = getRequestInfo();

    $id = $inData["id"];
	$firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phone = $inData["phone"];
	$address = $inData["address"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{

		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, email = ?, phone = ?, address = ? WHERE ID = ?");
		$stmt->bind_param("ssssss", $firstName, $lastName, $email, $phone, $address, $id);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>
