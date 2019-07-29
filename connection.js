/*****************************************************************
 * const connection = new Connect(parentNode.children);
 * Connect.prototype.nCategory() ... くっついてるのを１つと数えて、それが全部でいくつあるかを返す
 * Connect.prototype.order(number) : カテゴリー番号を入れるとそれに属するノードを上から順番に配列で返す
 * 注意
 * 各childにはidが付与されている必要があります。
 *****************************************************************/

re = new RegExp("[-]?\\d+(\\.\\d+)?");
const Connection = function(parent) {

	this.parent = parent;
	this.elementClicked = void 0;/*いまドラッグしているnode*/
	
	this.candidate = void 0;/*nearestで選択されたnode つまり、結合候補*/
	this.maxDistance = 50;/*この距離以内ならば結合*/
	this.funcConnect = connectNone;

	/*リスト構造の生成*/
	const collection = parent.children;
	const len = collection.length;
	for(let ii=0;ii<len;ii++) {

		collection[ii].originX = collection[ii].offsetLeft;
		collection[ii].originY = collection[ii].offsetTop;

		if(ii == 0) collection[ii].frontNode = void 0;
		else collection[ii].frontNode = collection[ii-1];

		if(ii == len - 1) collection[ii].nextNode = void 0;
		else collection[ii].nextNode = collection[ii+1];
	
	}
};
Connection.prototype.accompany = function(node) {
	let target = node;
	while(target.frontNode != void 0) target = target.frontNode;
	let string = target.innerText + ' ';
	while(target.nextNode != void 0) {
		string += target.nextNode.innerText + ' ';
		target = target.nextNode;
	}

 };
 Connection.prototype.detouch = function(node) {
 	if(node.frontNode != void 0) node.frontNode.nextNode = node.nextNode;
	if(node.nextNode != void 0) node.nextNode.frontNode = node.frontNode;
	node.frontNode = void 0;
	node.nextNode = void 0;
};
Connection.prototype.connectNodeNextTo = function(node,front) {
	node.frontNode = front;
	node.nextNode = front.nextNode;
	if(front.nextNode != void 0) front.nextNode.frontNode = node;
	front.nextNode = node;
};
Connection.prototype.nearest = function() {
	if(this.parent.children.length > 1) {
		/*他のノードがある場合のみ一番近くのノードを光らせる*/
		const top = this.nearestTop();
		const bottom = this.nearestBottom();
		if(top.distance > bottom.distance) {
			if(bottom.distance < this.maxDistance) {
				this.replaceCandidate(bottom.node);
				this.decorateCandidateBottom();
				this.funcConnect = connectBottom;
				this.funcRearrange = rearrangeBottom;
				
			} else {
				this.decorateClearCandidate();
				this.candidate = void 0;
				this.funcConnect = connectNone;
				this.funcRearrange = rearrangeBottom;

			}
		} else if(top.distance < this.maxDistance) {
			this.replaceCandidate(top.node);
			this.decorateCandidateTop();
			this.funcConnect = connectTop;
			this.funcRearrange = rearrangeTop;

		} else {
			this.decorateClearCandidate();
			this.candidate = void 0;
			this.funcConnect = connectNone;
			this.funcRearrange = rearrangeBottom;
		}
	}
};
/*「クリックされたツリー」の最下段と「その相手」の最上段*/
Connection.prototype.nearestTop = function() {
	const myHead = getHead(this.elementClicked);
	const myTale = getTale(this.elementClicked);
	const myX = myTale.offsetLeft + myTale.clientWidth / 2;
	const myY = myTale.offsetTop + myTale.clientHeight;
	let xx,yy,dist;
	let candidate = void 0;
	let min = 10000000000;
	const heads = getHeads.call(this);
	for(let node of heads) {
		if(node != myHead) {
			xx = node.offsetLeft + node.clientWidth / 2;
			yy = node.offsetTop;
			dist = Math.sqrt((xx - myX) * (xx - myX) + (yy - myY) * (yy - myY));
			if(dist < min) {
				min = dist;
				candidate = node;
			}
		}
	}
	return {
		node : candidate,
		distance : min
	};
};
/*「クリックされたツリー」の最上段と「その相手ツリー」の最下段*/
Connection.prototype.nearestBottom = function() {
	const myTale = getTale(this.elementClicked);
	const myHead = getHead(this.elementClicked);
	const myX = myHead.offsetLeft + myHead.clientWidth / 2;
	const myY = myHead.offsetTop;
	let xx,yy,dist;
	let candidate = void 0;
	let min = 10000000000;
	const tales = getTales.call(this);
	for(let node of tales) {
		if(node != myTale) {
			xx = node.offsetLeft +  node.clientWidth / 2;
			yy = node.offsetTop + node.clientHeight;
			dist = Math.sqrt((xx - myX) * (xx - myX) + (yy - myY) * (yy - myY));
			if(dist < min) {
				min = dist;
				candidate = node;
			}
		}
	}
	return {
		node : candidate,
		distance : min
	};
};
Connection.prototype.replaceCandidate = function(candidate) {
	this.decorateClearCandidate();
	this.candidate = candidate;
};
Connection.prototype.decorateClearCandidate = function() {
	if(this.candidate != void 0) this.candidate.style.border = 'solid 1px white';
};
Connection.prototype.decorateCandidateTop = function() {
	this.candidate.style.borderTop = 'solid 1px red';
};
Connection.prototype.decorateCandidateBottom = function() {
	this.candidate.style.borderBottom = 'solid 1px red';
};
/*targetが所属するツリーを前にする*/
Connection.prototype.sortZIndex = function(target) {
	const aa = [ ];
	let zindex,max = -100000;
	for(let node of this.parent.children) {
		zindex = Number(node.style.zIndex);
		if(zindex > max) max = zindex;
	}
	const mm = (++max).toString();
	target = getHead(target);
	target.style.zIndex = mm;
	target = target.nextNode;
	while(target != void 0) {
		target.style.zIndex = mm;
		target = target.nextNode;
	}
};
/*クリックされたツリーのみを成立*/
Connection.prototype.arrangeTreeClicked = function() {
	let target = this.elementClicked;
	let sumHeight = target.offsetHeight;
	target = target.nextNode;
	while(target != void 0) {
		target.style.left = this.elementClicked.style.left.match(re)[0]+ 'px';
		target.style.top = (Number(this.elementClicked.style.top.match(re)[0])-target.originY + this.elementClicked.originY + sumHeight).toString() + 'px';
		sumHeight += target.offsetHeight;
		target = target.nextNode;
	}
};


