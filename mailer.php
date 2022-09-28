<?php

$to  = 'shadi.kabajah@gmail.com' ; 
$subject = 'Mailer Form - shadikabajah.com';

$name = $_POST["FirstName"];
$email = $_POST["email"];

$from = $name.'<'.$email.'>';

$crop = substr($name, 0, 2);

$message = $_POST["message"];

// Define a null 
$null = NULL;


?>



<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Email Sent</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link href='http://fonts.googleapis.com/css?family=Righteous' rel='stylesheet' type='text/css'>
	<link href="css/font-awesome.css" rel="stylesheet" type="text/css">
	<link href="css/main.css" rel="stylesheet">

</head>

<body>
	<div id="emailSent" >
	
	<?php 
	 if ( $email == $null) {
	 	echo  ("Message was not sent. Please enter a valid email.");
	 }
	 
	 elseif ( $crop == 59) { 
	 	echo  ("Message was not sent. Please enter a valid email.");
	 }
	 
	 else {
		echo "Message sent successfully.";
		mail($to, $subject, $_SERVER['REMOTE_ADDR']."\n\n".$message, "From: $from"."\n\n");
	 }
	?>
	
	<br>Thank you.<br>
		<a id="returnHome" class="fa fa-times" href="http://shadikabajah.com#footer"></a>
	</div>
</body>
</html>
