import flash.net.URLLoader;
import flash.net.URLRequest;

var triList:Array;

var txtLoader:URLLoader = new URLLoader();
txtLoader.addEventListener(Event.COMPLETE, onTxtLoaded);
txtLoader.load(new URLRequest("triangle.txt"));

function onTxtLoaded(e:Event):void {
	triList = parseTri(e.target.data);
	var maxSum:Number = findSum(triList, 0, 0, 0);
	trace("maxSum = " + maxSum);
}

function parseTri(str:String):Array {
	var list:Array = new Array();
	var strRows:Array = str.split("\n");
	for(var i:int = 0; i < strRows.length; i++){
		var strCol:Array = String(strRows[i]).split(" ");
		list.push(strCol);
	}
	return list;
}

function findSum(list:Array, row:Number, col:Number, sum:Number):Number {
	sum += int(list[row][col]);
	if(row+1 < list.length){
		var nextCol:Number = int(list[row+1][col])>int(list[row+1][col+1])?col:col+1;
		return findSum(list, row+1, nextCol, sum);
	} else {
		return sum;
	}
}