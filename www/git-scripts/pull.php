<?php
	error_reporting(E_ALL);
	ini_set("display_errors", 1);
?>
<?php

echo "pulling";
exec("cd ../../git; git pull; cd ..; rm -rf ./www/*; cp -r ./git/www/* ./www/");
echo "done";
 

