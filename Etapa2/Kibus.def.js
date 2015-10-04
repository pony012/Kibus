Kibus.prototype.draw = function(x, y) {
	var img = null;
	if(this.map[y][x]==0){
		img = this.grassImage;
		this.ctx.drawImage(img, 0, 0, 16, 16, x*this.tileWidth, y*this.tileHeight, this.tileWidth, this.tileHeight);
	}else if(this.map[y][x]==1){
		img = this.rockImage;
		this.ctx.drawImage(img, 0, 0, 64, 80, x*this.tileWidth, y*this.tileHeight, this.tileWidth, this.tileHeight);
	}

	if(this.flagsMap[y][x]){
		this.ctx.beginPath();
		this.ctx.moveTo(x*this.tileWidth + this.tileWidth / 4, y*this.tileHeight + this.tileHeight - 1);
		this.ctx.lineTo(x*this.tileWidth + 3 * this.tileWidth / 4 , y*this.tileHeight + this.tileHeight - 1);
		this.ctx.moveTo(x*this.tileWidth + this.tileWidth / 2, y*this.tileHeight + this.tileHeight - 1);
		this.ctx.lineTo(x*this.tileWidth + this.tileWidth / 2, y*this.tileHeight + this.tileHeight / 10);
		this.ctx.lineTo(x*this.tileWidth + 1, y*this.tileHeight + this.tileHeight / 4);
		this.ctx.lineTo(x*this.tileWidth + this.tileWidth / 2, y*this.tileHeight + this.tileHeight / 1.8);
		this.ctx.closePath();
		this.ctx.fillStyle = "hsl(15, 100%, "+ (80 - this.flagsMap[y][x] * 30 / this.flagLimit) +"%)";
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.fillStyle = "hsl(249, 100%, "+ ((this.flagsMap[y][x] / this.flagLimit)*100) +"%)";
		console.log("hsl(249, 100%, "+ ((this.flagsMap[y][x] / this.flagLimit)*100) +"%)");
		this.ctx.font = "8px";
		this.ctx.fillText(this.flagsMap[y][x], x*this.tileWidth + this.tileWidth / 4.2, y*this.tileHeight + this.tileHeight / 2.5);
	}
};

Kibus.prototype.drawEntity = function(Entity) {
	if(Entity.type==0){
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

Kibus.prototype.initFlags = function(){
	for (var i = 0; i < this.mapHeight; i++) {
		for (var j = 0; j < this.mapWidth; j++) {
			this.flagsMap[i][j] = 0;
		}
	}
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

Kibus.prototype.canMove = function(){
	/*
		Returns an array of possible movements for Kibus
		[1 2 3]
		[0 K 4]
		[7 6 5]
	*/
	var self = this;
	

	var moves = [];
	
	var _x = self.character.x,
		_y = self.character.y,
		_nX,
		_nY;
	for (var i = 0; i < 8; i++) {
		_nX = _x + self.movesX[i];
		_nY = _y + self.movesY[i];
		if(_nX >= 0 && _nY >= 0 && _nX < self.mapWidth && _nY < self.mapHeight && self.map[_nY][_nX]!=1){
			moves.push(true);
		}else{
			moves.push(false);
		}
	};
	return moves;
}

Kibus.prototype.getProbabilities = function(){
	var self = this;
	var probabilities = [];
	var moves = this.canMove();

	var totalProb = 0;
	for(var i=0; i<8; i++){
		var val = moves[i]?(this.flagsMap[this.character.y+self.movesY[i]][this.character.x+self.movesX[i]] + 1):0;

		if(this.character.x+self.movesX[i] == this.prevPosition.x && this.character.y+self.movesY[i] == this.prevPosition.y){
			if(moves[i] /*&& this.flagsMap[this.character.y+self.movesY[i]][this.character.x+self.movesX[i]] < 10*/){
				probabilities[i] = 1 / ( val * val * val * val );
			}else{
				probabilities[i] = 0;
			}
		}else{
			if(moves[i] /*&& this.flagsMap[this.character.y+self.movesY[i]][this.character.x+self.movesX[i]] < 10*/){
				probabilities[i] = 1 / (val * val);
			}else{
				probabilities[i] = 0;
			}
		}
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

Kibus.prototype.getRandomMovement = function(){
	var probs = this.getProbabilities();
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
	this.flagsMap[this.prevPosition.y][this.prevPosition.x]++;
	//this.flagsMap[this.character.y][this.character.x]++;
	this.draw(this.prevPosition.x, this.prevPosition.y);
	this.draw(this.character.x, this.character.y);
	this.drawEntity(this.character);
}

Kibus.prototype.validPoint = function(x, y){
	if(x >= 0 && y >= 0 && x < this.mapWidth && y < this.mapHeight && this.map[y][x]!=1 && this.flagsMap[y][x] <= this.flagLimit){
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
		}else{
			cancelAnimationFrame(self.animationId);
		}
	}, 1000 / self.fps);
}

Kibus.prototype.retornar = function(){
	this.initFlags();
	this.enCasa = false;
	this.steps = -1;
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
	this.map = Array(this.mapHeight);
	this.flagsMap = Array(this.mapHeight);
	for (var i = this.mapHeight - 1; i >= 0; i--) {
		this.map[i] = Array(this.mapWidth);
		this.flagsMap[i] = Array(this.mapWidth);
	};
	this.initFlags();
	this.tileWidth = ~~(this.canvas.width / this.mapWidth);
	this.tileHeight = ~~(this.canvas.height / this.mapHeight);
	this.makeRandomMap(this.percentage);
	this.enCasa = false;
	this.render();
};