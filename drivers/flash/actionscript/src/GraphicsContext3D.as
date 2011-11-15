package {

	import flash.display.Sprite;
	import flash.display3D.Program3D;

	import flash.display.Stage;
	import flash.display.Stage3D;
	import flash.display.StageScaleMode;

	import flash.display3D.Context3D;
	import flash.display3D.Context3DRenderMode;
	import flash.display3D.Context3DClearMask;

	import flash.events.Event;
	import flash.external.*;
	import flash.system.Capabilities;
	import flash.system.Security;

	public class GraphicsContext3D extends Sprite {

		private var _stage:Stage;
		private var stage3D:Stage3D;
		private var _context3D:Context3D;
		private var programs:Array;
		
		public function GraphicsContext3D() {

			Security.allowDomain("cimaron.vm");
			
			_stage = stage;
			stage.scaleMode = StageScaleMode.EXACT_FIT;
			stage3D = stage.stage3Ds[0];
			stage3D.addEventListener(Event.CONTEXT3D_CREATE, onReady);
			//addEventListener(Event.ENTER_FRAME, renderFrame);
			stage3D.requestContext3D();

			ExternalInterface.addCallback("constants", constants);
			ExternalInterface.addCallback("execCommands", execCommands);
			ExternalInterface.addCallback("test", test);
			ExternalInterface.addCallback("getFlashVersion", getFlashVersion);			
			ExternalInterface.addCallback("render", render);			
		}

		private function onReady(e:Event):void {
			_context3D = stage3D.context3D;
			_context3D.enableErrorChecking = true;
			_context3D.configureBackBuffer(stage.stageWidth, stage.stageHeight, 0, true);
			_context3D.clear(0, 0, 0, 1);
		}

		private function renderFrame(e:Event):void {
			_context3D.present();
		}

		private function render():void {
			_context3D.present();			
		}
		
		private function constants():Object {
			var c:Object = new Object;
			c.clearMask = new Object;
			c.clearMask.ALL = Context3DClearMask.ALL;
			c.clearMask.COLOR = Context3DClearMask.COLOR;
			c.clearMask.DEPTH = Context3DClearMask.DEPTH;
			c.clearMask.STENCIL = Context3DClearMask.STENCIL;
			return c;
		}
		
		private function execCommands(list:Array):Object {
			var i:int, cmd:String, args:Array, result:String;
			for (i = 0; i < list.length; i++) {
				args = list[i];
				cmd = args.shift();
				try {
					result = execCommand(cmd, args);
				} catch (e:Error) {
					return {status:0,result:e.getStackTrace()};
				}
			}
			return {status:1,result:result};
		}

		private function execCommand(cmd:String, args:Array):String {
			switch (cmd) {
				case 'clear':
					clear.apply(this, args);
					return '1';
					break;
				case 'createProgram':
					return createProgram();
					break;
			}
			return '';
		}

		private function clear(r:Number, g:Number, b:Number, a:Number, d:Number, s:Number, m:Number):void {
			_context3D.clear(r, g, b, a, d, s, m);
		}

		private function createProgram():String {
			var prgm:Program3D;
			prgm = _context3D.createProgram();
			programs.push(prgm);
			return (programs.length - 1).toString();
		}

		private function test():Boolean {
			return true;
		}

		private function getFlashVersion():String {
			return Capabilities.version;
		}
		

	}
}
