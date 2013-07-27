function Background(src) {
	this.src = src;

	this.draw = function (pen) {
		pen.drawImage(this.src, 0, 0, 800, 600);
	}
}


function Player(x, y, w, h, src, n) {
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.img = new Image();
	this.img.src = src;
	this.name = n;
	this.dead = false;
	this.hp = 100;
	this.level = 0;
	this.state = 0;
	this.jumpa = 0;
	this.jumpt = 0;

	this.draw = function (pen) {
		pen.drawImage(this.img, this.x, this.y, this.width, this.height);
	};

	this.kill = function (cause) {
		this.img.src = '/assets/img/chicken_fried.tiff';
		this.dead = true;
		$('#text').val(cause);
	};

	this.resurrect = function () {
		this.img.src = '/assets/img/chicken.tiff';
		this.jumpa = 0;
		this.jumpa = 0;
		this.dead = false;
	}

	this.collision = function (obj) {
		var test = {i1: obj.x + obj.cb[0], j1: obj.y + obj.cb[1], i2: obj.x + obj.width + obj.cb[2], j2: obj.y + obj.height + obj.cb[3], x1: this.x, x2: this.x + this.width, y1: this.y, y2: this.y + this.height, x3: this.x + (this.width / 2), y3: this.y + (this.height / 2)};
		if ((test.x1 < test.i2 && test.x1 > test.i1 && test.y1 < test.j2 && test.y1 > test.j1) ||
			(test.x1 < test.i2 && test.x1 > test.i1 && test.y2 < test.j2 && test.y2 > test.j1) ||
			(test.x1 < test.i2 && test.x1 > test.i1 && test.y3 < test.j2 && test.y3 > test.j1) ||
			(test.x2 < test.i2 && test.x2 > test.i1 && test.y1 < test.j2 && test.y1 > test.j1) ||
			(test.x2 < test.i2 && test.x2 > test.i1 && test.y2 < test.j2 && test.y2 > test.j1) ||
			(test.x2 < test.i2 && test.x2 > test.i1 && test.y3 < test.j2 && test.y3 > test.j1) ||
			(test.x3 < test.i2 && test.x3 > test.i1 && test.y1 < test.j2 && test.y1 > test.j1) ||
			(test.x3 < test.i2 && test.x3 > test.i1 && test.y2 < test.j2 && test.y2 > test.j1) ||
			(test.x3 < test.i2 && test.x3 > test.i1 && test.y3 < test.j2 && test.y3 > test.j1)) {
			if (obj.type === 'solid') {
				return true;
			}
			else if (obj.type === 'seed') {
				obj.eat();
			}
			else if (obj.type === 'seed_gold') {
				obj.eat();
				console.log("win");
			}
			else if (obj.type === 'bot') {
				this.kill("You've been fried!");
				game.loose();
			}
		}
	};

	this.fall = function () {
		var undoY = this.y;
		if (this.y < 290) {
			this.y = this.y + 5;
		}
		else if (this.y > 290) {
			this.y = 290;
		}
		this.y = this.y - this.jumpa;
		if (this.jumpa >= 1) {
			this.jumpa = this.jumpa - 1;
		}
		var undoIt = 0;
		for (var i = 0; i < entArr.length; i++) {
			if (this.collision(entArr[i])) {
				undoIt += 1;
			}
		}
		if (undoIt > 0 || this.dead) {
			this.y = undoY;
		}
		this.grounded();
	};

	this.move = function (d) {
		var undo = [this.x, this.y];
		if (d == 'right') {
			this.x = this.x + 5;
		}
		if (d == 'left') {
			this.x = this.x - 5;
		}
		//console.log(this.collision(cart));
		var undoIt = 0;
		for (var i = 0; i < entArr.length; i++) {
			if (this.collision(entArr[i])) {
				undoIt += 1;
			}
		}

		if (undoIt > 0 || this.dead) {
			this.x = undo[0];
			this.y = undo[1];
		}
	};

	this.grounded = function () {
		var undoY = this.y;
		this.y = this.y + 5;
		var out = false;
		for (var i = 0; i < entArr.length; i++) {
			if (this.collision(entArr[i])) {
				this.jumpt = 0;
				out = true;
			}
		}
		if (this.y >= 290) {
			this.jumpt = 0;
			out = true;
		}
		this.y = undoY;
		if (out) {
			return true;
		}
		else {
			return false;
		}
	};

	this.jump = function (t) {
		this.grounded();
		if (this.jumpt <2) {
			this.jumpa = t;
			this.jumpt +=1;
		}
	};

	var ymax = 200;
	this.info = function () {
		if (this.y < ymax) {ymax = this.y}
		return 'x:'.concat(this.x, '___y:', this.y, "___ymax", ymax, '___jumpa:', this.jumpa, "___jumpt:", this.jumpt);
	};
}


function Entity(type, x, y) {
	this.x = x;
	this.y = y;
	this.img = new Image();
	this.cb = [0, 0, 0, 0]; //x1,y1,x2,y2

	if (type === "cart") {
		this.type = 'solid';
		this.width = 347;
		this.height = 200;
		this.img.src = '/assets/img/hay_cart.tiff';
		this.cb[1] = 70;
	}

	if (type === 'bush') {
		this.type = 'solid';
		this.width = 79;
		this.height = 50;
		this.img.src = '/assets/img/bush.tiff';

	}

	else if (type === "seed") {
		this.type = 'seed';
		this.width = 40;
		this.height = 36;
		this.img.src = '/assets/img/seed.tiff';
		this.ate = false;

		this.eat = function () {
			if (!this.ate) {
				this.img.src = '/assets/img/seed_faded.tiff';
				game.score += 1;
				this.ate = true;
			}
		};
	}

	else if (type === "seed_gold") {
		this.type = 'seed_gold';
		this.width = 65;
		this.height = 60;
		this.img.src = '/assets/img/seed_gold.tiff';

		this.eat = function () {
			game.win();
		};
	}

	else if (type === "bot") {
		this.type = 'bot';
		this.on = true;
		this.fireTimer = 0;
		this.width = 555*.4;
		this.height = 830*.4;
		this.img.src = '/assets/img/death_bot_lasers.tiff';

		this.turnOff = function (pen) {
			this.img.src = '/assets/img/death_bot.tiff'
		};

		this.tick = function () {
			if (this.fireTimer < 30) {
				this.fireTimer += 1;
			}
			else {

			}
		};
	}

	if (type === 'barn') {
		this.type = 'solid';
		this.width = 311;
		this.height = 352;
		this.img.src = '/assets/img/barn.tiff';

	}

	if (type === 'rock') {
		this.type = 'solid';
		this.width = 422*.2;
		this.height = 277*.2;
		this.img.src = '/assets/img/rock.tiff';
	}

	if (type === 'tree') {
		this.type = 'solid';
		this.width = 648*.48;
		this.height = 710*.48;
		this.img.src = '/assets/img/tree.tiff';
		this.cb[3]=-170;
	}


	this.draw = function (pen) {
		pen.drawImage(this.img, this.x, this.y, this.width, this.height);
	};
}

//if (type === '') {
//	this.type = '';
//	this.width = ;
//	this.height = ;
//	this.img.src = '/assets/img/.tiff';
//
//}