var NodeList = (function(){
	var list = [];
	var links = [];
	var cars = [];
	
	var add = function(node){
		if(node instanceof Node){
			list.push(node);
		}else{
			return false;
		}
	}
	var addLink = function(link){
		if(link instanceof NodeLink){
			links.push(link);
		}else{
			return false;
		}
	}
	var addCar = function(car){
		if(car instanceof Car){
			cars.push(car);
		}else{
			return false;
		}
	}
	var get = function(id){
		return list[id];
	}
	var getDirection = function(nodeIndex1,nodeIndex2){
		var m = (get(nodeIndex2).y - get(nodeIndex1).y)/(get(nodeIndex2).x - get(nodeIndex1).x);
		return Math.atan(m);
	}
	var removeNode = function(id){
		// required?
	}
	
	return {
		addNode: add,
		addLink: addLink,
		addCar: addCar,
		getNode: get,
		getList: list,
		getCars: cars,
		getNodeLinks: links,
		getDirection: getDirection
	}
})();

var NodeLink = function(from,to){
	if(from === to){
		return;
	}
	this.from = from;
	this.to = to;
	this.cost = 1;
	this.draw = function(){
		var fromNode = NodeList.getNode(this.from);
		var toNode = NodeList.getNode(this.to);
		ctx.beginPath();
		ctx.moveTo(fromNode.x,fromNode.y);
		ctx.lineTo(toNode.x,toNode.y);
		ctx.lineWidth = this.cost / 2;
		if(this.cost < 20){
			ctx.strokeStyle = "black";
		}else{
			ctx.strokeStyle = "red";
		}
		ctx.stroke();
	}
	this.increaseCost = function(){
		this.cost ++;
	}
	this.decreaseCost = function(){
		if(this.cost - 1 > 0){
			this.cost --;
		}
	}
}

var Node = function Node(x,y,cost){
	this.x = x;
	this.y = y;
	this.cost = cost;
	this.draw = function(){
		ctx.beginPath();
		
		if(this.cost < 20){
			ctx.fillStyle = "black";
		}else{
			ctx.fillStyle = "red";
		}
		ctx.arc(this.x,this.y,Math.min(this.cost/2,10),0,Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
	}
	this.increaseCost = function(){
		this.cost ++;
	}
	this.decreaseCost = function(){
		if(this.cost - 1 > 0){
			this.cost --;
		}
	}
}

var Car = function Car(startNodeIndex,finishNodeIndex){
	this.startNodeIndex = startNodeIndex;
	this.finishNodeIndex = finishNodeIndex;
	this.currentNodeIndex = startNodeIndex;
	this.previousNodeIndex = startNodeIndex;
	
	var nodePosition = NodeList.getNode(startNodeIndex);
	this.position = {
		x:nodePosition.x,
		y:nodePosition.y
		};

	
	//to do: need to calculate the initial path before setting initial direction
	this.direction = NodeList.getDirection(startNodeIndex,finishNodeIndex);
	
	this._width = 5;
	this._height = 10;
	this._colour = "blue";
	
	this.draw = function(){
		ctx.fillStyle = this._colour;
		ctx.save();
		
		ctx.translate(this.position.x + 1,this.position.y);
		ctx.rotate(this.direction);
		ctx.fillRect(0,0,this._height,this._width);
		ctx.restore();
	}
	this.move = function(){
		//todo
	}
}

var canvas, ctx;

var map = (function(){
	
	var _init = function(){
		//create the canvas element
		_createCanvas();
		
		//prepare to respond to window resize
		if(window.addEventListener){
			window.addEventListener("resize",_resizeCanvas,false);
		}else{
			window.attachEvent("resize",_resizeCanvas);
		}		
		_draw();
	}
	var _createCanvas = function(){
		canvas = document.createElement('canvas');
		canvas.id = "map";
		_resizeCanvas();
		document.getElementsByTagName("body")[0].appendChild(canvas);
		ctx = canvas.getContext("2d");
	}
	var _resizeCanvas = function(){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	var _draw = function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		_drawLinks();
		_drawNodes();
		_drawCars();
		window.requestAnimationFrame(_draw);
	}
	
	var _drawNodes = function(){
		for(var i = 0; i < NodeList.getList.length; i++){
			NodeList.getList[i].draw();
		}	
	}
	
	var _drawLinks = function(){
		for(var i = 0; i < NodeList.getNodeLinks.length; i++){
			NodeList.getNodeLinks[i].draw();
		}
	}
	var _drawCars = function(){
		for(var i=0; i< NodeList.getCars.length; i++){
			NodeList.getCars[i].draw();
		}
	}
	
	//init just before the return to ensure all functions are correctly parsed
	_init();
	return {
	
	}
})();





//lets procedurally generate some random nodes
var maxNodes = 10;
for(var i = 0; i<maxNodes; i++){
	NodeList.addNode(new Node(Math.random()*window.innerWidth,Math.random()*window.innerHeight,1));
	
	var from = Math.ceil(Math.random() * maxNodes) -1;
	var to = Math.ceil(Math.random() * maxNodes) -1;
	while(to === from){
		to = Math.ceil(Math.random() * maxNodes) -1;
	}
	NodeList.addLink(new NodeLink(from,to));
}
var maxCars = 4;
for(var i=0; i<maxCars; i++){
	var randstart = Math.ceil(Math.random() * NodeList.getList.length) - 1;
	var randdest = Math.ceil(Math.random() * NodeList.getList.length) - 1;
	while (randstart === randdest){
		randdest = Math.ceil(Math.random() * NodeList.getList.length) - 1;
	}
	NodeList.addCar(new Car(randstart,randdest));
}
