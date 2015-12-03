<?php
	error_reporting(E_ALL);
	ini_set("display_errors", 1);
?>
<?php

echo "cloning";

exec("cd ../../; rm ./git -rf; git clone https://github.com/kloumpt/N2I.git ./git; rm -rf ./www/*; cp -r ./git/www/* www/");

echo "done";
 

