function shuffle(parent) {

	let count = 0;
	let newNode,referenceNode;
	const len = parent.children.length;
	if(len > 1) {
		const hoge = setInterval(()=>{
			if(++count > len*4) clearInterval(hoge);
			referenceNode = parent.children[0];
			nn = Math.abs(Math.round(Math.random() * parent.children.length - 0.5));
			console.log(nn);
			newNode = parent.children[nn];
			parent.insertBefore(newNode,referenceNode);
		},10);
	}

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
