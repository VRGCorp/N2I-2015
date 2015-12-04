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
		<h1>Los burritos locos</h1>
	</header>

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
				echo '<h3>Qu\'est-ce que c\'est ?</h3>';
				include($cas_file);
				echo '</article>';

				echo '<article>';
				echo '<h3>Comment réagir ?</h3>';
				include($reaction_file);
				echo '</article>';

				echo '<article class="game-wrapper">';
				echo '<h3>Entraine toi !</h3>';
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
