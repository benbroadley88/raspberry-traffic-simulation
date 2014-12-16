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
		canvas.id = map;
		_resizeCanvas();
		document.getElementsByTagName("body")[0].appendChild(canvas);
		ctx = canvas.getContext("2d");
	}
	var _resizeCanvas = function(){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	var _draw = function(){
		console.log("draw");
	}
	
	
	
	
	
	//init just before the return to ensure all functions are correctly parsed
	_init();
	return {
	
	}
})();