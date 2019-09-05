<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Content-type: text/html");

// http://stackoverflow.com/questions/28171434/php-post-arduino

$data = $_REQUEST["data"];
// $data = "21.90,20.9,2.10,1.00,988.11";

if(!empty($data)){

    $data = explode(",", $data);

    $time = time();
    $t = date("Y-m-d H:i:s",$time);

    $rdata = [];
    $rdata["temperature"] = (float)$data[0];
    $rdata["humidity"]    = (float)$data[2];
    $rdata["pressure"]    = (float)$data[3];
    $rdata["light"]       = (float)$data[4];

    $data_string = json_encode($rdata);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://arduino-weatherstation.now.sh/data');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
      'Content-Type: application/json',                                                                                
      'Content-Length: ' . strlen($data_string))                                                                       
    );    
    $result = curl_exec($ch);
    print $result . "\n";
}
