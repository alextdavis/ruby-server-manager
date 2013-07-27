;function rand(min, max) {
	return(Math.ceil(Math.random() * (max - min)) + min);
}

//Array.prototype.remove = function() {
//	var what, a = arguments, L = a.length, ax;
//	while (L && this.length) {
//		what = a[--L];
//		while ((ax = this.indexOf(what)) !== -1) {
//			this.splice(ax, 1);
//		}
//	}
//	return this;
//};


function Game(pen) {
	this.score = 0;
	this.won = 0;
	this.background = 'title';
	this.level = 0;

	this.new = function () {
		this.background = 'bg';
		player = new Player(0, 300, 100, 100, '/assets/img/chicken.tiff', 'hi');
		player.draw(pen);
		entArr = [];
		clearInterval(game.interval);
		$('#startGame').html("Total Reset");
	};
	this.load = function (lvl) {
		clearInterval(initial_interval);
		this.level = lvl;
		entArr = [];
		for (var i = 0; i < level[lvl]["ent"].length; i++) {
			var ent = new Entity(level[lvl]["ent"][i][0], level[lvl]["ent"][i][1], level[lvl]["ent"][i][2]);
			entArr.push(ent);
		}
		player.x = level[lvl]['player'][0];
		player.y = level[lvl]['player'][1];
		player.resurrect();
		this.background = 'bg';
		clearInterval(game.interval);
		this.interval = setInterval(function () {
			updateKeyboard();
			drawBackground(pen, game.background);
			game.scoreKeep();
			for (var i = 0; i < entArr.length; i++) {
				entArr[i].draw(pen);
			}
			player.fall();
			player.draw(pen);
			$('#debug').val(player.info());

		}, 10);
		$('#nextLevel').attr("disabled", "disabled");
	};
	this.win = function () {
		this.won = this.level;
		entArr = [];
		this.background = 'win';
		clearInterval(this.interval);
		drawBackground(pen, game.background);
		$('#nextLevel').html("Next Level");
		$('#nextLevel').removeAttr("disabled");
	}
	this.loose = function () {
		entArr = [];
		this.score = 0;
		this.background = 'lose';
		$('#nextLevel').html("Retry");
		$('#nextLevel').removeAttr("disabled");
	}
	this.scoreKeep = function () {
		$('#score').val(this.score);
	}
}

function drawBackground(pen, src) {
	pen.clearRect(0, 0, 800, 600);
	if (src === 'bg') {
		pen.drawImage(background.bg, 0, 0, 800, 600);
	}
	else if (src === 'win') {
		pen.drawImage(background.win, 0, 0, 800, 600);
	}
	else if (src === 'lose') {
		pen.drawImage(background.lose, 0, 0, 800, 600);
	}
	else if (src === 'title') {
		pen.drawImage(background.title, 0, 0, 800, 600);
	}
	else {
		alert('background error');
	}

}

key = {right: false, left: false, up: false};

$(document).keydown(function (event) {
	if (event.which == 68) {
		key.right = true;
//		console.log('right-on')
	}
	if (event.which == 65) {
		key.left = true;
		console.log('left-on')
	}
	if (event.which == 87) {
		key.up = true;
//		console.log('up-on');
		player.jump(25);
	}
});
$(document).keyup(function (evxent) {
	if (event.which == 68) {
		key.right = false;
	}
	if (event.which == 65) {
		key.left = false;
	}
	if (event.which == 87) {
		key.up = false;
	}
});

$('#startGame').click(function () {
	game.new();
	game.score = 0;
	game.won = 0;
	game.load(1);
	$('#saved').slideUp();
});

$('#nextLevel').click(function () {
	game.load(game.won + 1);
});

$('#debugBtn').click(function () {
	alert('nothing');
});

$('#kill').click(function () {
	console.log("killing");
	clearInterval(game.interval);
});

function updateKeyboard() {
	if (key.right === true) {
		player.move('right');
	}
	if (key.left === true) {
		player.move('left');
	}
	if (key.up === true) {
		//player.jump(20);
	}
}


$(function () {
	var $mycanvas = $('#mycanvas');

	pen = $mycanvas[0].getContext('2d');

	background = {};
	background.bg = new Image();
	background.win = new Image();
	background.lose = new Image();
	background.title = new Image();
	background.bg.src = '/assets/img/background.tiff';
	background.win.src = '/assets/img/next_level.tiff';
	background.lose.src = '/assets/img/game_over.tiff';
	background.title.src = '/assets/img/title.tiff';

	game = new Game(pen);

	initial_interval = setInterval(function () {
		drawBackground(pen, 'title');
	},1000);

});
