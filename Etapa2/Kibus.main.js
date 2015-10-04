var Kibus = function(canvas, mapWidth, mapHeight){
	this.canvas = canvas;
	
	var self = this;
	var mouse = function(e){
		if (self.editable) {
			var x = ~~(e.layerX/self.tileWidth),
				y = ~~(e.layerY/self.tileHeight);
			self.option = +self.option;
			if(x >= 0 && y >= 0 && x < self.mapWidth && y < self.mapHeight){
				switch(self.option){
					case 0:
					case 1:
						if(e.buttons==1){
							if(!((self.character.x == x && self.character.y == y) || (self.house.x == x && self.house.y == y))){
								self.map[y][x] = self.option;
								self.draw(x, y);
							}
						}
					break;
					case 2:
						if(e.buttons==1){
							if(self.map[y][x]!=1){
								var _x = self.house.x,
									_y = self.house.y;
								self.house.x = x;
								self.house.y = y;
								self.draw(_x, _y);
								
								self.drawEntity(self.house);
								self.drawEntity(self.character);
							}
						}
					break;
					case 3:
						if(e.buttons==1){
							if(self.map[y][x]!=1){
								var _x = self.character.x,
									_y = self.character.y;
								self.character.x = x;
								self.character.y = y;
								self.draw(_x, _y);								
								
								self.drawEntity(self.house);
								self.drawEntity(self.character);
							}
						}
					break;
					default:
					break;
				}
			}
		};
	};
	this.canvas.addEventListener('mousedown', mouse);
	this.canvas.addEventListener('mousemove', mouse);

	window.addEventListener('keydown', function(e){
		switch(e.keyCode){
			case 82:
				self.retornar();
			break;
			default:
			break;
		}
	});

	this.ctx = canvas.getContext("2d");
	this.mapWidth = mapWidth;
	this.mapHeight = mapHeight;

	self.movesX = [-1, -1, 0, 1, 1, 1, 0, -1],
	self.movesY = [0, -1, -1, -1, 0, 1, 1, 1];

	this.editable = true;

	this.prevPosition = {x: null, y: null};

	this.putOptions = {'Terreno':0, 'Obstáculo':1, 'Casa':2, 'Kibus':3};
	this.option = 0;

	this.percentage = 25;

	this.map = null;

	this.tileWidth = ~~(this.canvas.width / this.mapWidth);
	this.tileHeight = ~~(this.canvas.height / this.mapHeight);

	this.fps = 5;

	this.flagLimit = 10;

	this.images = Array();

	this.grassImage = document.createElement("img");
	this.grassImage.src = "../src/assets/grass.png";

	this.images.push(this.grassImage);

	this.rockImage = document.createElement("img");
	this.rockImage.src = "../src/assets/tree.png";

	this.images.push(this.rockImage);

	this.steps = -1;

	var Entity = function(x, y, type, src){
		/**
		* type {0: character, 1:house, 2: bees}
		*/
		this.x = x;
		this.y = y;
		this.type = type;

		this.image = null;
		this.orientation = null;

		if(src){
			if(typeof(src)=="object"){
				this.images = {};

				this.images.u = document.createElement("img");
				this.images.u.src = src.u.src;

				self.images.push(this.images.u);

				this.images.u.actualStep = 0;
				this.images.u.steps = src.u.steps;
				this.images.u.width = src.u.width;
				this.images.u.height = src.u.height;

				this.images.d = document.createElement("img");
				this.images.d.src = src.d.src;

				self.images.push(this.images.d);

				this.images.d.actualStep = 0;
				this.images.d.steps = src.d.steps;
				this.images.d.width = src.d.width;
				this.images.d.height = src.d.height;

				this.images.l = document.createElement("img");
				this.images.l.src = src.l.src;

				self.images.push(this.images.l);

				this.images.l.actualStep = 0;
				this.images.l.steps = src.l.steps;
				this.images.l.width = src.l.width;
				this.images.l.height = src.l.height;

				this.images.r = document.createElement("img");
				this.images.r.src = src.r.src;

				self.images.push(this.images.r);

				this.images.r.actualStep = 0;
				this.images.r.steps = src.r.steps;
				this.images.r.width = src.r.width;
				this.images.r.height = src.r.height;

				this.orientation = 'd';
			}else{
				this.image = document.createElement("img");
				this.image.src = src;

				self.images.push(this.image);
			}
		}
	};	

	this.character = new Entity(0,0,0, {
		"d": {
			"src": "../src/assets/linkD.png",
			"steps": 7,
			"width": 16,
			"height": 24
		},
		"u": {
			"src": "../src/assets/linkD.png",
			"steps": 7,
			"width": 16,
			"height": 24
		},
		"l": {
			"src": "../src/assets/linkD.png",
			"steps": 7,
			"width": 16,
			"height": 24
		},
		"r": {
			"src": "../src/assets/linkD.png",
			"steps": 7,
			"width": 16,
			"height": 24
		},
	});
	this.house = new Entity(0,0,1, "../src/assets/houseTLOZ.png");

	this.animationId = null;
	this.enCasa = false;

	this.pilaMovimientos = [];
};