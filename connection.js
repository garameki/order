/*****************************************************************
 * const connection = new Connect(parentNode.children);
 * Connect.prototype.nCategory() ... くっついてるのを１つと数えて、それが全部でいくつあるかを返す
 * Connect.prototype.order(number) : カテゴリー番号を入れるとそれに属するノードを上から順番に配列で返す
 * 注意
 * 各childにはidが付与されている必要があります。
 *****************************************************************/

 const Connection = function(parent) {

	this.parent = parent;
	this.candidate = void 0;/*nearestで選択されたnode*/

	/*リスト構造の生成*/
	const collection = parent.children;
	const len = collection.length;
	for(let ii=0;ii<len;ii++) {
	
		if(ii == 0) collection[ii].frontNode = void 0;
		else collection[ii].frontNode = collection[ii-1];

		if(ii == len - 1) collection[ii].nextNode = void 0;
		else collection[ii].nextNode = collection[ii+1];
	
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
Connection.prototype.nearest = function(target) {
	if(this.parent.children.length > 1) {
		/*他のノードがある場合のみ一番近くのノードを光らせる*/
		const top = this.nearestTop(target);
		const bottom = this.nearestBottom(target);
		if(top.distance > bottom.distance) {
			this.replaceCandidate(bottom.node);
			this.decorateCandidateBottom();
			print4('bottom',this.candidate.innerText);
		} else {
			this.replaceCandidate(top.node);
			this.decorateCandidateTop();
			print4('top',this.candidate.innerText);
		}
	}
};
Connection.prototype.nearestTop = function(target) {
	const re = new RegExp('[-]?\\d+(?:\\.\\d+)?');
	const xTarget = /*Number(target.style.left.match(re)[0])*/target.offsetLeft + target.clientWidth / 2;
	const yTarget = /*Number(target.style.top.match(re)[0]) +*/ target.offsetTop + target.clientHeight;
	let xx,yy,dist;
	let candidate = void 0;
	let min = 10000000000;
	const nn = this.parent.children.length;
	for(let node of this.parent.children) {
		if(node != target) {
			xx = /*Number(node.style.left.match(re)[0])*/node.offsetLeft + node.clientWidth / 2;
			yy = /*Number(node.style.top.match(re)[0]) +*/ node.offsetTop;
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
	const re = new RegExp('[-]?\\d+(?:\\.\\d+)?');
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
	if(this.candidate != void 0) this.candidate.style.border = 'solid 2px white';
	this.candidate = candidate;
};
Connection.prototype.decorateCandidateTop = function() {
	this.candidate.style.borderTop = 'solid 2px red';
};
Connection.prototype.decorateCandidateBottom = function() {
	this.candidate.style.borderBottom = 'solid 2px red';
};
Connection.prototype.sortZIndex = function(target) {
	/*targetを一番前に出す。そのほかの前後関係はそのまま*/
	const aa = [ ];
	let max = -100000;
	for(let node of this.parent.children) {
		if(node.style.zIndex > max) max = node.style.zIndex;
	}
	target.style.zIndex = max + 1;

};

