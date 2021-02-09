// 处理批量下载时，不同文件夹下会有相同文件，下载只下载一个的问题，有重复名称后边补充数字编号
export function finRepetionCode(array){
	//先判断是数组还是对象
	if( typeof array == "object"){
		var arr = array;
	}
	else if( typeof array == "string"){
		var arr = array.split(",")
	}
  //存放不相同的数据
  let obj = {}
	for (let i = 0; i < arr.length; i++) {
    let name = arr[i].split('=')[1]
    if(!obj[name]) {
      obj[name] = new Array();
    }
    if(obj[name].length === 0) {
      obj[name][0] = 0
    } else {
      obj[name][0] += 1;
      let namestrArr = name.split('.');
      let newStr = namestrArr[0] + `(${obj[name][0]}).` + namestrArr[1];
      arr[i] = arr[i].split('=')[0] + '=' + newStr;
    }
  }
	return arr
}

function findIndex(arr, item, box) {
  //存放不相同的数据
	let tempArr = []
	let thisItem;
	for (let i = 0; i < arr.length; i++) {
		thisItem = arr[i]
		//定义一个变量，检查是不是有重复的字符
		let flag = true;
		//遍历存放数据盒子，检查是否等于当前元素
		for (let j = 0; j < box.length; j++)
		{
			//如果值存在
			if(box[j]==thisItem){
				flag = false;
				break;//结束for循环
			}
		}
		if(flag==false){
			//如果等于false表示相等，那么到这里就停止不压入数组，continue返回执行函数而不压入数组
			continue ;
		}
		box.push(thisItem);
		
		//调用重复次数的函数
		let count = charNum(thisItem,arr)
		document.write("当前数字是："+thisItem+"重复出现的次数是"+count+"<br>")
	}
	return box
}