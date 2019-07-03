<?php
#!/usr/bin/php -q

require_once "settings.php";
require_once "ControllerClass.php";

$user = new ControllerClass($servername, $username, $password, $dbname);
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error() . "\n";
    die();
} else {
    $data = $user->fetchAllObservations();
}

$time  = [];
$temp  = [];
$tdew  = [];
$hr    = [];
$light = [];
$pres  = [];

foreach($data as $array) {

    $date = new DateTime($array['time']);
    $timestamp = $date->format('U');

    array_push($time, $timestamp);
    array_push($temp, $array['temp']);
    array_push($tdew, $array['dew']);
    array_push($hr, $array['hum']);
    array_push($pres, $array['pres']);
    array_push($light, $array['light']);
}

$temp  = "\"Temperature\":".formatData($time,$temp);
$tdew  = "\"DewPoint\":".formatData($time,$tdew);
$hr    = "\"Humidity\":".formatData($time,$hr);
$light = "\"Light\":".formatData($time,$light);
$pres  = "\"Pressure\":".formatData($time,$pres); 

$data = "{".$temp.",".$tdew.",".$hr.",".$light.",".$pres."}";
echo $data;




    
function formatData($time,$data) {

    $i = 0;
    $datastring = "[";

    while($i < count($data)-1){
        $datastring = $datastring . "[" . 1000*$time[$i] . "," . $data[$i] . "],";
        $i = $i + 1;

    }
    
    // remove last comma and close brackets
    $datastring = substr($datastring, 0, -1);
    $datastring = $datastring . "]";

    return $datastring;
}
