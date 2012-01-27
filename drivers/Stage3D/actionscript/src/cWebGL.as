package {

	import flash.display.Sprite;
	import flash.display3D.Program3D;
	import flash.utils.ByteArray;

	import flash.display.Stage;
	import flash.display.Stage3D;
	import flash.display.StageScaleMode;

	import com.adobe.utils.AGALMiniAssembler;

	import flash.display3D.Context3D;
	import flash.display3D.Context3DClearMask;
	import flash.display3D.Context3DCompareMode;
	import flash.display3D.Context3DProgramType;
	import flash.display3D.Context3DRenderMode;
	import flash.display3D.Context3DTriangleFace;
	import flash.display3D.Context3DVertexBufferFormat;
	import flash.display3D.IndexBuffer3D;
	import flash.display3D.VertexBuffer3D;

	import flash.events.Event;
	import flash.external.*;
	import flash.system.Capabilities;
	import flash.system.Security;

	public class cWebGL extends Sprite {

		private var _stage:Stage;
		private var stage3D:Stage3D;
		private var _context3D:Context3D;
		private var programs:Array = new Array();

        private var vertexAssembly:AGALMiniAssembler = new AGALMiniAssembler();
        private var fragmentAssembly:AGALMiniAssembler = new AGALMiniAssembler();

		public function cWebGL() {

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
			_context3D.clear(0, 0, 0, 1, 0, 0, Context3DClearMask.ALL);
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
			
			c.compareMode = new Object;
			c.compareMode.ALWAYS = Context3DCompareMode.ALWAYS;
			c.compareMode.EQUAL = Context3DCompareMode.EQUAL;
			c.compareMode.GREATER = Context3DCompareMode.GREATER;
			c.compareMode.GREATER_EQUAL = Context3DCompareMode.GREATER_EQUAL;
			c.compareMode.LESS = Context3DCompareMode.LESS;
			c.compareMode.LESS_EQUAL = Context3DCompareMode.LESS_EQUAL;
			c.compareMode.NEVER = Context3DCompareMode.NEVER;
			c.compareMode.NOT_EQUAL = Context3DCompareMode.NOT_EQUAL;
			
			c.programType = new Object;
			c.programType.FRAGMENT = Context3DProgramType.FRAGMENT;
			c.programType.VERTEX = Context3DProgramType.VERTEX;

			c.triangleFace = new Object;
			c.triangleFace.BACK = Context3DTriangleFace.BACK;
			c.triangleFace.FRONT = Context3DTriangleFace.FRONT;
			c.triangleFace.FRONT_AND_BACK = Context3DTriangleFace.FRONT_AND_BACK;
			c.triangleFace.NONE = Context3DTriangleFace.NONE;

			c.vertexBufferFormat = new Object;
			c.vertexBufferFormat.BYTES_4 = Context3DVertexBufferFormat.BYTES_4;
			c.vertexBufferFormat.FLOAT_1 = Context3DVertexBufferFormat.FLOAT_1;
			c.vertexBufferFormat.FLOAT_2 = Context3DVertexBufferFormat.FLOAT_2;
			c.vertexBufferFormat.FLOAT_3 = Context3DVertexBufferFormat.FLOAT_3;
			c.vertexBufferFormat.FLOAT_4 = Context3DVertexBufferFormat.FLOAT_4;

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
					return {
						cmd : cmd,
						status : 0,
						result : e.message,
						stack : e.getStackTrace(),
						name : e.name
					};
				}
			}
			return {status:1,result:result};
		}

		private function execCommand(cmd:String, args:Array):* {
			switch (cmd) {
				case 'configureBackBuffer':
					configureBackBuffer.apply(this, args);
					break;
				case 'clear':
					clear.apply(this, args);
					return '1';
					break;
				case 'createProgram':
					return createProgram();
					break;
				case 'drawTriangles':
					drawTriangles.apply(this, args);
					break;
				case 'present':
					render();
					break;
				case 'setCulling':
					setCulling.apply(this, args);
					break;
				case 'setDepthTest':
					setDepthTest.apply(this, args);
					break;
				case 'setProgramConstantsFromVector':
					setProgramConstantsFromVector.apply(this, args);
					break;
				case 'upload':
					upload.apply(this, args);
					break;
				case 'setVertexData':
					setVertexData.apply(this, args);
					break;
				default:
					throw new Error(cmd + " not implemented");
			}
			return '';
		}
		
		private function clear(r:Number, g:Number, b:Number, a:Number, d:Number, s:Number, m:Number):void {
			_context3D.clear(r, g, b, a, d, s, m);
		}
		
		private function configureBackBuffer(width:int, height:int, antiAlias:int, enableDepthAndStencil:Boolean):void {
			_context3D.configureBackBuffer(width, height, antiAlias, enableDepthAndStencil);
		}

		private function createProgram():Number {
			var prgm:Program3D;
			prgm = _context3D.createProgram();
			programs.push(prgm);
			return (programs.length - 1);
		}

		private function setCulling(triangleFaceToCull:String):void {
			_context3D.setCulling(triangleFaceToCull);
		}

		private function drawTriangles(indices:Array, start:uint, count:uint):void {
		    var indexList:IndexBuffer3D;
			_context3D.clear(0, 0, 0, 1, 1, 0, Context3DClearMask.ALL);
			//Create vertex index list for the triangles
            var triangles:Vector.<uint> = Vector.<uint>(indices);
            indexList = _context3D.createIndexBuffer(triangles.length);
            indexList.uploadFromVector(triangles, 0, triangles.length);
            _context3D.drawTriangles(indexList, start, count); //Top triangle draws all colors, so is white
		}

		private function setDepthTest(mask:Boolean, mode:String):void {
			_context3D.setDepthTest(mask, mode);
		}

		private function setProgramConstantsFromVector(programType:String, firstRegister:int, numRegisters:int, data:Array, byteArrayOffset:uint):void {
			var vecData:Vector.<Number> = Vector.<Number>(data);
			_context3D.setProgramConstantsFromVector(programType, firstRegister, vecData, numRegisters);
		}

		private function setVertexData(index:uint, data:Array, dataPerVertex:uint, format:String):void {
			var vertexes:VertexBuffer3D;

			//Create vertexes
            var vertexData:Vector.<Number> = Vector.<Number>(data);
            vertexes = _context3D.createVertexBuffer(vertexData.length / dataPerVertex, dataPerVertex);
            vertexes.uploadFromVector(vertexData, 0, vertexData.length / dataPerVertex);

            //Identify vertex data inputs for vertex program
            _context3D.setVertexBufferAt(index, vertexes, 0, format);
		}

		private function test():Boolean {
			return true;
		}

		private function upload(prgm:Number, vertex:String, fragment:String):void {
			var programPair:Program3D = programs[int(prgm)];
   			vertexAssembly.assemble(Context3DProgramType.VERTEX, vertex, false);
            fragmentAssembly.assemble(Context3DProgramType.FRAGMENT, fragment, false);
            programPair.upload(vertexAssembly.agalcode, fragmentAssembly.agalcode);
            _context3D.setProgram(programPair);
		}
		
		private function getFlashVersion():String {
			return Capabilities.version;
		}
		

	}
}
