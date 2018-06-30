
	/**
	 * 由点构成的路径单位
	 */
	export class PathPoint {
		
		public x:number;	//路径相对x坐标
		public y:number;	//路径相对y坐标
		public r:number;	//旋转角度
		public t:number;	//路程时间
		public e:number;	//路径事件

		public constructor(x:number, y:number, r:number, t:number, e:number) {
			this.x = x;
			this.y = y;
			this.r = r;
			this.t = t;
			this.e = e;
		}
	}