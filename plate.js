
/****************************************************************
 * 使い方
 * <script type="application/javascript"></script>
 * <script type="application/javascript">
 * onload = function() {
 * 	var element = myPlate.new()
 * 	document.getElementsByTagName('body')[0].appendChild(element);
 * 	element.innerText = 'example';
 * };
 * </script>
 *
 * 効果
 * マウスによるドラッグができるようになる
 ******************************************************************/
(function() {
let gElement = void 0;
let gXDown,gYDown;
let gYMove,gXMove;
myPlate = { };

Object.defineProperty(myPlate,'new',{value:fNew,configurable:false});

function fNew() {
	const element = document.createElement('div');
	element.style.position = 'relative';
	element.style.left = '0px';
	element.style.top = '0px';
	element.addEventListener('mousedown',(event)=>{
		gXDown = event.clientX;
		gYDown = event.clientY;
	
		if(gElement == void 0) {
			gElement = event.target;

			gLeft = Number(gElement.style.left.match(/[-]?\d+(?:\.\d+)?/)[0]);
			gTop = Number(gElement.style.top.match(/[-]?\d+(?:\.\d+)?/)[0]);

		}
print2(gXDown,gYDown);

		conn.sortZIndex(event.target);
		conn.target = event.target;
		connectNone.call(conn);
		
	},false);
	element.addEventListener('mouseup',(event)=>{
		gElement = void 0;

		if(conn.target != void 0) {
			conn.decorateClearCandidate();
			conn.funcConnect();
			conn.funcRearrange();
			conn.target = void 0;/*ドラッグ中のnode*/
		}

	},false);
	return element;
};
/*gXMove,gYMoveはglobalではないので、()();の中に置きます*/
window.addEventListener('mousemove',(event)=>{
	gXMove = event.clientX;
	gYMove = event.clientY;

	print3(gXMove,gYMove);
	if(gElement != void 0) {
		gElement.style.left = (gLeft + gXMove - gXDown ).toString() + 'px';
		gElement.style.top = (gTop + gYMove - gYDown ).toString() + 'px';
		conn.nearest(gElement);
	}
	event.preventDefault();

},false);
})();


