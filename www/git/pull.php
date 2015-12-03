<?php
	error_reporting(E_ALL);
	ini_set("display_errors", 1);
?>
<?php

echo "cloning";
exec("cd ../git git pull; rm -rf ../www/*; cp -r ./www/* ../www/");
echo "done";
 

