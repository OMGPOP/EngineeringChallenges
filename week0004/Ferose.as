package
{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	
	public class Ferose extends Sprite
	{
		public function Ferose()
		{
			// Text input
			var inputLoader:URLLoader = new URLLoader();
			inputLoader.addEventListener(Event.COMPLETE, onLoaded);
			inputLoader.load(new URLRequest("input.txt"));
		}
		
		private function onLoaded(e:Event) : void 
		{
			// Get each lines
			var lines:Array = e.target.data.split(/\n/);
			
			// Find solution
			for (var i:int = 1; i < lines.length; i++) {
				trace(findNumDoubleSquares(int(lines[i])));
			}
		}
		
		private function findNumDoubleSquares(x:int) : int
		{
			var numDoubleSquares:int = 0;
			var max:int = Math.ceil(Math.sqrt(x));
			for (var i:int = 0; i <= max; i++) {
				for (var j:int = 0; j <= i; j++) {
					if (i*i + j*j == x) {
						numDoubleSquares++;
					}
				}
			}
			return numDoubleSquares;
		}
	}
}