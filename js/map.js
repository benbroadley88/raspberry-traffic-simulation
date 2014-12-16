var NodeList = (function(){
	var list = [];
	
	var add = function(obj){
		list.push(new Node(obj));
	}
	var get = function(id){
		return list[id];
	}
	var removeNode = function(){
		// required?
	}
	return {
		addNode: add,
		getNode: get
	}
})();

var Node = function Node(obj){
	var x;
	var y;
	var cost;
	this.x = obj.x;
	this.y = obj.y;
	this.cost = obj.cost;
}

var map = (function(){
	var canvas, ctx;
	
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
		
		_drawLinks();
		_drawNodes();
		
		
		//begin the animation loop
		window.requestAnimationFrame(_draw);
	}
	
	var _drawNodes = function(){
		
	}
	
	var _drawLinks = function(){
	
	}
	
	
	
	
	
	//init just before the return to ensure all functions are correctly parsed
	_init();
	return {
	
	}
})();