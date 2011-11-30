<?php
include_once('lib/db.php');

ini_set('default_charset', 'UTF-8');

$jr = new JsonResponse('127.0.0.1', '', '', '');
$jr->init();

class JsonResponse {

	public function __construct($hostname, $username, $password, $db) {

		try {
			$this->dbh = new PDO("mysql:host=$hostname;dbname=$db", $username, $password,
              array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
		} catch(PDOException $e) {
			print 'Exception : '.$e->getMessage();
		}
	}

	public function init(){
		$this->openJSON();
	
		$qry = null;
		if(isset($_REQUEST['qry'])){
			$qry = filter_var($_REQUEST['qry'], FILTER_SANITIZE_STRING);
			if((!$qry) || ($qry == "")) { $qry = ""; } else { $qry = "+(".$qry.")"; }
		}

		$lmt = 10;
		if(isset($_REQUEST['lmt'])){
			$lmt = (int)$_REQUEST['lmt'];
		}

		$imgRes = '?100x100';
		if(isset($_REQUEST['res'])){
			$imgRes = filter_var($_REQUEST['res'], FILTER_SANITIZE_STRING);
		}

		try {
			//retrieve data
			$sql = "SELECT * FROM assets ";
			if($qry){
				$sql = "SELECT *, ";
			    $sql .= "MATCH(title, description) AGAINST ('$qry' IN BOOLEAN MODE) AS score ";
			    $sql .= "FROM assets ";
			    $sql .= "WHERE MATCH(title, description) AGAINST ('$qry' IN BOOLEAN MODE) ";
			}
			$sql .= "LIMIT $lmt ";

			foreach ($this->dbh->query($sql) as $row){
				$node = array(
					'title' => $row['title'],
			  		'desc' => $row['description'],
			  		'id' => $row['objectAssetId'],
			  		'objectId' => $row['objectId'],
					'url' => $row['imageUrl'].$row['objectAssetId'],
					'objectUrl' => $row['objectUrl'].$row['objectAssetId']
				);
				// var_dump($node);
				$this->json[] = $node;
			}
		} catch(PDOException $e) {
			print 'Exception : '.$e->getMessage();
		}
		$this->closeJSON();
	}

	private function openJSON($label = 'markers'){
		header('content-type: application/json; charset=utf-8');

		$this->json = array();
	}
 
	private function is_valid_callback($subject) {
    $identifier_syntax = '/^[$_\p{L}][$_\p{L}\p{Mn}\p{Mc}\p{Nd}\p{Pc}\x{200C}\x{200D}]*+$/u';

    $reserved_words = array('break', 'do', 'instanceof', 'typeof', 'case',
	      'else', 'new', 'var', 'catch', 'finally', 'return', 'void', 'continue',
	      'for', 'switch', 'while', 'debugger', 'function', 'this', 'with',
	      'default', 'if', 'throw', 'delete', 'in', 'try', 'class', 'enum',
	      'extends', 'super', 'const', 'export', 'import', 'implements', 'let',
	      'private', 'public', 'yield', 'interface', 'package', 'protected',
	      'static', 'null', 'true', 'false');

    return preg_match($identifier_syntax, $subject)
        && ! in_array(mb_strtolower($subject, 'UTF-8'), $reserved_words);
	}

	private function closeJSON(){
		$json = json_encode($this->json);

		# JSON if no callback
		if( ! isset($_GET['callback']))
		    exit($json);

		# JSONP if valid callback
		if($this->is_valid_callback($_GET['callback']))
		    exit("{$_GET['callback']}($json)");

		# Otherwise, bad request
		header('Status: 400 Bad Request', true, 400);

		exit;
	}
}

?>