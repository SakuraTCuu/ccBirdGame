import BirdCtr from "./BirdCtr";
import Bullet from "./Bullet";
import Net from "./Net";
import { BirdInfo } from "./BirdConfig";
import VVMgr from "../core/VVMgr";
import { GameType, PropType, ChargeType, NotifyPath } from "../Const";
import Loading from "../Loading";
import GameNetCtr from "./GameNetCtr";
import GameUICtr from "./GameUICtr";
import { PropCardInfo, BirdAttackInfo, RobotAttackInfo } from "./GameModel";
import GamePTCtr from "./GamePTCtr";
import GameBirdCtr from "./GameBirdCtr";
import { GiftGoodInfo } from "../hall/HallModel";
import HintUI, { HintUIType } from "../HintUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.SpriteAtlas)
    gameAtlas: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    gaojiDiAltas: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    bgSprite: cc.Sprite = null;

    @property(cc.Node)
    gameNode: cc.Node = null;

    @property(cc.Sprite)
    propHintSprite: cc.Sprite = null;

    @property(cc.Node)
    maskNode: cc.Node = null;
    @property(cc.Node)
    joinHintNode: cc.Node = null;

    birdPool: cc.NodePool = new cc.NodePool(BirdCtr);
    @property(cc.Prefab)
    birdPrefab: cc.Prefab = null;

    birdNodeMap = {};
    birdInfoMap = {};

    hpPool: cc.NodePool = new cc.NodePool();
    @property(cc.Prefab)
    hpPrefab: cc.Prefab = null;

    bulletPool: cc.NodePool = new cc.NodePool(Bullet);
    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null;

    netPool: cc.NodePool = new cc.NodePool(Net);
    @property(cc.Prefab)
    netPrefab: cc.Prefab = null;

    aimPool: cc.NodePool = new cc.NodePool();
    @property(cc.Prefab)
    aimPrefab: cc.Prefab = null;

    @property(cc.Node)
    loadingNode: cc.Node = null;
    @property(cc.Node)
    hintUINode: cc.Node = null;
    
    touchPoint: cc.Vec2 = null;
    touchTime: number = 0;
    
    birdIDKey = "birdID";
    bLevelKey = "bLevel";
    nLevelKey = "nLevel";

    _usingXueLka = false;
    _usingBeiLka = false;

    _usingDuZKa = false;
    _duZCount = 0;
    _duZBirdNode: cc.Node = null;
    
    _usingAimKa = false;
    _aimBirdNode: cc.Node = null;
    _aimCount = 0;

    _cardToken = null;

    _giftMsgArr = new Array<GiftGoodInfo>();

    _doDieAnim = false;
    
    //  -------------------------------------- Init Method --------------------------------------

    private static _instance: Game = null;
    public static get instance(): Game {
        return Game._instance;
    }

    onLoad () {
        Game._instance = this;

        if (VVMgr.gameType == GameType.High) {
            // cc.log("VVMgr.gameType", VVMgr.gameType);
            this.bgSprite.spriteFrame = this.gaojiDiAltas.getSpriteFrame("gaojichang_di");
        }

        cc.director.setDisplayStats(true);
        cc.director.getCollisionManager().enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;
        cc.log("Game onLoad");

        //场景背景
        this.maskNode.active = true;
        this.joinHintNode.active = true;
        if (VVMgr.gameType == GameType.High) {
            this.joinHintNode.getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame("join_gaoji_word");
        } else {
            this.joinHintNode.getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame("join_chuji_word");
        }

        this.scheduleOnce(() => {
            this.maskNode.active = false;
            this.joinHintNode.active = false;
        }, 3);

        this.node.on(NotifyPath.SocketDisconnect, () => {
            this.socketDisconnect();
        });
        this.node.on(NotifyPath.ShareResult, (data) => {
            this.shareResult(data.detail);
        });
        this.node.on(NotifyPath.ChargeResult, (data) => {
            this.chargeResult(data.detail);
        });
    }

    start () {
        VVMgr.dataEventHandler = this.node;
    }
    
    onDestroy () {
        cc.director.setDisplayStats(false);
        cc.director.getCollisionManager().enabled = false;

        cc.info("Game onDestroy");

        VVMgr.dataEventHandler = null;
    }

    //  -------------------------------------- Main Method --------------------------------------

    canEnoughABullet() {
        const weaponInfo = GamePTCtr.instance.getWeaponInfo();
        const bulletNum = weaponInfo.base_bullet*weaponInfo.level;
        if (VVMgr.userInfo.gold < bulletNum && VVMgr.userInfo.silver < bulletNum) {
            this.toCharge(ChargeType.Bullet);
            return false;
        } 
        return true;
    }

    willShootABullet(birdTS: BirdCtr) {
        if (this._doDieAnim) return; //正在进行礼物动画

        if (!this.canEnoughABullet()) {
            birdTS.doResumeActions();
            return;
        }

        if (birdTS.canShotBird() == false) return;
        birdTS.willShotBird();

        const weaponNode = GamePTCtr.instance.getMyWeapon();
        const weaponLevel = GamePTCtr.instance.weaponLevel;
        this.refreshShootUI(weaponNode, weaponLevel, birdTS);
        
        this.refreshShootData(birdTS);
    }

    refreshShootUI(weaponNode: cc.Node, weaponLevel: number, birdTS: BirdCtr) {
        //触摸点
        this.touchPoint = birdTS.node.position;

        //旋转炮塔
        const degrees = this.calcWeaponDegrees(weaponNode);
        weaponNode.rotation = degrees;

        //射出子弹
        const bulletNode = this.getACaheBullet(); 
        bulletNode.getComponent(Bullet).shot(this, weaponLevel, degrees, weaponNode);
    }

    refreshShootData(birdTS: BirdCtr) {
        //发送子弹信息   
        const birdInfo = birdTS.birdInfo;
        const weaponInfo = GamePTCtr.instance.getWeaponInfo();
        cc.log(" -------- shootABullet  ");   
        if (this._usingDuZKa) {
            GameNetCtr.instance.sendShotMsg(birdInfo, weaponInfo, PropType.DuZKa, this._cardToken);
        } else if (this._usingBeiLka) {
            GameNetCtr.instance.sendShotMsg(birdInfo, weaponInfo, PropType.BeiLKa, this._cardToken);
        } else {
            GameNetCtr.instance.sendShotMsg(birdInfo, weaponInfo, null, null);
        }
        
        //刷新子弹数据
        const bulletNum = weaponInfo.base_bullet*weaponInfo.level;
        if (VVMgr.userInfo.gold >= bulletNum) {
            VVMgr.userInfo.gold -= bulletNum;
        } else {
            VVMgr.userInfo.silver = VVMgr.userInfo.silver - (bulletNum - VVMgr.userInfo.gold);
            VVMgr.userInfo.gold = 0;
        }
        GamePTCtr.instance.refreshBulletInfo();
    }

    calcWeaponDegrees(weaponNode: cc.Node) {
        // //角度
        const subVect = cc.pSub(this.touchPoint, weaponNode.position);
        // //炮台相关
        // //http://www.cnblogs.com/xiashengwang/p/3867224.html
        // const radians = cc.pToAngle(subVect);
        // let degress = cc.radiansToDegrees(radians)
        // degress = 90 - degress;
        // this.weaponNode.rotation = degress;
        
        // const radian = Math.atan(subVect.y / subVect.x);
        const radian = cc.pToAngle(subVect);
        let degrees = cc.radiansToDegrees(radian);
        degrees = 90 - degrees;
        return degrees;
    }
  
    robotAttackABird(callMsg) {
        const attackInfo = <RobotAttackInfo>callMsg;
        attackInfo.bird_id = callMsg.extra;
        cc.log("---robotAttackABird---", attackInfo.bird_id);
        if (attackInfo.bird_id == null) return;

        const birdNode = <cc.Node>this.birdNodeMap[attackInfo.bird_id];
        if (birdNode.active == false) return;
        const birdTS = birdNode.getComponent(BirdCtr);

        const weapon = <cc.Node>GamePTCtr.instance.getWhoWeapon(attackInfo.user_id);
        if (weapon) {
            cc.log("robotAttackABird --- 敌人发射一个子弹");
            if (birdTS.canShotBird() == false) return;
            birdTS.willShotBird();

            this.refreshShootUI(weapon, 1, birdTS);
        }
    }

    /**
     * 服务端攻击了哪只鸟
     * @param callMsg 
     */
    serverAttackAbird(callMsg) {
        const attackInfo = <BirdAttackInfo>callMsg;

        if (attackInfo.bird_id == null) return;
        const oldBirdInfo = <BirdInfo>this.birdInfoMap[attackInfo.bird_id];
        if (oldBirdInfo == null) return;

        const birdNode = <cc.Node>this.birdNodeMap[attackInfo.bird_id];
        if (birdNode.active == false) return;

        const birdTS = birdNode.getComponent(BirdCtr);
        birdTS.refreshBirdHP(attackInfo.bird_bold);

        //是否是附近炮台发射
        const userId = attackInfo.user_id;
        if (userId == VVMgr.userId) return; //暂时不更新炮弹数据

        const weapon = GamePTCtr.instance.getWhoWeapon(userId);
        if (weapon) {
            cc.log("敌人发射一个子弹");
            if (birdTS.canShotBird() == false) return;
            birdTS.willShotBird();

            const weaponLevel = callMsg.extra;
            GamePTCtr.instance.updateWhoWeapon(userId, weaponLevel);

            this.refreshShootUI(weapon, weaponLevel, birdTS);
        }
    }

    /**
     * 服务端补充了哪只鸟
     * @param callMsg 
     */
    async serverFillABird(callMsg) {
        const newBirdInfo = <BirdInfo>callMsg;

        // "data":{"bird_id":23,"name":"麻雀","speed":1,"direction":1,"size":2,"total_blood":100,"number":"b00235"}

        //更新Node
        const birdNode = <cc.Node>this.birdNodeMap[newBirdInfo.bird_id];
        const birdTS = birdNode.getComponent(BirdCtr);
        if (birdTS._isInscreen == false ) return;

        this._doDieAnim = true;

        //更新小鸟的状态
        const oldBirdInfo = birdTS.birdInfo;
        this.refreshBirdInfo(oldBirdInfo, newBirdInfo);

        if (this._usingDuZKa) {
            this.stopUseDuZKa(true);
        }
        if (this._usingAimKa) {
            this.stopUseAutoAim(true);
        }
        
        await birdTS.doDieBird();
        const giftMsg = this._giftMsgArr.shift();
        if (giftMsg && giftMsg.user_id == VVMgr.userId) {
            this.node.getComponent(GameUICtr).onScoreClick(giftMsg);
        }
        if (this._giftMsgArr.length < 1) {
            this._doDieAnim = false;
        }
    }

    refreshBirdInfo(oldBirdInfo: BirdInfo, newBirdInfo: BirdInfo) {
        // oldBirdInfo.name = newBirdInfo.name;
        // oldBirdInfo.speed = newBirdInfo.speed;
        // oldBirdInfo.direction = newBirdInfo.direction;
        // oldBirdInfo.size = newBirdInfo.size;
        oldBirdInfo.total_blood = newBirdInfo.total_blood;
        // oldBirdInfo.useAim = false;
        // oldBirdInfo.useDuZ = false;
        // oldBirdInfo.useXuL = false;
        // oldBirdInfo.birdState = BirdState.Alive;
    }

    /**
     * 服务端命中了哪只鸟
     * @param callMsg 
     */
    serverBingoABird(callMsg) {
        const giftMsg = <GiftGoodInfo>callMsg;
        this._giftMsgArr.push(giftMsg);
    }
    
    //  -------------------------------------- Prop Method --------------------------------------

    //需要充值
    toCharge(chargeType: ChargeType) {
        if (this._usingDuZKa) {
            this.stopUseDuZKa(true);
        }
        if (this._usingAimKa) {
            this.stopUseAutoAim(true);
        }
        this.node.getComponent(GameUICtr).onChargeClick(chargeType);
    }

    willUseBeiLka(cardInfo: PropCardInfo) {
        if (!this.canEnoughABullet()) return;

        if (this._usingBeiLka) {
            this.showHintUI(HintUIType.Failure,"正在使用倍率卡");
            cc.log("---正在使用倍率卡");
            return;
        }
        GameNetCtr.instance.sendWillUseCard(cardInfo.card_id, PropType.BeiLKa);
    }

    /**
     * 使用翻倍卡
     * @param cardToken 
     * @param expire 
     */
    onUseBeika(cardToken: string, expire: number) {
        this._usingBeiLka= true;
        this._cardToken = cardToken;

        this.propHintSprite.node.active = true;
        this.propHintSprite.spriteFrame = this.gameAtlas.getSpriteFrame("beika_on");

        this.scheduleOnce(() => {
            this.propHintSprite.spriteFrame = this.gameAtlas.getSpriteFrame("beika_off");
            this._usingBeiLka= false;
        }, expire);

        this.scheduleOnce(() => {
            this.propHintSprite.node.active = false;
        }, expire+1);
    }

    willUseXuLka(cardInfo: PropCardInfo) {
        if (!this.canEnoughABullet()) return;
        if (this._usingDuZKa) {
            this.showHintUI(HintUIType.Failure,"正在使用血量卡");
            cc.log("---正在使用血量卡");
            return;
        }
        GameNetCtr.instance.sendWillUseCard(cardInfo.card_id, PropType.XueLKa);
    }

    /**
     * 使用血量卡
     * @param birdIdArr 
     * @param cardToken 
     * @param expire 
     */
    onUseXueLka(birdIdArr: Array<any>, cardToken: string, expire: number) { 
        // {bird_id: 23, total_blood: 64}
        // {bird_id: 26, total_blood: 0}
        // {bird_id: 27, total_blood: 0}

        //给场景里的Bird加上血条
        birdIdArr.forEach(element => {
            const birdInfo = <BirdInfo>this.birdInfoMap[element['bird_id']];
            if (birdInfo == null) return;
            birdInfo.useXuL = true;

            const birdNode = <cc.Node>this.birdNodeMap[element['bird_id']];
            if (birdNode.active == false) return;

            birdNode.getComponent(BirdCtr).doShwoHPNode();
        });

        this._usingXueLka = true;
        this._cardToken = cardToken;

        this.propHintSprite.node.active = true;
        this.propHintSprite.spriteFrame = this.gameAtlas.getSpriteFrame("xueka_on");

        this.scheduleOnce(() => {
            this.propHintSprite.spriteFrame = this.gameAtlas.getSpriteFrame("xueka_off");
            this.stopUseXueLKa(false);
        }, expire);

        this.scheduleOnce(() => {
            this.propHintSprite.node.active = false;
        }, expire+1);
    }

    stopUseXueLKa(die: boolean) { 
        if (this._usingXueLka == false) return;

        if (die) this.propHintSprite.node.active = false;

        this._usingXueLka = false;
        for (const key in this.birdInfoMap) {
            const birdInfo = <BirdInfo>this.birdInfoMap[key];
            if (birdInfo.useXuL) {
                birdInfo.useXuL = false;
                const birdNode = this.birdNodeMap[key];
                if (birdNode.active == false) return;

                birdNode.getComponent(BirdCtr).doHideHPNode();
            }
        }
    }

    willUserDuZka(cardInfo: PropCardInfo) {
        if (!this.canEnoughABullet()) return;

        if (this._usingDuZKa) {
            this.showHintUI(HintUIType.Failure,"正在使用独占卡");
            cc.log("---正在使用独占卡");
            return;
        }
        const birdNode = this.findMinHPBird();
        if (birdNode == null) {
            this.showHintUI(HintUIType.Failure,"找到合适的小鸟");
            cc.log("---没有找到合适的Node");
            return;
        }
        const birdTS = birdNode.getComponent(BirdCtr);
        GameNetCtr.instance.sendWillUseCard(cardInfo.card_id, PropType.DuZKa, birdTS.birdInfo.bird_id);
    }

    /**
     * 使用独占卡
     * @param birdId 
     * @param cardToken 
     * @param expire 
     */
    onUseDuZka(birdId: string, cardToken: string, expire: number) { 
        //就是独占战友血量最少的鸟自动射击
        //寻找血量最少的鸟
        //开启自动发射
        const birdNode = <cc.Node>this.birdNodeMap[birdId];
        if (birdNode.active == false) {
            this.showHintUI(HintUIType.Failure,"找到合适的小鸟");
            cc.log("---独占Node不是激活状态");
            return;
        }

        this._duZBirdNode = birdNode;

        const birdTs = birdNode.getComponent(BirdCtr);
        birdTs.birdInfo.useDuZ = true;
        birdTs.doShwoAimNode();
        
        this._usingDuZKa = true;
        this._cardToken = cardToken;

        this.propHintSprite.node.active = true;
        this.propHintSprite.spriteFrame = this.gameAtlas.getSpriteFrame("zhanka_on");

        this.schedule(this.willDuZShootABullet, 1, expire); //自动瞄准发射20次
        this.scheduleOnce(() => {
            this.propHintSprite.spriteFrame = this.gameAtlas.getSpriteFrame("zhanka_off");
            this.stopUseDuZKa(false);
        }, expire);

        this.scheduleOnce(() => {
            this.propHintSprite.node.active = false;
        }, expire+1);
    }

    willDuZShootABullet() {
        this.willShootABullet(this._duZBirdNode.getComponent(BirdCtr));
    }

    stopUseDuZKa(die: boolean) {
        if (this._usingDuZKa == false) return;

        if (die) this.propHintSprite.node.active = false;

        this._usingDuZKa = false;
        this.unschedule(this.willDuZShootABullet);
        if (this._duZBirdNode) {
            const birdTs = this._duZBirdNode.getComponent(BirdCtr);
            birdTs.doHideAimNode();
            this._duZBirdNode = null;
        }
    }

    /**
     * 开启自动瞄准
     */
    onUseAutoAim() {
        if (!this.canEnoughABullet()) return;
        const birdNode = this.findRandomBird();
        if (birdNode == null) {
            this.showHintUI(HintUIType.Failure, "找到合适的小鸟");
            cc.log("---没有找到合适的Node");
            return;
        }
        this._aimBirdNode = birdNode;

        const birdTs = birdNode.getComponent(BirdCtr);
        birdTs.birdInfo.useAim = true;
        birdTs.doShwoAimNode();
        
        this._usingAimKa = true;

        this.propHintSprite.node.active = true;
        this.propHintSprite.spriteFrame = this.gameAtlas.getSpriteFrame("auto_on");

        this.schedule(this.willAimShootABullet, 0.5, 20); //自动瞄准发射20次
        this.scheduleOnce(() => {
            this.propHintSprite.spriteFrame = this.gameAtlas.getSpriteFrame("auto_off");
            this.stopUseAutoAim(false);
        }, 10);

        this.scheduleOnce(() => {
            this.propHintSprite.node.active = false;
        }, 10+1);
    }

    willAimShootABullet() {
        this.willShootABullet(this._aimBirdNode.getComponent(BirdCtr));
    }

    stopUseAutoAim(die: boolean) {
        if (this._usingAimKa == false) return;

        if (die) this.propHintSprite.node.active = false;

        this._usingAimKa = false;
        this.unschedule(this.willAimShootABullet);
        if (this._aimBirdNode) {
            const birdTs = this._aimBirdNode.getComponent(BirdCtr);
            birdTs.doHideAimNode();
            this._aimBirdNode = null;
        }
    }

    needStaticBird() {
        if (this._usingAimKa || this._usingDuZKa) return true;
        return false;
    }

    socketDisconnect() {
        this.node.getComponent(GameUICtr).onSocketFailure();
    }

    shareResult(ret: string) {
        const suc = parseInt(ret);
        if (suc == 1) {
            this.showHintUI(HintUIType.Success, "分享成功!!!");
        } else {
            this.showHintUI(HintUIType.Failure, "分享失败!!!");
        }
    }

    chargeResult(ret: number) {
        if (ret == -1) {
            this.showHintUI(HintUIType.Failure, "支付失败!!!");
        } else {
            this.showHintUI(HintUIType.Success, "支付成功!!!");
            GamePTCtr.instance.refreshBulletInfo();
        }
    }
    //  -------------------------------------- Tool Method --------------------------------------

    findRandomBird() {
        let birdNode: cc.Node = null;
        let tempNode: cc.Node = null;
        for (const key in this.birdNodeMap) {
            tempNode = this.birdNodeMap[key];
            const birdTS = tempNode.getComponent(BirdCtr);
            //在屏幕内 且可以被选中
            if (birdTS._isInscreen && birdTS.canBeSelectToAttack()) {
                birdNode = tempNode;
                break;
            };
        }
        return birdNode;
    }

    findMinHPBird() {
        let birdNode: cc.Node = null;
        let birdInfo: BirdInfo = null;
        let minHP = 100000;
        for (let key in this.birdNodeMap) {
            birdInfo = this.birdInfoMap[key];
            const tempNode = this.birdNodeMap[key];
            //在屏幕内 且血量最少
            if (tempNode.getComponent(BirdCtr)._isInscreen && birdInfo.total_blood < minHP) {
                minHP = birdInfo.total_blood;
                birdNode = tempNode;
            }
        }
        return birdNode;
    }

    getACacheBird() {
        const birdNode = this.birdPool.get();
        if (birdNode) {
            birdNode.getComponent(BirdCtr).decorateBird();
        }
        return birdNode;
    }

    getACacheHP() {
        let hpNode = this.hpPool.get();
        if (hpNode == null) {
            hpNode = cc.instantiate(this.hpPrefab);
        }
        hpNode.active = true;
        return hpNode;
    }

    getACacheAIM() {
        let aimNode = this.aimPool.get();
        if (aimNode == null) {
            aimNode = cc.instantiate(this.aimPrefab);
        }
        aimNode.active = true;
        return aimNode;
    }

    getACaheBullet() {
        let bulletNode = this.bulletPool.get();
        if (bulletNode == null) {
            bulletNode = cc.instantiate(this.bulletPrefab);
        }
        const weaponLevel = GamePTCtr.instance.weaponLevel;
        if (bulletNode[this.bLevelKey] == null || bulletNode[this.bLevelKey] != weaponLevel) {
            bulletNode[this.bLevelKey] = weaponLevel;
            bulletNode.getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame("bullet_" + weaponLevel);
        }
        bulletNode.active = true;
        return bulletNode;
    }

    getACaheNet() {
        let netNode = this.netPool.get();
        if (netNode == null) {
            netNode = cc.instantiate(this.netPrefab);
            netNode[this.nLevelKey] = this.nLevelKey;
        }
        netNode.active = true;
        return netNode;
    }

    putACacheBird(birdNode: cc.Node) {
        // cc.log("---putACacheBird");
        
        this.birdPool.put(birdNode);
        
        this.getACacheBird();
    }

    putACacheHP(hp: cc.Node) {
        this.hpPool.put(hp);
    }

    putACacheAIM(aim: cc.Node) { 
        this.aimPool.put(aim);
    }

    putACacheBullet(bullet: cc.Node) {
        this.bulletPool.put(bullet);
    }

    putACacheNet(net: cc.Node) {
        this.netPool.put(net);
    }

    //  -------------------------------------- Tool Method --------------------------------------

    showLoading() {
        const loadingJS = this.loadingNode.getComponent(Loading);
        if (loadingJS.isShowing()) return false;
        loadingJS.show();
        return true;
    }

    hideLoading() {
        const loadingJS = this.loadingNode.getComponent(Loading);
        loadingJS.hide();
    }

    showHintUI(hintUIType: HintUIType, msg?: string) {
        const failureJS = this.hintUINode.getComponent(HintUI);
        if (failureJS.isShowing()) return false;
        failureJS.show(hintUIType, msg);
        return true;
    }

    //  -------------------------------------- Tool Method --------------------------------------

    randomGameNodeX() {
        const x = (Math.random() - 0.5) * this.gameNode.width;
        return Math.floor(x);
    }

    randomGameNodeY() {
        //-0.5 - 0.5
        let y = (Math.random() - 0.5) * this.gameNode.height;
        if (y < 0) y += 300;
        return Math.floor(y);
    }

    getBirdNodeSprite(birdId: string) {
        const birdInfo = <BirdInfo>this.birdInfoMap[birdId];
        const spName = birdInfo.id + "-0";
        return GameBirdCtr.instance.birdAltas.getSpriteFrame(spName);
    }
}
