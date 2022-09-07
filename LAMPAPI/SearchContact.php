<?php

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
	
		$user_Input = trim($user_Input);
		$user_Input = explode(" ", $user_Input);

		if(count($user_Input) > 1)
		{
			$user_Input1 = '%' . $user_Input[0] . '%'; 
			$user_Input2 = '%' . $user_Input[1] . '%';
			$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName LIKE ? AND LastName LIKE ?) AND UserID = ?");
			$stmt->bind_param("ssi", $user_Input1, $user_Input2, $user_Id);
			//$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName LIKE ? AND LastName LIKE ?) AND UserID = ?");
			//$stmt->bind_param("ssi", $user_Input1, $user_Input2, $user_Id);
		}
		else
		{
			$user_Input = '%' . $user_Input[0] . '%';
			$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR phone LIKE ?) AND UserID = ?");
			$stmt->bind_param("ssssi", $user_Input, $user_Input, $user_Input, $user_Input, $user_Id);
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
			
				'"id": "'.$row["UserID"].'", '.

				'"firstName": "'.$row["FirstName"].'", '.

				'"lastName": "'.$row["LastName"].'", '.

				'"email": "'.$row["email"].'", '.

				'"phone": "'.$row["phone"].''.'"}';
		}

		//$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		
		if( $searchCount == 0 )
		{
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