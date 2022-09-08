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
	
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["Login"];
    $password = $inData["Password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		http_response_code(201);
		returnWithInfo("Successful Creation");
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
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>