<?php
#ini_set('display_errors', 1);
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Content-type: text/html");

require_once "settings.php";
require_once "ControllerClass.php";

// http://stackoverflow.com/questions/28171434/php-post-arduino

$data = $_REQUEST["data"];
//$data = "21.90,2.10,1.00,988.11";

if(!empty($data)){

    $data = explode(",", $data);
    $user = new ControllerClass($servername, $username, $password, $dbname);

    $time = time();
    $t = date("Y-m-d H:i:s",$time);
    $year = date("Y",$time);
    $month = date("m",$time);
    $day = date("d",$time);
    $hour = date("H",$time);
    $min = date("i",$time);

    $rdata = [];
    $rdata["time"]  = $t;
    $rdata["temp"]  = $data[0];
    $rdata["dew"]   = $data[1];
    $rdata["hum"]   = $data[2];    
    $rdata["pres"]  = $data[3];     
    $rdata["light"] = null;
    
    $user->addData($rdata);
}
?>
