<?php
include_once('lib/db.php');

define("SITE_PATH", "/var/www/html/rijksmemorygame");
define("XML_FILES", "/data");
 
ini_set('default_charset', 'UTF-8');
ini_set("magic_quotes_gpc", 0);
ini_set("magic_quotes_runtime", 0);
ini_set("magic_quotes_sybase", 0);

$prc = new ProcessXmls('127.0.0.1', '', '', '');
$prc->start();

class ProcessXmls {
	public function __construct($hostname, $username, $password, $db) {
		try {
			$this->dbh = new PDO("mysql:host=$hostname;dbname=$db", $username, $password,
              array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
		    
		    /*** echo a message saying we have connected ***/
		    echo 'Connected to database<br/>'.chr(10);
		} catch(PDOException $e) {
			print 'Exception : '.$e->getMessage();
		}
	}

	public function start(){
		$xmls = glob(SITE_PATH.XML_FILES.'/*');
		foreach($xmls as $i => $d){
			$feed = file_get_contents($d);
			$xml = new SimpleXmlElement($feed);
			foreach ($xml->ListRecords->records->record as $record){
				$asset = $record->metadata->children('http://www.openarchives.org/OAI/2.0/oai_dc/');
				$dc = $asset->children('http://purl.org/dc/elements/1.1/');

				$url = null;
				foreach($dc->format as $f){
					$url[] = (string)$f->identifier;
				}

				$id = null;
				foreach($dc->identifier as $iI){
					$id[] = (string)$iI[0];
				}
				//retrieve data
				echo "insert ".$dc->title."<br/>".chr(10);
				
				try {
					$sql = "INSERT INTO assets (objectAssetId, objectId, objectUrl, imageUrl, title, description)
							VALUES (:objectAssetId, :objectId, :objectUrl, :imageUrl, :title, :description)";
					
					$stmt = $this->dbh->prepare($sql);

					$stmt->bindValue(':objectAssetId', $id[0]);
					$stmt->bindValue(':objectId', $id[1]);
					$stmt->bindValue(':imageUrl', $url[0]);
					$stmt->bindValue(':objectUrl', $url[1]);
					$stmt->bindValue(':title', $this->dbh->quote($dc->title));
					$stmt->bindValue(':description', $this->dbh->quote($dc->description));

					//store data
					$stmt->execute();

			  	} catch(PDOException $e) {
					print 'Exception : '.$e->getMessage();
				}
			}
		}
		$this->dbh = null;
	}
}

?>