Kibus.prototype.propagacion = function(){
	this.render();
	for(var i = 0; i<this.beeCount; i++){
		for(var j = 0; j<this.beeCount; j++){
			if(i != j && this.bees[i].temperature != -1 && this.bees[j].temperature != -1){
				if(this.bees[j].temperature < this.bees[i].temperature){
					this.bees[i].entity.x = this.bees[j].entity.x;
					this.bees[i].entity.y = this.bees[j].entity.y;
					this.bees[i].temperature = this.bees[j].temperature;
					this.bees[i].moves = this.bees[j].moves.slice();
				}else if(this.bees[j].temperature == this.bees[i].temperature){
					if(Math.random() < 0.5){
						this.bees[i].entity.x = this.bees[j].entity.x;
						this.bees[i].entity.y = this.bees[j].entity.y;
						this.bees[i].temperature = this.bees[j].temperature;
						this.bees[i].moves = this.bees[j].moves.slice();
					}
				}
			}
		}
	}
	for(var i = 0; i<this.beeCount; i++){
		var random = this.getRandomMovement(this.bees[i].entity.x, this.bees[i].entity.y);
		/*
		if(this.canMove(this.bees[i].entity.x, this.bees[i].entity.y).length > 1 && this.bees[i].moves.length){
			while(this.bees[i].entity.x + this.movesX[random] == this.bees[i].moves[this.bees[i].moves.length-1].x && 
				  this.bees[i].entity.y + this.movesY[random] == this.bees[i].moves[this.bees[i].moves.length-1].y){
				random = this.getRandomMovement(this.bees[i].entity.x, this.bees[i].entity.y);
			}
		}*/
		/*
		if(this.canMove(this.bees[i].entity.x, this.bees[i].entity.y).length > 1 && this.bees[i].moves.length){
			var validMove = true;
			var m = this.bees[i].moves.length-1;
			while(validMove){
				while(m >= 0 && validMove){
					if(this.bees[i].entity.x + this.movesX[random] == this.bees[i].moves[m].x && 
					  this.bees[i].entity.y + this.movesY[random] == this.bees[i].moves[m].y){
						validMove = false;
					}	
					m--;
				}
				if(!validMove){
					random = this.getRandomMovement(this.bees[i].entity.x, this.bees[i].entity.y);
				}
				validMove = !validMove;
			}
		}
		*/
		this.bees[i].entity.x += this.movesX[random];
		this.bees[i].entity.y += this.movesY[random];
		this.bees[i].moves.push({x: this.bees[i].entity.x, y: this.bees[i].entity.y});
		this.bees[i].move++;
		this.bees[i].temperature = this.heatMap[this.bees[i].entity.y][this.bees[i].entity.x];
		this.drawEntity(this.bees[i].entity);
	}
}

Kibus.prototype.retropropagacion = function(){
	this.render();
	if(this.bees[0].move > 0){
		for(var i = 0; i<this.beeCount; i++){
			var actualMove = this.bees[i].moves[--this.bees[i].move];
			this.bees[i].entity.x = actualMove.x;
			this.bees[i].entity.y = actualMove.y;
			//this.bees[i].temperature = this.heatMap[this.bees[i].entity.y][this.bees[i].entity.x];
			this.drawEntity(this.bees[i].entity);
		}
	}
}


Kibus.prototype.draw = function(x, y) {
	var img = null;
	if(this.map[y][x]==0){
		img = this.grassImage;
		this.ctx.drawImage(img, 0, 0, 16, 16, x*this.tileWidth, y*this.tileHeight, this.tileWidth, this.tileHeight);
	}else if(this.map[y][x]==1){
		img = this.rockImage;
		this.ctx.drawImage(img, 0, 0, 64, 80, x*this.tileWidth, y*this.tileHeight, this.tileWidth, this.tileHeight);
	}
};

