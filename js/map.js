var NodeList = (function(){
	var list = [];
	var links = [];
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
	var get = function(id){
		return list[id];
	}
	var removeNode = function(id){
		// required?
	}
	return {
		addNode: add,
		addLink: addLink,
		getNode: get,
		getList: list,
		getNodeLinks: links
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
		this.cost --;
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
		
		//begin the animation loop
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
	
	
	
	
	
	//init just before the return to ensure all functions are correctly parsed
	_init();
	return {
	
	}
})();





//lets procedurally generate some random nodes
for(var i = 0; i<10; i++){
	NodeList.addNode(new Node(Math.random()*window.innerWidth,Math.random()*window.innerHeight,1));
	
	var from = Math.ceil(Math.random() * 10) -1;
	var to = Math.ceil(Math.random() * 10) -1;
	while(to === from){
		to = Math.ceil(Math.random() * 10) -1;
	}
	NodeList.addLink(new NodeLink(from,to));
}
