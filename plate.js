
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
			gScrollY = window.scrollY;

		}

		conn.elementClicked = event.target;
		conn.sortZIndex(event.target);
		connectNone.call(conn);
		
	},false);
	element.addEventListener('mouseup',(event)=>{
		gElement = void 0;

		if(conn.elementClicked != void 0) {
			conn.decorateClearCandidate();
			conn.funcConnect();
			conn.funcRearrange();
			conn.elementClicked = void 0;/*ドラッグ中のnode*/
			if(check(conn)) {
				const ele = document.createElement('div');
				document.getElementsByTagName('body')[0].appendChild(ele);
				ele.innerText = '正解です';
				ele.style.color = 'white';
			};
		}

	},false);
	return element;
};

function reposition() {

	gElement.style.left = (gLeft + gXMove - gXDown ).toString() + 'px';
	gElement.style.top = (window.scrollY - gScrollY + gTop + gYMove - gYDown ).toString() + 'px';
	console.log('boolean',gElement == conn.elementClicked);
	conn.arrangeTreeClicked();
	conn.nearest(gElement);

};
/*gXMove,gYMoveはglobalではないので、()();の中に置きます*/
window.addEventListener('mousemove',(event)=>{
	gXMove = event.clientX;
	gYMove = event.clientY;

	if(gElement != void 0) {
		reposition();
	}
	event.preventDefault();
},false);
window.addEventListener('scroll',(event)=>{
	if(gElement != void 0) {
		reposition();
	}
},false);

})();

let conn;
function start() {

	const eBody = document.getElementsByTagName('body')[0]; 
	eBody.style.backgroundColor = 'black';
	const ePlates = document.createElement('div');
	ePlates.id = 'plates';
	eBody.appendChild(ePlates);
	eBody.appendChild(document.createElement('br'));
	if(htmlNumber - 1 > 0) {
		const ePre = document.createElement('a');
		ePre.innerText = '前回  ';
		ePre.href = (htmlNumber - 1).toString() + '.html';
		eBody.appendChild(ePre);
	}
	const eNext = document.createElement('a');
	eNext.innerText = '  次回';
	eNext.href = (htmlNumber + 1).toString() + '.html';
	eBody.appendChild(eNext);

	let ele2;
	let ii = 0;
	for(let string of htmlCards) {
		ele2 = myPlate.new();/*relative left top が設定されます*/	
		ele2.id = 'node' + ii.toString();
		ele2.innerText = htmlCards[ii][0];
		ele2.style.color = 'white';
		ele2.style.width = '200px';
		ele2.style.border = 'solid 1px white';
		ele2.style.padding = '5px';
		ele2.style.backgroundColor = 'black';
		ele2.style.zIndex = ii.toString();
		ePlates.appendChild(ele2);
		ii++;
	}
	shuffle(ePlates);
	const fuga = setTimeout(()=>{
		conn = new Connection(ePlates);
	},2500);

};