Kibus.prototype.drawEntity = function(Entity) {
	if(Entity.type==0 || Entity.type == 2){
		this.ctx.fillStyle = "blue";
		if(Entity.orientation){
			switch(Entity.orientation){
				case 'd':
					this.ctx.drawImage(Entity.images.d, Entity.images.d.actualStep*Entity.images.d.width, 0, Entity.images.d.width, Entity.images.d.height, Entity.x*this.tileWidth, Entity.y*this.tileHeight/*-8*/, this.tileWidth, this.tileHeight/*+8*/);
					Entity.images.d.actualStep = (Entity.images.d.actualStep + 1)%Entity.images.d.steps;
				break;
				default:
				break;
			}
		}
		this.steps++;
	}else if(Entity.type==1){
		this.ctx.drawImage(Entity.image, 0, 0, 64, 94, Entity.x*this.tileWidth, Entity.y*this.tileHeight/*-8*/, this.tileWidth, this.tileHeight/*+8*/);
	}

	/*
	if(Entity.image){
		this.ctx.drawImage(Entity.image, 0, 0, 16, 24, Entity.x*this.tileWidth, Entity.y*this.tileHeight-8, this.tileWidth, this.tileHeight+8);
	}else{
		this.ctx.fillRect(Entity.x*this.tileWidth, Entity.y*this.tileHeight, this.tileWidth, this.tileHeight);
	}
	*/
};	

Kibus.prototype.render = function(){
	this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
	for (var i = this.mapHeight - 1; i >= 0; i--) {
		for (var j = this.mapWidth - 1; j >= 0; j--) {
			this.draw(j,i);
		}
	}
	this.drawEntity(this.house);
	this.drawEntity(this.character);
}

Kibus.prototype.initHeatMap = function(){
	for (var i = 0; i < this.mapHeight; i++) {
		for (var j = 0; j < this.mapWidth; j++) {
			this.heatMap[i][j] = -1;
		}
	}
	var cola = [];
	cola.push({
		x: this.house.x, 
		y: this.house.y, 
		temp: 20});
	this.heatMap[this.house.y][this.house.x] = 0;
	this.heat.radius(this.tileWidth / 2 + 2, this.tileWidth / 2 );
	this.heat.clear();
	this.maxHeat = 0;
	self = this;
	while(cola.length){
		var actual = cola.shift();
		for (var i = 0; i < 8; i++) {
			var _nX = actual.x + self.movesX[i];
			var _nY = actual.y + self.movesY[i];
			if(_nX >= 0 && _nY >= 0 && _nX < self.mapWidth && _nY < self.mapHeight && this.heatMap[_nY][_nX] == -1){
				this.heatMap[_nY][_nX] = actual.temp + 1;
				cola.push({
						x: _nX, 
						y: _nY, 
						temp: actual.temp + 1});
				this.heat.add([this.tileWidth * _nX + this.tileWidth / 2, this.tileHeight * _nY + this.tileHeight / 2, actual.temp + 1]);
				if(actual.temp + 1 > this.maxHeat){
					this.maxHeat = actual.temp + 1;
				}
			}
		}
	}
	this.heat.max(this.maxHeat + 5);
	this.heat.draw();
}

Kibus.prototype.makeRandomMap = function(_percentage) {
	var percentage = _percentage > 100 ? 100 : (_percentage < 0 ? 0 : _percentage);
		percentage /= 100;
	var obstacles = ~~(this.mapWidth*this.mapHeight*percentage); //~~ es para convertir a entero (redondeo hacia abajo)
	
	var positionSelected = false;

	var plainArray = Array(this.mapWidth*this.mapHeight);
	for (var i = 0; i < obstacles; i++) {
		plainArray[i] = 1;
	}
	for (var i = obstacles, j = plainArray.length; i < j; i++) {
		plainArray[i] = 0;
	}

	shuffle(plainArray);

	for (var i = 0; i < this.mapHeight; i++) {
		for (var j = 0; j < this.mapWidth; j++) {
			this.map[i][j] = plainArray[i*this.mapWidth+j];
			if(this.map[i][j] == 0 && !positionSelected){
				this.house.x = j;
				this.house.y = i;

				this.character.x = j;
				this.character.y = i;

				positionSelected = true;
			}
		}
	}
};

Kibus.prototype.estaEnCasa = function(){
	if(this.character.x == this.house.x && this.character.y == this.house.y){
		this.enCasa = true;
	}else{
		this.enCasa = false;
	}
}

