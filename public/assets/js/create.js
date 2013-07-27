function Game(pen) {
	this.score = 0;
	this.won = 0;
	this.background = '/assets/img/splash.tiff';
	this.level = 0;

	this.start = function (pen) {
		entArr = [];

		this.background = '/assets/img/background.tiff';
		this.interval = setInterval(function () {
			drawBackground(pen, game.background);
			for (var i = 0; i < entArr.length; i++) {
				entArr[i].draw(pen);
			}
		}, 10);
	};
}

function drawBackground(pen, src) {
	pen.clearRect(0, 0, 800, 600);
	var img = new Image();
	img.src = src;
	pen.drawImage(img, 0, 0, 800, 600);
}

$('#mycanvas').click(function (e) {
	if ($('#barn').checked) {
		entArr.push(new Entity('barn', e.pagex, e.pagy))
	}
});


$(function () {

	var $mycanvas = $('#mycanvas');

	pen = $mycanvas[0].getContext('2d');
	game = new Game();
	game.start(pen);
});