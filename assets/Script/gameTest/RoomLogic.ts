import GameTest from "./GameTest";
import VVMgr from "../core/VVMgr";
import { NetPool } from "./bullet/NetPool";
import { BulletPool } from "./bullet/BulletPool";
import { BirdPool } from "./BirdPool";
import { Fish } from "./Fish";

export default class RoomLogic {
    private countDown: number;
    private warDisPlay: cc.Node;
    private warId: number;

    //userId
    private _userId: number;

    private _loaderOver: boolean = false;
    //是否是在使用带头过程中
    private _isInWarhead: boolean = false;
    //当前背景音乐名字
    private _bgMusicName: string;

    //正在分身的roomPos
    private _arrCloneId: Array<number>;

    /** 是否打开过玩吧UI */
    private static _isOpenWanbaUI: boolean = false;
    /** 假广播timer */
    // private _timerBroad:egret.Timer;

    private _view: GameTest;

    /**
     * 加鱼标识
     * 为true时加鱼
     */
    private addFishFlg = false;

    public constructor(roomView: GameTest) {
        this._view = roomView;
        this._arrCloneId = new Array<number>();
    }

    /**
   * 房间逻辑信息初始化
   */
    public init(): void {

    }

    viewLoadOk() {
        let roomType = 1;
        //播放背景音乐
        this._view.playBGMusic(roomType);

        //开启碰撞系统
        // let manager = cc.director.getCollisionManager();
        // manager.enabled = true;
        // if (APP.DEBUG) {
        //     manager.enabledDebugDraw = true;  //绘制碰撞框
        // }

        // this._view.scheduleOnce(function () {
        this.initInRoomInfo();
        // this._view.startRoom();

        //添加断线重连监听
        // GlobalManager.getInstance().addReconnectListener();
        // }, 0);
        
        // this.initDjs();
    }

    //初始化房间内已经有的鱼和玩家
    private initInRoomInfo(): void {
        let view = this._view;
        let isFlip: boolean = false;
        let myPos: number = 0;
        //初始化房间内玩家
        // let roomerList = this._roomModel.getRoomerList();
        let roomerList = VVMgr.otherUserInfoArr;
        for (let i = 0; i < roomerList.length; i++) {
            // if (roomerList[i].user_id == this._userId) {
            //     myPos = roomerList[i].getRoomPos();
            //     if (myPos > 1) {
            //         isFlip = true;
            //         break;
            //     }
            // }
        }
        //设置房间玩家数据
        view.resetView(isFlip, roomerList, myPos);

        //初始化对象池
        //初始化渔网对象池 和 子弹对象池
        let netIdArr = [0, 0, 0, 0];
        let resBulletIdArr = [0, 0, 0, 0];
        for (let i = 0; i < roomerList.length; i++) {
            // netIdArr[i] = curSkin.net;
            // resBulletIdArr[i] = curSkin.bulletId;
            // resBulletIdArr.push(curSkin.rageBulletId);
        }
        // NetPool.getNetPool().init(netIdArr); //初始化渔网对象池

        BulletPool.getBulletPool().init(resBulletIdArr); // 初始化子弹对象池
        BirdPool.getFIshPool().init();

        //初始化鱼
        // let fishList = this._roomModel.getFishList(); //Array<Fish>
        let fishList = new Array<Fish>();
        let currentTime = new Date().getTime();
        for (let i = 0; i < fishList.length; i++) {
            let fish = fishList[i];
            let aliveTime = fish.aliveTime;
            aliveTime = aliveTime - (currentTime - fish.addFishDate);
            this._view.getFishLayer().addUnitFish(fish.fishType, fish.uniqId, fish.fishId, fish.pathId, fish.coord.x, fish.coord.y, aliveTime);
            fishList[i] = null;
        }

        this.addFishFlg = true;


        // cc.game.on(cc.game.EVENT_HIDE, this.gameHide, this);
        // cc.game.on(cc.game.EVENT_SHOW, this.gameShow, this);

        // this.checkGunUpdate(null, this);

        // let curId = this._userModel.getGuideID();
        // if (curId == 0) {
        //     GuideManager.checkGuide(GuideTrriger.GunSend);
        // }
    }
}