Kibus.prototype.canMove = function(x, y){
	/*
		Returns an array of possible movements for Kibus
		[1 2 3]
		[0 K 4]
		[7 6 5]
	*/
	var self = this;
	

	var moves = [];
	
	var _x = typeof(x)!='undefined'? x : self.character.x,
		_y = typeof(x)!='undefined'? y : self.character.y,
		_nX,
		_nY;
	for (var i = 0; i < 8; i++) {
		_nX = _x + self.movesX[i];
		_nY = _y + self.movesY[i];
		if(_nX >= 0 && _nY >= 0 && _nX < self.mapWidth && _nY < self.mapHeight && self.map[_nY][_nX] != 1 ){
			moves.push(true);
		}else{
			moves.push(false);
		}
	};
	return moves;
}

Kibus.prototype.getProbabilities = function(x, y){
	var self = this;
	var probabilities = [];
	var moves = (typeof(x)!='undefined' && typeof(y)!='undefined')?this.canMove(x, y):this.canMove();

	var totalProb = 0;
	for(var i=0; i<8; i++){
		var val = moves[i]?1:0;
		probabilities[i] = val;
		totalProb += probabilities[i];
	}
	var actualProbabilities = [];
	var ac = 0;
	for(var i=0; i<8; i++){
		if(probabilities[i]){
			ac += probabilities[i] / totalProb;
			actualProbabilities[i] = ac;
		}else{
			actualProbabilities[i] = ac;
		}
	}
	//console.log(probabilities);
	//console.log(actualProbabilities); //Acumuladas
	return actualProbabilities;
}

Kibus.prototype.getRandomMovement = function(x, y){
	var probs = (typeof(x)!='undefined' && typeof(y)!='undefined')?this.getProbabilities(x, y):this.getProbabilities();
	var rand = Math.random();
	for (var i = 0; i < probs.length; i++) {
		if(rand <= probs[i])
			return i;
	}
	return null;
}

Kibus.prototype.makeRandomMovement = function(){
	var movement = this.getRandomMovement();
	if(movement==null){
		alert("Se quedó sin movimientos");
		return;
	} 
	this.prevPosition.x = this.character.x;
	this.prevPosition.y = this.character.y;
	this.character.x += this.movesX[movement];
	this.character.y += this.movesY[movement];
	//this.flagsMap[this.character.y][this.character.x]++;
	this.draw(this.prevPosition.x, this.prevPosition.y);
	this.draw(this.character.x, this.character.y);
	this.drawEntity(this.character);
}

Kibus.prototype.validPoint = function(x, y){
	if(x >= 0 && y >= 0 && x < this.mapWidth && y < this.mapHeight && this.map[y][x]!=1){
		return true;
	}
	return false;
}

Kibus.prototype.getLine = function(x0, y0, x1, y1){
	var x, y, dx, dy, p, incE, incNE, stepx, stepy;
	var puntos = [];
	dx = (x1 - x0);
	dy = (y1 - y0);

	if (dy < 0) { 
		dy = -dy; 
		stepy = -1; 
	}else {
		stepy = 1;
	}

	if (dx < 0) {	
		dx = -dx;	
		stepx = -1; 
	}else {
		stepx = 1;
	}

	x = x0;
	y = y0;

	if(dx>dy){
		p = 2*dy - dx;
		incE = 2*dy;
		incNE = 2*(dy-dx);
		while (x != x1){
			x = x + stepx;
			if (p < 0){
				p = p + incE;
			}
			else {
				y = y + stepy;
				p = p + incNE;
			}
			if(this.validPoint(x, y)){
				puntos.push({x: x, y: y});
			}else{
				return puntos;
			}
		}
	}
	else{
		p = 2*dx - dy;
		incE = 2*dx;
		incNE = 2*(dx-dy);
		while (y != y1){
			y = y + stepy;
			if (p < 0){
				p = p + incE;
			}
			else {
				x = x + stepx;
				p = p + incNE;
			}
			if(this.validPoint(x, y)){
				puntos.push({x: x, y: y});
			}else{
				return puntos;
			}
		}
	}
	return puntos;
}

