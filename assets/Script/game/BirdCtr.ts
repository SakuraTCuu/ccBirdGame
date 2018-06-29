import Game from "./Game";
import { BirdState, BirdInfo } from "./BirdConfig";
import Bullet from "./Bullet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BirdCtr extends cc.Component {

    birdInfo: BirdInfo;

    private _contentNode: cc.Node = null;
    private _contentAnim: cc.Animation;
    private _goldNode: cc.Node = null;
    private _goldAnim: cc.Animation;

    // private _animingShot = false;
    // private _animingDie = false;

    _canBeHit = false;

    _lastPos: cc.Vec2 = null;
    _isInscreen = false;

    _minX = -1;
    _maxX = -1;

    _isPausing = false;

    private hpNode: cc.Node;
    private hpNodeProBar: cc.ProgressBar;

    private aimNode: cc.Node;

    onLoad() {
        this._contentNode = this.node.getChildByName('Content');
        this._contentAnim = this._contentNode.getComponent(cc.Animation);
        this._contentAnim.on("finished", this.onBirdAnimFinished, this);
        
        this._goldNode = this.node.getChildByName('Gold');
        this._goldAnim = this._goldNode.getComponent(cc.Animation);
        this._goldAnim.on("finished", this.onGoldAnimFinshed, this);
    }

    /**
     * 播放小鸟动画
     */
    playBirdAnim() {
        cc.log("playBirdAnim ---" + this.birdInfo.birdState);
        // cc.log("playBirdAnim --- " + this._animingDie + "---" + this._animingShot);
        if (this.birdInfo.birdState == BirdState.Die) {
            // if (this._animingDie) return;
            // this._animingDie = true;
            this._contentAnim.stop();
            this._contentAnim.play("BirdAnim_Die");
        } else {
            // if (this._animingShot) return;
            // this._animingShot = true;
            this._contentAnim.stop();
            this._contentAnim.play("BirdAnim_Shot");
        }
    }

    /**
     * 小鸟动画完成
     */
    onBirdAnimFinished() {
        cc.log("------onBirdAnimFinished ");
        if (this.birdInfo.birdState == BirdState.Die) {
            // if (this._animingDie == false) return;
            // this._animingDie = false;

            this.playGoldAnim();
        } else {
            // if (this._animingShot == false) return;
            // this._animingShot = false;
            
            this.doResumeActions();
        }
    }

    /**
     * 播放金币动画
     */
    playGoldAnim() {
        this.node.opacity = 255;
        this._contentNode.active = false;
        this._goldNode.active = true;

        this._goldAnim.play();
    }

    /**
     * 金币动画完成
     */
    onGoldAnimFinshed() {
        cc.log("------onGoldAnimFinshed")
        this._contentNode.active = true;
        this._goldNode.active = false;

        this.onBirdMoveFinished();
        
        if (this._doDieResolve) {
            this._doDieResolve();
            this._doDieResolve = null;
        }
    }

    update (dt) {
        const currentPos = this.node.getPosition();
        // 如果位移不超过1，不改变角度
        if (cc.pDistance(this._lastPos, currentPos) < 1) return;

        // 计算角度
        let degree;
        if (currentPos.x - this._lastPos.x == 0) {// 垂直
            if (currentPos.y - this._lastPos.y > 0) {
                degree = -90;
            } else {
                degree = 90;
            }
        } else {
            degree = - Math.atan((currentPos.y - this._lastPos.y) / (currentPos.x - this._lastPos.x)) * 180 / 3.14;
        }
        this.node.rotation = degree;
        this._lastPos = currentPos;

        if (currentPos.x < this._minX || currentPos.x > this._maxX) {
            this._isInscreen = false;
        } else {
            this._isInscreen = true;
        }
    }

    /**
     * 修饰小鸟
     * @param gameJS
     * @param birdInfo 
     */
    decorateBird() {
        // cc.log("---decorateBird");
        const gameJS = Game.instance;
        this.node.parent = gameJS.gameNode;
        
        this.enabled = true;
        // this.node.active = true;

        let x = -(gameJS.node.width * 0.5 + 250); 
        if (this.birdInfo.direction == 1) {
            x = -x;
        }
        const fromPos = new cc.Vec2(x, gameJS.randomGameNodeY());
        this.node.position = fromPos;

        const toPos = new cc.Vec2(-fromPos.x, gameJS.randomGameNodeY());
        const midPos = new cc.Vec2(gameJS.randomGameNodeX(), gameJS.randomGameNodeY());
        const bezierTo = cc.bezierTo(cc.random0To1() * 5 + 5, [fromPos, midPos, toPos]);
        const seq = cc.sequence(bezierTo, cc.callFunc(this.onBirdMoveFinished, this));
        this.node.runAction(seq);

        //播放动画
        this._contentNode.opacity = 255;
        this._contentAnim.play(this.birdInfo.bird_id);

        this._lastPos = fromPos;
        this._isInscreen = true;

        this._maxX = gameJS.gameNode.width * 0.5;
        this._minX = -this._maxX;
        this._isPausing = false;

        if (this.birdInfo.useXuL) { //使用血量卡 显示
            this.doShwoHPNode(); 
        }

        this.node.opacity = 255;
        if (this.birdInfo.birdState == BirdState.WillDie) {
            this.node.opacity = 160;
        } else if (this.birdInfo.birdState == BirdState.Die) {
            this.birdInfo.birdState = BirdState.Alive;
        }
    }

    /**
     * 小鸟移动完成
     */
    onBirdMoveFinished() {
        cc.log("---onBirdMoveFinished");

        this.node.stopAllActions();

        this._lastPos = null;
        this._isInscreen = false;

        this.enabled = false;
        // this.node.active = false;
        // this.node.x = Game.instance.gameNode.width;

        if (this.birdInfo.useXuL) { //使用血量卡 隐藏
            this.doHideHPNode();
        }
        if (this.birdInfo.useAim) { //使用瞄准卡 隐藏
            this.doHideAimNode();
        }

        Game.instance.putACacheBird(this.node);
    }

    /**
     * 小鸟被点击 
     */
    onBirdClick() {
        Game.instance.willShootABullet(this);
    }

    /**
     * 小鸟可以被射击
     */
    canShotBird() {
        if (this.birdInfo.birdState == BirdState.Die) return false;
        return true;
    }

    /**
     * 将要射击小鸟
     */
    willShotBird() {
        this.doPauseActions();
        this._canBeHit = true;
    }

    /**
     * 暂停小鸟动作
     */
    doPauseActions() {
        if (this._isPausing) return;
        this._isPausing = true;
        this.node.pauseAllActions();
        cc.warn("---doPauseActions---", this.birdInfo.bird_id);
    }

    /**
     * 继续小鸟动作
     */
    doResumeActions() {
        if (this._isPausing == false) return;
        if (Game.instance.needStaticBird()) {

        } else {
            cc.warn("---doResumeActions---", this.birdInfo.bird_id);
            this.node.resumeAllActions();
        }
    }

    /**
     * 小鸟被射击
     * @param other 
     * @param self 
     */
    onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
        if (!this.canBeAttack()) return;

        const bullet = <Bullet>other.node.getComponent(Bullet);
        if (bullet == null) return;

        cc.log("---onCollisionEnter---", this.birdInfo.bird_id);

        this._canBeHit = false;
        // this.birdInfo.fix_blood -= bullet.getAttackValue();
        // if (this.birdInfo.fix_blood > 0) {
        //     this.birdInfo.birdState = BirdState.Alive;
        // } else {
        //     this.birdInfo.birdState = BirdState.WillDie;
        // }
        this.playBirdAnim();
    }

    /**
     * 小鸟是否可以被射击
     */
    canBeAttack () {
        if (this.birdInfo.birdState == BirdState.Die) return false;
        if (Game.instance._usingDuZKa && this.birdInfo.useDuZ) return true;
        if (Game.instance._usingAimKa && this.birdInfo.useAim) return true;
        if (this._canBeHit) return true;
        // cc.log("--- canBeAttack --- false");
        return false;
    }

    

    // --------------- Game Invoke Method --------------- 
    
    /**
     * 刷新小鸟血量
     * @param hp 
     */
    refreshBirdHP(hp: number) {
        this.birdInfo.total_blood = hp;
        if (this.birdInfo.useXuL) {
            cc.log("this.birdInfo.total_blood --- ", this.birdInfo.total_blood);
            cc.log("this.birdInfo.fix_blood --- ", this.birdInfo.fix_blood);
            // this.hpNodeProBar.progress = this.birdInfo.fix_blood/this.birdInfo.total_blood;
            // this.hpNodeProBar.progress = 0.5;
        }
        if (this.birdInfo.total_blood < 1 && this.birdInfo.birdState != BirdState.WillDie) {
            cc.log("-----BirdAnim_WillDie");
            this.birdInfo.birdState = BirdState.WillDie;
            this.node.opacity = 160;
        } 
    }

    /**
     * 小鸟死亡 播放动画 动画结束 处理理结束逻辑
     */

    private _doDieResolve = null;
    async doDieBird() {
        this.birdInfo.birdState = BirdState.Die;
        this.playBirdAnim();
        return new Promise((resolve, reject) => {
            this._doDieResolve = resolve;
        });
    }

    // --------------- Tool Method --------------- 

    canBeSelectToAttack () {
        if (this.birdInfo.birdState == BirdState.Die) return false;
        if (Game.instance._usingDuZKa && this.birdInfo.useDuZ) return false;
        // cc.log("--- canBeSelectToAttack --- ture");
        return true;
    }

    // --------------- Sub Node --------------- 

    /**
     * 展示HP Node
     */
    doShwoHPNode() {
        if (this.hpNode) return;

        const hpNode = Game.instance.getACacheHP();
        hpNode.position = new cc.Vec2(0, -50);
        hpNode.parent = this.node;
        hpNode.scaleX = this.node.scaleX;

        this.hpNode = hpNode;
        this.hpNodeProBar = hpNode.getComponent(cc.ProgressBar);
        this.hpNodeProBar.progress = this.birdInfo.total_blood/this.birdInfo.fix_blood;
    }

    /**
     * 隐藏HP Node
     */
    doHideHPNode() {
        if (this.hpNode == null) return;
        
        this.hpNode.removeFromParent();
        Game.instance.putACacheHP(this.hpNode);
        
        this.hpNode = null;
        this.hpNodeProBar = null;
    }

    /**
     * 展示aim Node
     */
    doShwoAimNode() {
        if (this.aimNode) return;

        const aimNode = Game.instance.getACacheAIM();
        aimNode.position = new cc.Vec2(0, 0);
        aimNode.parent = this.node;
        this.aimNode = aimNode;

        this.doPauseActions();
    }

    /**
     * 隐藏aim Node
     * @param alive 小鸟默认是存活状态
     */
    doHideAimNode() {
        if (this.aimNode == null) return;
        
        this.aimNode.removeFromParent();
        Game.instance.putACacheAIM(this.aimNode);
        this.aimNode = null;

        this.birdInfo.useAim = false;
        this.birdInfo.useDuZ = false;

        this.doPauseActions();
    }
}