/*整列2種類*/
function rearrangeTop() {

	/*先頭を取り出す*/
	const heads = getHeads.call(this);
	const head = getHead(this.elementClicked);
	let sumHeight,base;
	for(let node of heads) {
		this.accompany(node);/*確認*/
		if(node == head) {
			base = node.nextNode;
			sumHeight = base.offsetHeight;
			target = base.nextNode;
			while(target != void 0) {
				target.style.left = base.style.left.match(re)[0]+ 'px';
				target.style.top = (Number(base.style.top.match(re)[0])-target.originY + base.originY + sumHeight).toString() + 'px';
				sumHeight += target.offsetHeight;
				target = target.nextNode;
			}
			head.style.left = base.style.left.match(re)[0]+ 'px';
			head.style.top = (Number(base.style.top.match(re)[0])-head.originY + base.originY - head.offsetHeight).toString() + 'px';

		} else {
			sumHeight = node.offsetHeight;
			target = node.nextNode;
			while(target != void 0) {
				target.style.left = node.style.left.match(re)[0]+ 'px';
				target.style.top = (Number(node.style.top.match(re)[0])-target.originY + node.originY + sumHeight).toString() + 'px';
				sumHeight += target.offsetHeight;
				target = target.nextNode;
			}
		}
	}
};
function rearrangeBottom() {

	/*先頭を取り出す*/
	const heads = getHeads.call(this);
	const head = getHead(this.elementClicked);
	let sumHeight;
	for(let node of heads) {
		this.accompany(node);
		sumHeight = node.offsetHeight;
		target = node.nextNode;
		while(target != void 0) {
			target.style.left = node.style.left.match(re)[0]+ 'px';
			target.style.top = (Number(node.style.top.match(re)[0])-target.originY + node.originY + sumHeight).toString() + 'px';
			sumHeight += target.offsetHeight;
			target = target.nextNode;
		}
	}
};

/*ツリーの結合と分離関係*/
function connectNone() {
	/*前にいたリストから離脱*/
	const me = this.elementClicked;
	if(me.frontNode != void 0) me.frontNode.nextNode = void 0;
	me.frontNode = void 0;
};
function connectTop() {
	/*新しいリストの先頭に挿入*/
	const myTale = getTale(this.elementClicked);
	this.candidate.frontNode = myTale;
	myTale.nextNode = this.candidate;

};
function connectBottom() {
	/*新しいリストに挿入*/
	const myHead = getHead(this.elementClicked);
	myHead.frontNode = this.candidate;
	this.candidate.nextNode = myHead;

};

/*ツリー探索関係*/
function getHeads() {
	/*各リストの先頭を取り出す*/
	const heads = [ ];
	let target;
	for(let node of this.parent.children) {
		target = node;
		while(target.frontNode != void 0) {
			target = target.frontNode;
		}
		if(heads.indexOf(target) == -1) heads.push(target);
	}
	return heads;
};
function getHead(element) {
	/*elementの所属するリストの先頭を返す*/
	let target = element;
	while(target.frontNode != void 0) target = target.frontNode;
	return target;
};
function getTales() {
	/*各リストの先頭を取り出す*/
	const tales = [ ];
	let target;
	for(let node of this.parent.children) {
		target = node;
		while(target.nextNode != void 0) {
			target = target.nextNode;
		}
		if(tales.indexOf(target) == -1) tales.push(target);
	}
	return tales;
};
function getTale(element) {
	/*elementの所属するリストの最後尾を返す*/
	let target = element;
	while(target.nextNode != void 0) target = target.nextNode;
	return target;
};
