<?php
	$inData = getRequestInfo();
	
	$id = $inData["ID"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "DELETE FROM Contacts WHERE id=$id";
		$stmt = $conn->query($sql);
		$affected = mysqli_affected_rows($conn);
		$conn->close();
		if ($affected > 0) {
			returnSuccess("Succesful Delete");
		} else {
			returnWithError("Not found");
		}
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

	function returnSuccess( $msg )
	{
		$retValue = '{"response":"' . $msg . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
