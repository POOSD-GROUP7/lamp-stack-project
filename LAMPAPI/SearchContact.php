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

	$searchResults = "";
	$searchCount = 0;



	$user_Id = $inData["userId"];
	$user_Input = $inData["search"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		//$stmt = $conn->prepare("select Name from Colors where Name like ? and UserID=?");
		//$colorName = "%" . $inData["search"] . "%";
		//$stmt->bind_param("ss", $colorName, $inData["userId"]);
		//$stmt->execute();

		$text = '%' . $user_Input. '%';

		$user_Input = trim($user_Input);
		$user_Input = explode(" ", $user_Input);

		if(count($user_Input) > 1)
		{
			$user_Input1 = '%' . $user_Input[0] . '%';
			$user_Input2 = '%' . $user_Input[1] . '%';
			$stmt = $conn->prepare("SELECT * FROM Contacts WHERE ((FirstName LIKE ? AND LastName LIKE ?) OR address LIKE ?) AND UserID = ?");
			$stmt->bind_param("ssi", $user_Input1, $user_Input2, $text, $user_Id);

		}
		else
		{
			$user_Input = '%' . $user_Input[0] . '%';
			$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR email LIKE ? OR phone LIKE ? OR address LIKE ?) AND UserID = ?");
			$stmt->bind_param("sssssi", $user_Input, $user_Input, $user_Input, $user_Input, $user_Input, $user_Id);
		}

		$stmt->execute();

		$result = $stmt->get_result();

		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;

			$searchResults .= '{'.

				'"id": "'.$row["ID"].'", '.

				'"firstName": "'.$row["FirstName"].'", '.

				'"lastName": "'.$row["LastName"].'", '.

				'"email": "'.$row["email"].'", '.

				'"address": "'.$row["address"].'", '.

				'"createdAt": "'.$row["createdAt"].'", '.

				'"phone": "'.$row["phone"].''.'"}';
		}

		if( $searchCount == 0 )
		{
			http_response_code(404);
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}

		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
