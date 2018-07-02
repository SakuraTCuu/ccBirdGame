import { Roomer } from "./Roomer";
import { Fish } from "../Fish";

export class RoomModel {

	//房间内玩家列表
	private _roomerList: Array<Roomer>;
	//房间内存活的鱼的列表
	private _fishList: Array<Fish>;

	//快速赛 当前人数
	private _kssCurNum: number = -1;
	//快速赛 剩余时间
	private _kssEndSec: number = -1;

	public constructor() {
		
	}

	public init(): void {
		this._roomerList = new Array<Roomer>();
		this._fishList = new Array<Fish>();
	}

	//向房间添加玩家
	public addRoomer(roomer: Roomer): void {
		if (this._roomerList.length < 4) {
			this._roomerList.push(roomer);
		} else {
			console.error("房间人数已满!");
		}
	}

	//将玩家移除房间
	public removeRoomer(roomer: Roomer): void {
		for (var i = 0; i < this._roomerList.length; i++) {
			if (this._roomerList[i].getUserId() == roomer.getUserId()) {
				this._roomerList.splice(i, 1);
				break;
			}
		}
	}

	//根据userId获取roomer对象
	public getRoomerById(uid: number): Roomer {
		var len = this._roomerList.length;
		for (var i = 0; i < len; i++) {
			if (this._roomerList[i].getUserId() == uid) {
				return this._roomerList[i];
			}
		}
		return null;
	}

	//根据位置。获取roomer对象
	public getRoomerByPos(pos: number): Roomer {
		var len = this._roomerList.length;
		for (var i = 0; i < len; i++) {
			if (this._roomerList[i].getRoomPos() == pos) {
				return this._roomerList[i];
			}
		}
		return null;
	}

	//获取房间内的玩家
	public getRoomerList(): Array<Roomer> {
		return this._roomerList;
	}

	//初始化房间中已存在的鱼
	public addRoomLiveFish(fish: Fish): void {
		this._fishList.push(fish);
	}

	//判断房间内已有的鱼是否有重复路径
	public isPathExist(pathId: number): boolean {
		for (var i = 0; i < this._fishList.length; i++) {
			var fish: Fish = this._fishList[i];
			if (fish.pathId == pathId) {
				return true;
			}
		}
		return false;
	}

	//获取房间内已存在的鱼
	public getFishList(): Array<Fish> {
		return this._fishList;
	}

	// //塞入凤凰的对象
	// public setPhoenix(obj: PhoenixObj): void {
	// 	this._phoenixObj = obj;
	// }

	// //获取凤凰对象
	// public getPhoenix(): PhoenixObj {
	// 	return this._phoenixObj;
	// }

	//清空房间数据
	public clearRoom(): void {
		this._roomerList = new Array<Roomer>();
		this._fishList = new Array<Fish>();
		// this._phoenixObj = null;
	}

	public getKssCurNum() {
		return this._kssCurNum;
	}

	public setKssCurNum(curNum: number) {
		this._kssCurNum = curNum;
	}

	public getKssEndSec() {
		return this._kssEndSec;
	}

	public setKssEndSec(endSec: number) {
		this._kssEndSec = endSec;
	}

	public clear(): void {

	}

	public destroy(): void {
		this._roomerList = null;
		this._fishList = null;
	}
}