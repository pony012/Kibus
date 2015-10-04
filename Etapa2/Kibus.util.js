Kibus.prototype.download = function() {
	var element = document.createElement('a');
	var text = '{"width": '+this.mapWidth+', "height": '+this.mapHeight+', "map":[';
	for (var i = 0; i < this.map.length; i++) {
		text +="[";
		for (var j = 0; j < this.map[0].length; j++) {
				text+=this.map[i][j];
				if(j<this.map[0].length-1)
					text+=","
		}
		text+=']';
		if(i<this.map.length-1)
			text+=","
	}
	text+=']}';
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', 'mundo.kib');

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

Kibus.prototype.upload = function() {
	document.getElementById("fileinput").click();
}

Kibus.prototype.cargarMapa = function(obj){
	this.mapWidth = obj.width;
	this.mapHeight = obj.height;
	this.map = Array(obj.height);
	this.flagsMap = Array(obj.height);
	for (var i = obj.width - 1; i >= 0; i--) {
		this.map[i] = Array(obj.width);
		this.flagsMap[i] = Array(obj.width);
	};
	this.initFlags();
	this.tileWidth = ~~(this.canvas.width / this.mapWidth);
	this.tileHeight = ~~(this.canvas.height / this.mapHeight);
	
	var positionSelected = false;

	for (var i = 0; i < this.mapHeight; i++) {
		for (var j = 0; j < this.mapWidth; j++) {
			this.map[i][j] = obj.map[i][j];
			if(this.map[i][j] == 0 && !positionSelected){
				this.house.x = j;
				this.house.y = i;

				this.character.x = j;
				this.character.y = i;

				positionSelected = true;
			}
		}
	}

	this.enCasa = false;
	this.render();
}