Kibus.prototype._retornar = function(){
	var self = this;		
	setTimeout(function() {
		if(!self.enCasa){
			self.animationId = requestAnimationFrame(self._retornar.bind(self));

			/*
			if(self.pilaMovimientos.length==0){
				self.pilaMovimientos = self.getLine(self.character.x, self.character.y, self.house.x, self.house.y);
				if(self.pilaMovimientos.length == 0){
					self.makeRandomMovement();
				}
			}

			if(self.pilaMovimientos.length){
				var movement = self.pilaMovimientos.shift();

				self.prevPosition.x = self.character.x;
				self.prevPosition.y = self.character.y;

				//this.flagsMap[this.prevPosition.y][this.prevPosition.x]++;

				self.character.x = movement.x;
				self.character.y = movement.y;

				self.draw(self.prevPosition.x, self.prevPosition.y);
				self.drawEntity(self.character);
				if(self.character.x == self.house.x && self.character.y == self.house.y){
					self.enCasa = true;
				}
			}
			*/
			if(self.estado == 1){//Propagación
				if(self.aux == 5){
					self.aux = 0;
					self.estado = 2;
				}else{
					self.propagacion();
					self.aux++;
				}
			}else if(self.estado == 2){//Retropropagación
				if(self.aux == 5){
					self.aux = 0;
					self.estado = 3;
				}else{
					self.retropropagacion();
					self.aux++;
				}
			}else if(self.estado == 3){//Selecciona camino y enfría
				self.estado = 4;

				var best = [self.bees[0].temperature],
					index = [0];
				for(var i=1; i<self.beeCount; i++){
					if(self.bees[i].temperature == best){
						index.push(i);
					}else if(self.bees[i].temperature < best){
						best = self.bees[i].temperature;
						index = [i];
					}
				}
				index = index[Math.floor(Math.random()*index.length)];
				self.pilaMovimientos = self.bees[index].moves.slice();
			}else if(self.estado == 4){//Camina
				if(self.pilaMovimientos.length){
					var movement = self.pilaMovimientos.shift();

					self.prevPosition.x = self.character.x;
					self.prevPosition.y = self.character.y;

					self.character.x = movement.x;
					self.character.y = movement.y;

					self.heatMap[self.character.y][self.character.x]+=self.addStep;

					self.heat.add([self.tileWidth * self.character.x + self.tileWidth / 2, self.tileHeight * self.character.y + self.tileHeight / 2, self.addStep]);
					/*
					if(self.heatMap[self.character.y][self.character.x] > self.maxHeat){
						self.maxHeat = self.heatMap[self.character.y][self.character.x];
					}
					self.heat.max(self.maxHeat > 15 ? 15 : self.maxHeat);
					*/
					self.heat.draw();

					self.draw(self.prevPosition.x, self.prevPosition.y);
					self.drawEntity(self.character);
					if(self.character.x == self.house.x && self.character.y == self.house.y){
						self.enCasa = true;
					}
				}else{
					self.initBees();
					self.estado = 1;
				}
			}
		}else{
			cancelAnimationFrame(self.animationId);
		}
	}, 1000 / self.fps);
}

Kibus.prototype.initBees = function(){
	var self = this;
	for(var i = 0; i< self.beeCount; i++){
	    self.bees[i].entity.x = self.character.x;
		self.bees[i].entity.y = self.character.y;
		self.bees[i].temperature = -1;
		self.bees[i].moves = [];
		self.bees[i].move = 0;
	}
}

Kibus.prototype.retornar = function(){
	this.initHeatMap();
	this.enCasa = false;
	this.steps = -1;
	this.initBees();
	this.estado = 1;
	this.aux = 0;
	this.render();
	this.animationId = requestAnimationFrame(this._retornar.bind(this));
};

Kibus.prototype.onLoad = function(callback){
	var numImages = this.images.length;
	var loadedImages = 0;
	var self = this;
	for(var i=0; i<numImages; i++){
		this.images[i].onload = function() {
			if(++loadedImages >= numImages) {
				callback.call(self);
			}
		}
	}
}

Kibus.prototype.init = function() {
	var self = this;
	this.map = Array(this.mapHeight);
	this.heatMap = Array(this.mapHeight);
	for (var i = this.mapHeight - 1; i >= 0; i--) {
		this.map[i] = Array(this.mapWidth);
		this.heatMap[i] = Array(this.mapWidth);
	};
	this.initBees();
	this.initHeatMap();
	this.tileWidth = ~~(this.canvas.width / this.mapWidth);
	this.tileHeight = ~~(this.canvas.height / this.mapHeight);
	this.makeRandomMap(this.percentage);
	this.enCasa = false;
	this.render();
};