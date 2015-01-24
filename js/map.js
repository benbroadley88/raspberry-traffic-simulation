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
		var returnNode = list[id];
		returnNode.index = id;
		return returnNode;
	}
	var getLinks = function(from){
		var tmpList = [];
		for(var i = 0; i<links.length;i++){
			if(links[i].from == from){
				tmpList.push(links[i]);
			}
		}
		return tmpList;
	}
	var getDirection = function(nodeIndex1,nodeIndex2){
		var m = (get(nodeIndex2).y - get(nodeIndex1).y)/(get(nodeIndex2).x - get(nodeIndex1).x);
		return Math.atan(m);
	}
	var removeNode = function(id){
		// required?
	}
	

	
	//NodeList.findPath(NodeList.getNode(1),NodeList.getNode(2));
	
	function findPath(startNode,targetNode){
		var worldNodes = list; // create a copy of the nodes we can use for the calculation		
		function TmpNode(Parent,Point){
			var node = {
				// pointer to another Node object
				index:Point.index,
				Parent:Parent,
				// array index of this Node in the world linear array
				value:Point.x + Point.y,
				// the location coordinates of this Node
				x:Point.x,
				y:Point.y,
				// the distanceFunction cost to get
				// TO this Node from the START
				f:0,
				// the distanceFunction cost to get
				// from this Node to the GOAL
				g:0
			}
			return node;
		}
		var chkArray = function(array,lookup,f){
			for(var i = 0; i<array.length; i++){
				if(array[i].index == lookup && array[i].f < f){
					return true;
				}
			}			
		}
		var getDistance = function(p1,p2){
			return (Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y));
		}
		
		var calculate = function(){
			var openList = [];
			var closedList = [];
			
			var tempNode = TmpNode(null,{x:startNode.x,y:startNode.y,index:startNode.index});
			openList.push(tempNode);
			do {
				var q = {f:null};
				for(var i = 0; i<openList.length; i++){
					var removeIndex = null;
					if(openList[i].f < q.f || q.f == null){
						q = openList[i];
						openList.splice(i,1);
					}
				}
				//pop q off the open list
				
				
				var neighbours = getLinks(q.index); //need to give it an index
				var successors = []
				for(var i = 0; i < neighbours.length; i++){
					successors.push(TmpNode(tempNode,get(neighbours[i].to)));
				}
				if(q.index == targetNode.index){
						openList = [];
						break;
				}else{
					for(var i = 0; i<successors.length; i++){				
						successors[i].g = q.g + getDistance(successors[i],q) //plus distance
						successors[i].h = getDistance(successors[i],targetNode)  //distance from goal to successor
						successors[i].f = successors[i].g + successors[i].h;
						if(chkArray(openList,successors[i].index,successors[i].f) || chkArray(closedList,successors[i].index,successors[i].f)){
							continue;
						}else{
							openList.push(successors[i]);
						}
					}
				}
				closedList.push(q);
			}while(openList.length > 0)
			closedList.push(q);
				
			var pathIndex = [];
			for(var i=0; i<closedList.length; i++){
				pathIndex.push(closedList[i].index);
			}
			return pathIndex;
		}
		return calculate();
	}
	
	return {
		addNode: add,
		addLink: addLink,
		addCar: addCar,
		getNode: get,
		getList: list,
		getLinks: getLinks,
		getCars: cars,
		getNodeLinks: links,
		getDirection: getDirection,
		findPath: findPath
	}
})();

var NodeLink = function(from,to){
	if(from === to){
		return;
	}
	this.from = from;
	this.to = to;
	this.cost = 1;
	this.colour = "black";
	this.draw = function(){
		var fromNode = NodeList.getNode(this.from);
		var toNode = NodeList.getNode(this.to);
		ctx.beginPath();
		ctx.moveTo(fromNode.x,fromNode.y);
		ctx.lineTo(toNode.x,toNode.y);
		ctx.lineWidth = this.cost / 2;
		if(this.cost < 20){
			ctx.strokeStyle = this.colour;
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

	this.path = NodeList.findPath(NodeList.getNode(startNodeIndex),NodeList.getNode(finishNodeIndex));
	
	console.log(this.path);
	//to do: need to calculate the initial path before setting initial direction
	this.direction = NodeList.getDirection(startNodeIndex,this.path[1]);
	
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
		
		
		console.log("hest");
		this.animFrame = window.requestAnimationFrame(this.move);
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





NodeList.addNode(new Node(10,10,2));   	//0 to 	1 & 4
NodeList.addNode(new Node(75,255,2));	//1 to 	0 & 2 & 4
NodeList.addNode(new Node(250,255,2));	//2	to 	1 & 3
NodeList.addNode(new Node(590,500,2));	//3 to	2
NodeList.addNode(new Node(10,690,2));	//4 to	0 & 1
NodeList.addNode(new Node(240,690,2));	//5 to	2
NodeList.addNode(new Node(699,10,2));	//6 to	2


NodeList.addLink(new NodeLink(0,1));
	NodeList.addLink(new NodeLink(1,0));
NodeList.addLink(new NodeLink(1,2));
	NodeList.addLink(new NodeLink(2,1));
NodeList.addLink(new NodeLink(2,3));
	NodeList.addLink(new NodeLink(3,2));
NodeList.addLink(new NodeLink(4,1));
	NodeList.addLink(new NodeLink(1,4));
NodeList.addLink(new NodeLink(4,0));
	NodeList.addLink(new NodeLink(0,4));
NodeList.addLink(new NodeLink(5,2));
	NodeList.addLink(new NodeLink(2,5));
NodeList.addLink(new NodeLink(0,6));
	NodeList.addLink(new NodeLink(6,0));

NodeList.addLink(new NodeLink(6,2));
	NodeList.addLink(new NodeLink(2,6));

/*
//lets procedurally generate some random nodes & cars 
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
*/
var maxCars = 4;
for(var i=0; i<maxCars; i++){
	var randstart = Math.ceil(Math.random() * NodeList.getList.length) - 1;
	var randdest = Math.ceil(Math.random() * NodeList.getList.length) - 1;
	while (randstart === randdest){
		randdest = Math.ceil(Math.random() * NodeList.getList.length) - 1;
	}
	console.log("from"+randstart,"to"+randdest);
	NodeList.addCar(new Car(randstart,randdest));
}
