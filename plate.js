
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
let gScrollX,gScrollY;
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
			gScrollX = window.scrollX;
			gScrollY = window.scrollY;

		}

		conn.elementClicked = event.target;
		conn.sortZIndex(event.target);
		connectNone.call(conn);
		
	},false);
	window.addEventListener('mouseup',(event)=>{
		let ele;
		gElement = void 0;

		if(conn.elementClicked != void 0) {
			conn.decorateClearCandidate();
			conn.funcConnect();
			conn.funcRearrange();
			conn.elementClicked = void 0;/*ドラッグ中のnode*/
			if(check(conn)) {
				ele = document.createElement('div');
				document.getElementsByTagName('body')[0].appendChild(ele);
				ele.innerText = '正解です';
				ele.style.color = 'white';
				clearInterval(hogeTime);
			}
			score.call(conn);
		}

	},false);
	return element;
};

function reposition() {

	if(gElement != void 0) {

		gElement.style.left = (window.scrollX - gScrollX + gLeft + gXMove - gXDown ).toString() + 'px';
		gElement.style.top = (window.scrollY - gScrollY + gTop + gYMove - gYDown ).toString() + 'px';
		console.log('boolean',gElement == conn.elementClicked);
		conn.arrangeTreeClicked();
		conn.nearest(gElement);
	}

};
/*gXMove,gYMoveはglobalではないので、()();の中に置きます*/
window.addEventListener('mousemove',(event)=>{
	gXMove = event.clientX;
	gYMove = event.clientY;

	if(gXMove < 0) gXMove = 0;
	if(gYMove < 0) gYMove = 0;
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
let hogeTimeCount = 0;
let hogeTime = void 0;
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
		ePre.style.backgroundColor = 'white';
		ePre.style.color = 'black';
		eBody.appendChild(ePre);
		ePre.style.position = 'fixed';
		ePre.style.zIndex = '300000';
		ePre.style.top = '0px';
		ePre.style.left = (window.innerWidth-50).toString() + 'px';
	}
	const eNext = document.createElement('a');
	eNext.innerText = '  次回';
	eNext.href = (htmlNumber + 1).toString() + '.html';
	eNext.style.backgroundColor = 'white';
	eNext.style.color = 'black';
	eBody.appendChild(eNext);
	eNext.style.position = 'fixed';
	eNext.style.zIndex = '300000';
	eNext.style.top = '0px';
	eNext.style.left = (window.innerWidth-100).toString() + 'px';
	const eAnswer = document.createElement('button');
	eAnswer.innerText = '解答';
	eBody.appendChild(eAnswer);
	eAnswer.addEventListener('click',(event)=>{
		answer.call(conn);
		event.stopPropagation();
	},false);

	let ele2;
	let ii = 0;
	for(let string of htmlCards) {
		ele2 = myPlate.new();/*relative left top が設定されます*/	
		ele2.id = 'node' + ii.toString();
		ele2.innerText = htmlCards[ii][0];
		ele2.style.color = 'white';
		ele2.style.width = '300px';
		ele2.style.border = 'solid 1px white';
		ele2.style.padding = '5px';
		ele2.style.backgroundColor = 'black';
		ele2.style.zIndex = ii.toString();
		ePlates.appendChild(ele2);
		ii++;
	}
	const timeToShuffle = shuffle(ePlates);
	const fuga = setTimeout(()=>{
		conn = new Connection(ePlates);
		score.call(conn);
	},timeToShuffle+100);

	hogeTime = setInterval(()=>{
console.log('timer');
		timer();
		hogeTimeCount++;
	},1000);
};


