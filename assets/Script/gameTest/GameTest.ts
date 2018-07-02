import RoomLogic from "./RoomLogic";
import VVMgr from "../core/VVMgr";
import SoundManager from "./SoundManager";
import BulletLayer from "./BulletLayer";
import { BulletBase } from "./bullet/bulletBase";
import { FishUtil } from "./bullet/FishUtil";
import BirdLayer from "./BirdLayer";
import { Roomer } from "./room/Roomer";
import RoomUI from "./room/RoomUi";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameTest extends cc.Component {


    @property({
        type: cc.Component,
        displayName: "Room UI"
    })
    roomUI: RoomUI = null;

    @property({
        type: cc.Component,
        displayName: "BulletLayer"
    })
    bulletLayer: BulletLayer = null;

    @property({
        type: cc.Component,
        displayName: "BirdLayer"
    })
    birdLayer: BirdLayer = null;


    private _userId: number;

    //是否反转场景
    private _isFlip: boolean;
    //我在房间里的位置
    private _myPositon: number;
    //屏幕适配的偏移量
    private _offsetWidth: number = 0;

    //当前子弹集合
    private _arrBullet: Array<BulletBase>;

    //当前炮台倍率
    // private _gunRate:number;
    //上一次开炮时间
    private _preGunTime: number = 0;
    //帧时间
    private _timeOnEnterFrame: number = 0;
    //当前开炮方向坐标点
    private _gunToPos: cc.Vec2;

    /*********************各种状态***********************/
    private _isInFire: boolean;		//是否在开炮状态
    //自动开炮标志
    private _autoFire: boolean;
    //锁定功能改
    // private _arrLockedObj: Array<LockedObj> = null;

    //分身更换锁定鱼的枪口索引
    private _nAvaGunIndex: number = 0;

    private _isLocked: boolean;
    private _isRage: boolean;		//是否是狂暴状态
    private _isClone: boolean;		//是否是分身状态
    private _inHandWarHeadFish: number = -1;	//使用弹头时手选的奖金鱼
    private _selectFishState: boolean;	//是否是选择鱼的状态
    private _isBgInit: boolean = false;
    /*********************各种状态***********************/

    /** 自己有几个炮 */
    private _nGunNum: number;
    /** 自己子弹id */
    private _bulletId: number;
    /** 子弹最大数目 */
    private BULLET_MAX_COUNT: number;

    //逻辑处理
    private _roomLogic: RoomLogic;
    //roomIconUi
    // private roomIconUI: RoomIconUI;

    onLoad() {
        // init logic
        this.init();

        this.initView();

        //资源初始化完成
        this._roomLogic.init();

    }

    start() {

        this._roomLogic.viewLoadOk();

    }

    private init(): void {

        this._roomLogic = new RoomLogic(this);

        // this.initFishList();
        this.initBulletList();
        this._gunToPos = new cc.Vec2();
        this._myPositon = 0;
        this._isInFire = false;
        this._autoFire = false;
        this._selectFishState = false;
        this._nGunNum = 2;
        this._bulletId = 0;
        //子弹最大数量设为20
        this.BULLET_MAX_COUNT = 20;

        //房间内ui控制
        // this.roomIconUI = this.roomUI.node.getComponent(RoomIconUI);

        // this._userId = VVMgr.userInfo.user_id;

    }

    private initView(): void {
        //根据房间类型动态修改背景图片
        //高倍场 低倍场
        // let bgUrl = "bg/background_" + this._userModel.getMatchRoomLevel();
        // this.bgLayer.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes(bgUrl, cc.SpriteFrame);

    }

    //初始化子弹列表
    public initBulletList(): void {
        // this._arrBullet = new Array<BulletBase>();
        this._arrBullet = this.getBulletLayer().getBulletList();
    }

    //播放背景音乐
    public playBGMusic(roomType: number): void {
        let bgMusicName = "sound/" + FishUtil.getMusicByRoomType(roomType);
        cc.loader.loadRes(bgMusicName, () => {
            SoundManager.playBGM(bgMusicName + ".mp3");
        });
    }

    //设置对象池
    public setObjPool(): void {
        // FishingObjPool.getInstance().reset();
    }

    //获取子弹层
    public getBulletLayer(): BulletLayer {
        return this.bulletLayer;
    }

    public getFishLayer(): BirdLayer {
		return this.birdLayer;
	}


    //根据服务器信息设置UI数据
    public resetView(isFlip: boolean, roomerList:any, myPos: number): void {
        this._isFlip = isFlip;
        this._myPositon = myPos;
    
        //设置炮台显示
        for (let i = 0; i < roomerList.length; i++) {
            let roomer = roomerList[i];
            // if (this._isFlip) {
            //     this.roomUI.setGunVisableByPos(RoomUtil.getPosByFlip(roomer.getRoomPos(), this._isFlip), true);
            // } else {
            this.roomUI.setGunVisableByPos(roomer.getRoomPos(), true);
            // }
        }
    }
}
