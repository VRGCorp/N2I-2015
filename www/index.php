<?php
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
?>
<?php
	exec("cd ../git; git pull; cd ..; rm -rf ./www/*; cp -r ./git/www/* ./www/; cd www");
?>

<?php
	include('vars.php');
	include($ROOT.'/passwords.php');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="utf-8">
	<title>Titre de la page</title>
	<link rel="stylesheet" href="styles/style.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
</head>
<body>
	<header>
		<img src="/images/team.jpg"></img>
	</header>
	<nav>
		<ul>
			<li>
				<a href="/test_tactile/test.html">item 1</a>
			</li>
			<li>
				item 2
			</li>
			<li>
				item 3
			</li>
		</ul>
	</nav>

	<?php
		for($id=0; $id<10; $id++){
			$title_file='cas/'.$id.'_titre.txt';
			$cas_file='cas/'.$id.'_cas.php';
			$reaction_file='cas/'.$id.'_reaction.php';
			$jeu_file='cas/'.$id.'_jeu.php';
			$classes_file='cas/'.$id.'_classes.txt';

			if(file_exists($title_file)){
				echo '<section class="';
				include($classes_file);
				echo '">';
				echo '<div>';

				echo '<h2>';
				include($title_file);
				echo '</h2>';

				echo '<article>';
				include($cas_file);
				echo '</article>';

				echo '<article>';
				include($reaction_file);
				echo '</article>';

				echo '<article>';
				include($jeu_file);
				echo '</article>';

				echo '</div>';
				echo '</section>';
			}

		}

	 ?>

	<footer>
		<a href="https://www.facebook.com/VRGCorpLBL/">VRGCorp - Los Burritos Locos</a>
	</footer>
</body>
</html>
