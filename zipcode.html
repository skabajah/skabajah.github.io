<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Zipcode</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes;" />
	<link href="https://fonts.googleapis.com/css?family=Josefin+Sans|Kreon|Ubuntu+Mono" rel="stylesheet">
	<link href="css/font-awesome.css" rel="stylesheet" type="text/css">
	<link href="css/bootstrap.min.css" rel="stylesheet">
	<link href="css/main.css" rel="stylesheet">
</head>

<body>
	<div class="row clearfix" id="zipcodes" style="padding:0% 10%">
		<div class="col-md-12 column">
			<form class="form-group" method="post">
					<div class="form-group">
					<h2>Enter a zipcode:</h2>
					<h5 style="color:white;">or enter multiple zipcodes seperated by a comma</h5>
						 <label for="entry"></label>
						 <input class="form-control" name="entry" type="text" placeholder="94110,95110,..."/>
					</div>
				<input class="btn btn-default" name="Go" type="submit" value="Go">
			</form>	
		</div>
	<?php
		$entry = $_POST["entry"];
		$servername = "localhost";
		$username ="kabajah-view";
		$password ="123456";
		$dbName ="shadikabajah-zipcodes";


		//create connection
		$conn = new mysqli($servername, $username, $password, $dbName);

		if ($conn -> connect_error){
		die ("connection failed: " . $conn -> connect_error);
		}

		$sql = "SELECT * FROM `tbl` WHERE `zipcode` IN ($entry)";
	 

		$result = $conn ->query($sql);

		if ($result-> num_rows >0){

		echo "<div><table class='table'><tr><th>zipcode</th><th>city</th><th>state</th><th>type</th></tr>";
		while($row = $result -> fetch_assoc()){
			echo"<tr><td>" . $row["zipcode"] . "</td><td>" . $row["city"] . "</td><td>" . $row["state"] . "</td><td>" . $row["type"] . "</td></tr>";
		}	
		echo"</table></div>";


		}else{
			echo"0 results";
		}

		$conn->close();

		?>
	<a id="returnHome" class="fa fa-times" href="http://shadikabajah.com/#examples"></a>
	<h6 style="color:#ccc;float:right;">source: US Gov (data.gov)</h6>
	</div>
</body>
</html>
