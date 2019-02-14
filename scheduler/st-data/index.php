<?php 

$scObj = new Schedular();

class Schedular {
    private $_mysqlHost;
    private $_mysqlUser;
    private $_mysqlPassword;
    private $_mysqlPort;
    private $_mysqlDb;

    public function __construct(){
        $this->_mysqlHost = '';
        $this->_mysqlUser = '';
        $this->_mysqlPassword = '';
        $this->_mysqlPort = '';
        $this->_mysqlDb = '';
        $this->_setMysqlCredentials();
    }

    public function getMeterDetails(){
        
    }


    private function _setMysqlCredentials(){
        $json = file_get_contents('./../../back-end/config_master.js', FILE_USE_INCLUDE_PATH);
        $data = explode(" ", $json);
        $this->pr($data);
        $this->_setMysqlHost($data[22]);
        $this->_setMysqlUser($data[44]);
        $this->_setMysqlPassword($data[67]);
        $this->_setMysqlPort($data[95]);
        $this->_setMysqlDb($data[124]);
    }

    private function _setMysqlDb($data = ''){
        if($data != ''){
            $datas = explode("'", $data);
            if(count($datas) > 0){
                $this->_mysqlDb = trim($datas[1]);
            }
        }
    }

    private function _setMysqlPort($data = ''){
        if($data != ''){
            $datas = explode(",", $data);
            if(count($datas) > 0){
                $this->_mysqlPort = trim($datas[0]);
            }
        }
    }

    private function _setMysqlPassword($data = ''){
        if($data != ''){
            $datas = explode("'", $data);
            if(count($datas) > 0){
                $this->_mysqlPassword = trim($datas[1]);
            }
        }
    }

    private function _setMysqlUser($data = ''){
        if($data != ''){
            $datas = explode("'", $data);
            if(count($datas) > 0){
                $this->_mysqlUser = trim($datas[1]);
            }
        }
    }

    private function _setMysqlHost($data = ''){
        if($data != ''){
            $datas = explode("'", $data);
            if(count($datas) > 0){
                $this->_mysqlHost = trim($datas[1]);
            }
        }
    }

    public function pr($data = array()){
        echo "<pre>";
        print_r($data);
        echo "</pre>";
    }
}

    
?>