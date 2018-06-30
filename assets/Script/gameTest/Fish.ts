
	export class Fish {
		//唯一标识符
		public uniqId:Array<number> = null;
		//鱼类id
		public fishId:number = 0;
		//鱼类型
		public fishType:number = 1;
		//路径id
		public pathId:number = 0;
		//初始坐标
		public coord:cc.Vec2 = null;
		//剩余存活时间
		public aliveTime:number = 0;

		//加鱼时间
		public addFishDate:number = 0;;
		
		public constructor() {
		}
	}
