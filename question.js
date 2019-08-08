function shuffle(parent) {

	let count = 0;
	let newNode,referenceNode;
	const len = parent.children.length;
	if(len > 1) {
		const hoge = setInterval(()=>{
			if(++count > len*4) clearInterval(hoge);
			referenceNode = parent.children[0];
			nn = Math.abs(Math.round(Math.random() * parent.children.length - 0.5));
			newNode = parent.children[nn];
			parent.insertBefore(newNode,referenceNode);
		},10);
	}
	return len*4*10;

};

function check(oConnection) {

	const parent = oConnection.parent;
	const nn = getHeads.call(oConnection).length;//Connection.prototypeに入れるべき
	if(nn == 1) {
		const head = getHead(parent.children[0]);
		let target = head;
		let count = 0;
		let flag = true;
		while(target != void 0) {
			if(target.id.match(/\d+/)[0] != count.toString()) {
				flag = false;
				break;
			}
			count++;
			target = target.nextNode;
		}
		return flag;
	} else return false;
};

function score() {
	let point = 0;
	
	let myNum;
	const len = this.parent.children.length;
	let ele;
	for(let target of this.parent.children) {
		myNum = Number(target.id.match(re)[0]);
		if(myNum > 0) {
			ele = target.frontNode;
			while(ele != void 0) {
				if(myNum-1 == Number(ele.id.match(re)[0])) {
					point++;
					break;
				}
				ele = ele.frontNode;
			}
		}
		if(myNum < len-1) {
			ele = target.nextNode;
			while(ele != void 0) {
				if(myNum+1 == Number(ele.id.match(re)[0])) {
					point++;
					break;
				}
				ele = ele.nextNode;
			}
		}
	}
	const ten = Math.round((point)/(len*2 - 2)*100);
	ele = document.getElementById('score');
	if(ele == void 0) {
		ele = document.createElement('div');
		ele.id = 'score';
		ele.style.position = 'fixed';
		ele.style.backgroundColor = 'white';
		ele.style.top = '0px';
		ele.style.left = (window.innerWidth/2).toString() + 'px';
		document.getElementsByTagName('body')[0].appendChild(ele);
	}
	ele.style.zIndex = '300000';
	ele.innerText = ten.toString();
};

function answer() {
		const len = this.parent.children.length;
		console.log(len);
		let ele;
		for(let ii=0;ii<len;ii++) {
			ele = document.getElementById('node' + ii.toString());
			ele.innerText = htmlCards[ii][0] +'  '+ htmlCards[ii][1];
			ele.style.width = '500px';
		}
};

function timer() {
	let ele = document.getElementById('timer');
	if(ele == void 0) {
		ele = document.createElement('span');
		document.getElementsByTagName('body')[0].appendChild(ele);
		ele.style.backgroundColor = 'white';
		ele.style.color = 'black';
	}
	ele.style.position = 'fixed';
	ele.style.top = '0px';
	ele.style.left = '800px';
	ele.innerText = hogeTimeCount;
};


	
