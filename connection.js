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
	this.target = void 0;/*いまドラッグしているnode*/
	this.candidate = void 0;/*nearestで選択されたnode つまり、結合候補*/
	this.maxDistance = 50;/*この距離以内ならば結合*/
	this.funcConnect = connectNone;

	/*リスト構造の生成*/
	const collection = parent.children;
	console.log(collection);
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
	console.log("connection:",string);

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
		const top = this.nearestTop(this.target);
		const bottom = this.nearestBottom(this.target);
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
Connection.prototype.nearestTop = function(target) {
	const xTarget = target.offsetLeft + target.clientWidth / 2;
	const yTarget = target.offsetTop + target.clientHeight;
	let xx,yy,dist;
	let candidate = void 0;
	let min = 10000000000;
	const heads = getHeads.call(this);
	for(let node of heads) {
		if(node != target) {
			xx = node.offsetLeft + node.clientWidth / 2;
			yy = node.offsetTop;
			dist = Math.sqrt((xx - xTarget) * (xx - xTarget) + (yy - yTarget) * (yy - yTarget));
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
Connection.prototype.nearestBottom = function(target) {
	const xTarget = /*Number(target.style.left.match(re)[0])*/target.offsetLeft + target.clientWidth / 2;
	const yTarget = /*Number(target.style.top.match(re)[0]) +*/ target.offsetTop;
	let xx,yy,dist;
	let candidate = void 0;
	let min = 10000000000;
	const nn = this.parent.children.length;
	for(let node of this.parent.children) {
		if(node != target) {
			xx = /*Number(node.style.left.match(re)[0]) +*/node.offsetLeft +  node.clientWidth / 2;
			yy = /*Number(node.style.top.match(re)[0]) +*/ node.offsetTop + node.clientHeight;
			dist = Math.sqrt((xx - xTarget) * (xx - xTarget) + (yy - yTarget) * (yy - yTarget));
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
Connection.prototype.sortZIndex = function(target) {
	/*targetを一番前に出す。そのほかの前後関係はそのまま*/
	const aa = [ ];
	let zindex,max = -100000;
	for(let node of this.parent.children) {
		zindex = Number(node.style.zIndex);
		if(zindex > max) max = zindex;
	}
	target.style.zIndex = (max + 1).toString();
	print1(max);

};


/*整列2種類*/
function rearrangeTop() {

	/*先頭を取り出す*/
	const heads = getHeads.call(this);
	/*this.targetの先頭は？*/
	const head = getHead(this.target);
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
	console.log('rearrange');
};
function rearrangeBottom() {

	/*先頭を取り出す*/
	const heads = getHeads.call(this);
	/*this.targetの先頭は？*/
	const head = getHead(this.target);
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
	console.log('rearrange');
};

/*結合２種類、分離のみ1種類*/
function connectNone() {
	console.log('none',this);
	/*前にいたツリーから離脱*/
	if(this.target.frontNode != void 0) this.target.frontNode.nextNode = this.target.nextNode;
	if(this.target.nextNode != void 0) this.target.nextNode.frontNode = this.target.frontNode;
	this.target.frontNode = void 0;
	this.target.nextNode = void 0;
};
function connectTop() {
	console.log('top',this);
	/*新しいツリーの先頭に挿入*/
	this.candidate.frontNode = this.target;
	this.target.nextNode = this.candidate;
	this.target.frontNode = void 0;

};
function connectBottom() {
	console.log('bottom',this);
	/*新しいツリーに挿入*/
	this.target.frontNode = this.candidate;
	this.target.nextNode = this.candidate.nextNode;
	if(this.candidate.nextNode != void 0) this.candidate.nextNode.frontNode = this.target;
	this.candidate.nextNode = this.target;

};
function getHeads() {
	/*各ツリーの先頭を取り出す*/
	const head = [ ];
	let target;
	for(let node of this.parent.children) {
		target = node;
		while(target.frontNode != void 0) {
			console.log(target.innerText);
			target = target.frontNode;
		}
		if(head.indexOf(target) == -1) head.push(target);
	}
	return head;
};
function getHead(element) {
	/*elementの所属するツリーの先頭を返す*/
	let target = element;
	while(target.frontNode != void 0) target = target.frontNode;
	return target;
};
