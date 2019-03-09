<?php

/**
 * Description of ControllerClass
 * @author Ville Ilkka
 */

class ControllerClass{
    
    function __construct($servername, $username, $password, $dbname){

        // Create connection
        $this->conn = mysqli_connect($servername, $username, $password, $dbname);

        // Check connection
        if(!$this->conn){
            return false;
        }
        
    }
    
    
    /*
     *  fetch all data from database
     */
    
    public function fetchAllObservations(){    
        $query = mysqli_query($this->conn, "SELECT * FROM observations");
        $rows = array();
        while($r = mysqli_fetch_assoc($query)) {
            $rows[] = $r;
        }
        return $rows;
                     
    }


    /*
     *  fetch latest data from database
     */
    
    public function fetchLatest(){
        return mysqli_query($this->conn, "SELECT * FROM observations ORDER BY id DESC LIMIT 1");

    }
    

    /*
     *  inser observation to database
     */
    
    public function addData($data){  
        
        $result = mysqli_fetch_array(mysqli_query($this->conn, "SELECT * FROM observations ORDER BY id DESC LIMIT 1"));
        $id = $result["id"];
            
        $query = "INSERT INTO `observations`(`time`, `temp`, `dew`, `hum`, `pres`, `light`)".
               " VALUES ('{$data['time']}','{$data['temp']}','{$data['dew']}','{$data['hum']}','{$data['pres']}','{$data['light']}')"; 
        mysqli_query($this->conn,"SELECT * FROM observations");
        $result = mysqli_query($this->conn, $query);
        
        return $result;

    }
    
}
