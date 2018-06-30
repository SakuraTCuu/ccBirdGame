import { EffectPool } from "./EffectPool";
import GameTest from "./GameTest";
import { BulletPool } from "./bullet/BulletPool";
import { BulletBase } from "./bullet/bulletBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BulletLayer extends cc.Component {

    private bulletLayer: cc.Node;  //子弹层 锚点在左下角

    private boos_commingUI: cc.Node;

    /**冰冻特效 */
    // private _frozenBg: cc.Node;

    /**冰冻文字动画 */
    // private _frozenMove: cc.Node;

    /**鱼潮来临文字动画 */
    // private _movie: cc.Node;

    /**自己子弹ID */
    private _bulletId: number;

    /**当前子弹集合*/
    private _arrBullet: Array<BulletBase>;
    private _nArrBulletLen: number;

    //定时器ID
    private _timerId: number;

    constructor() {
        super();
        this.initBulletList();
    }

    onLoad() {
        this.bulletLayer = this.node;
        this._bulletId = 0;
    }

    //初始化子弹列表
    public initBulletList(): void {
        this._arrBullet = new Array<BulletBase>();
        this._nArrBulletLen = 0;
    }
    //获取当前子弹列表
    public getBulletList(): Array<BulletBase> {
        return this._arrBullet;
    }

    /** 播放冰冻特效 */
    // public playFrozenEffect() {
    //     let _frozenBg = this.node.getChildByName("frozenBg");
    //     if (_frozenBg != null) {
    //         _frozenBg.stopAllActions();
    //         this.bulletLayer.removeChild(_frozenBg);
    //     }
    //     _frozenBg = new cc.Node("frozenBg");
    //     _frozenBg.anchorX = 0;
    //     _frozenBg.anchorY = 0;
    //     _frozenBg.x = 0;
    //     _frozenBg.y = 0;
    //     _frozenBg.opacity = 0;
    //     this.bulletLayer.addChild(_frozenBg);
    //     let sprite = _frozenBg.addComponent<cc.Sprite>(cc.Sprite);
    //     cc.loader.loadRes(`image/frozen/frozen_mask`, cc.SpriteFrame, function (err, frozen) {
    //         if (err) {
    //             return;
    //         }
    //         sprite.spriteFrame = frozen;
    //         _frozenBg.width = 1280;
    //         _frozenBg.height = 720;
    //         let action1 = cc.delayTime(0.3);
    //         let action2 = cc.fadeTo(1, 0.8 * 255);
    //         let action = cc.sequence(action1, action2);
    //         _frozenBg.runAction(action);
    //     });

    // }

    /** 清除冰冻特效 */
    // public clearFrozenEffect() {
    //     let _frozenBg = this.node.getChildByName("frozenBg");
    //     if (_frozenBg) {
    //         let action1 = cc.fadeTo(0.5, 0);
    //         let actionCall = cc.callFunc(() => {
    //             // this._frozenBg.stopAllActions();
    //             // this.bulletLayer.removeChild(this._frozenBg);
    //             NodeRemoveUtil.addNode(_frozenBg);
    //             // _frozenBg = null;
    //         });
    //         let action = cc.sequence(action1, actionCall);
    //         _frozenBg.runAction(action);
    //     }
    // }

    // //播放冰冻动画
    // public showFrozen(): void {
    //     cc.loader.loadResDir(`effect/ef_bingdongwenzi`, (err, res) => {
    //         if (err) {
    //             cc.error("获取冰冻提示文字动画资源失败");
    //             return;
    //         }
    //         let _frozenMove = new cc.Node("frozenMove");
    //         let movie = _frozenMove.addComponent<dragonBones.ArmatureDisplay>(dragonBones.ArmatureDisplay);
    //         movie.dragonAsset = cc.loader.getRes(`effect/ef_bingdongwenzi/ef_bingdong_wenzi_ske`, dragonBones.DragonBonesAsset);
    //         movie.dragonAtlasAsset = cc.loader.getRes(`effect/ef_bingdongwenzi/ef_bingdong_wenzi_tex`, dragonBones.DragonBonesAtlasAsset);
    //         this.node.addChild(_frozenMove);
    //         _frozenMove.x = 640;
    //         _frozenMove.y = 360;
    //         movie.armatureName = movie.getArmatureNames()[0];
    //         movie.playAnimation(movie.getAnimationNames(movie.armatureName)[0], 1);
    //         movie.addEventListener("complete", this.onFrozenAninmComplete, this);
    //     });

    // }

    // private onFrozenAninmComplete(): void {
    //     let _frozenMoveNode = this.node.getChildByName("frozenMove");
    //     let movie = _frozenMoveNode.getComponent<dragonBones.ArmatureDisplay>(dragonBones.ArmatureDisplay);
    //     movie.removeEventListener("complete", this.onFrozenAninmComplete, this);
    //     _frozenMoveNode && _frozenMoveNode.destroy();
    // }

    private _isFlip: boolean;
    private _callback: Function;

    /**显示鱼潮来临*/
    // public showWave(callback: Function, isFlip: boolean): void {
    //     if (!APP.EFFECT) {
    //         return;
    //     }
    //     let blackBgOld = this.node.getChildByName("blackBg");
    //     blackBgOld && blackBgOld.destroy();

    //     this._isFlip = isFlip;
    //     this._callback = callback;
    //     SoundManager.playEffectSound("changefishzhen");
    //     let blackBg = new cc.Node("blackBg");
    //     // blackBg.anchorX = 0;
    //     // blackBg.anchorY = 0;
    //     // let black = blackBg.addComponent<cc.Graphics>(cc.Graphics);
    //     // black.strokeColor = cc.color(0, 0, 0, 0.5 * 255);
    //     // black.fillColor = cc.color(0, 0, 0, 0.5 * 255);
    //     // black.fillRect(0, 0, 1280, 720);
    //     let black = blackBg.addComponent(cc.Sprite);
    //     black.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    //     blackBg.width = 1280;
    //     blackBg.height = 720;
    //     blackBg.x = 640;
    //     blackBg.y = 360;
    //     blackBg.color = cc.color(0, 0, 0);
    //     blackBg.opacity = 128;
    //     ResUtil.loadRes('singleColor', cc.SpriteFrame, function (sprite) {
    //         black.spriteFrame = sprite;
    //     });
    //     this.node.addChild(blackBg, 1);

    //     let movieNode = new cc.Node("movie");
    //     let movie = movieNode.addComponent<dragonBones.ArmatureDisplay>(dragonBones.ArmatureDisplay);
    //     movie.dragonAsset = cc.loader.getRes(`effect/wave_comming/wave_comming_ske`, dragonBones.DragonBonesAsset);
    //     movie.dragonAtlasAsset = cc.loader.getRes(`effect/wave_comming/wave_comming_tex`, dragonBones.DragonBonesAtlasAsset);
    //     this.node.addChild(movieNode, 2);
    //     movieNode.x = 640;
    //     movieNode.y = 360;
    //     movie.armatureName = movie.getArmatureNames()[0];
    //     movie.playAnimation(movie.getAnimationNames(movie.armatureName)[0], 1);
    //     movie.addEventListener("complete", this.onTweenGroupComplete, this);
    // }

    // private onTweenGroupComplete(): void {
    //     // GameLog.log("鱼潮来临动画执行完成，开始浪潮动画");
    //     let movieNode = this.node.getChildByName("movie");
    //     let movie = movieNode.getComponent<dragonBones.ArmatureDisplay>(dragonBones.ArmatureDisplay);
    //     movie.removeEventListener('complete', this.onTweenGroupComplete, this);
    //     let blackBg = this.node.getChildByName("blackBg");
    //     blackBg && blackBg.destroy();
    //     movieNode && movieNode.destroy();

    //     let assets = cc.loader.getRes('effect/wave/wave', cc.SpriteAtlas);
    //     let wave = new cc.Node();
    //     this.node.addChild(wave);
    //     wave.anchorX = 0;
    //     wave.anchorY = 0.5;
    //     wave.addComponent<cc.Sprite>(cc.Sprite);
    //     let animation = wave.addComponent<cc.Animation>(cc.Animation);
    //     let spriteFrames = assets.getSpriteFrames();
    //     let clip: cc.AnimationClip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 5);
    //     clip.wrapMode = cc.WrapMode.Loop;
    //     clip.name = "wave";
    //     animation.addClip(clip, "wave");
    //     animation.defaultClip = clip;
    //     animation.play("wave");

    //     let to: number = -500;
    //     //根据反转控制浪潮方向
    //     if (!this._isFlip) {
    //         wave.rotation = 180;
    //         wave.x = 0;
    //         wave.y = 720;
    //         to = 1780;
    //     } else {
    //         wave.x = 1280;
    //         wave.y = 0;
    //     }
    //     wave.scaleX = wave.scaleY = 2;
    //     let action = cc.sequence(
    //         cc.moveTo(1, to, wave.y),
    //         cc.callFunc(() => {
    //             NodeRemoveUtil.addNode(wave);
    //         })
    //     );
    //     wave.runAction(action);
    //     this._callback && this._callback();

    // }



    //显示倒计时样式字体
    // public showNum(num: number): void {
    //     let numFontNode = EffectPool.getEffectPool().getFontNode("number", "" + num);
    //     numFontNode.x = APP.contentWidth / 2 + APP.adaptX;
    //     numFontNode.y = APP.contentHeight / 2 + APP.adaptY + 100;
    //     // numFont.anchorOffsetX = numFont.width / 2;
    //     // numFont.anchorOffsetY = numFont.height / 2;
    //     numFontNode.scaleX = 1.8;
    //     numFontNode.scaleY = 1.8;
    //     this.node.addChild(numFontNode);
    //     // GameLog.log(numFontNode);

    //     let self = this;

    //     let action = cc.sequence(
    //         cc.scaleTo(0.3, 0.9, 0.9),
    //         cc.scaleTo(0.2, 1.1, 1.1),
    //         cc.scaleTo(0.15, 0.95, 0.95),
    //         cc.callFunc(() => {
    //             EffectPool.getEffectPool().returnFontNode(numFontNode);
    //         })
    //     );
    //     numFontNode.runAction(action);
    // }



    /** 显示BOSS来临 */
    // public bossComing(fishId: number) {
    //     if (!APP.EFFECT) {
    //         return;
    //     }
    //     if (fishId == 103) {
    //         return;
    //     }

    //     GameLog.log("BOSS来袭");

    //     ResUtil.loadRes('prefab/boos_comming', cc.Prefab, (bossCommingPrefab: cc.Prefab) => {
    //         this.boos_commingUI = cc.instantiate(bossCommingPrefab);
    //         this.node.addChild(this.boos_commingUI, 999);
    //         let bossComing = this.boos_commingUI.getComponent(BossComingComponent);
    //         bossComing.bossComing(fishId);
    //     });
    // }

    //发射子弹
    public gunFire(bullet: BulletBase, destPosX: number, destPosY: number, costTime: number, gunIndex: number) {

        this._arrBullet.push(bullet);
        this._bulletId++;
        bullet.setBulletId(this._bulletId);
        this.bulletLayer.addChild(bullet);
        //绑定并开始动作
        bullet.bindMoveAction(destPosX, destPosY, costTime);
        this._nArrBulletLen = this._arrBullet.length;
    }

    /**
     * 爆金币效果
     * @param pos 显示位置
     */
    public goldIcon(posX: number, posY: number) {
        // if (!APP.EFFECT) {
        //     return;
        // }
        // pos = this.bulletLayer.convertToNodeSpace(pos);
        if (this._timerId) {
            clearTimeout(this._timerId);
        }
        this._timerId = setTimeout(() => {
            let baojinbiBg = EffectPool.getEffectPool().getBormGold();
            baojinbiBg.x = posX;
            baojinbiBg.y = posY;
            this.bulletLayer.addChild(baojinbiBg);
            let action = cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(function () {
                    let animation = baojinbiBg.getComponentInChildren(cc.Animation);
                    animation.play(animation.getClips()[0].name);
                }, this),
                cc.scaleTo(0.2, 2),
                cc.fadeTo(0.2, 0),  //原时间为0.3
                cc.callFunc(() => {
                    EffectPool.getEffectPool().pushBormGold(baojinbiBg);
                }, this)
            );
            baojinbiBg.runAction(action);
        }, 30);
    }

    public getRoomUI(): GameTest {
        return this.node.parent.getComponent(GameTest);
    }

    public removeBullet(bullet: BulletBase) {
        bullet.setBDead(true);
    }

    private _frameCount = 0;
    private deadBulletArr = new Array<BulletBase>();
    update() {
        //子弹反弹逻辑更新
        if (this._frameCount == 3) {  //3帧抽一帧进行逻辑更新
            let bulletArr = this._arrBullet;
            let deadBulletLen = 0;
            // this.deadBulletArr = new Array<BulletBase>();
            for (let i = 0; i < this._nArrBulletLen; i++) {
                if (bulletArr[i].getBDead()) {
                    this.deadBulletArr.push(bulletArr[i]);
                    deadBulletLen++;
                } else {
                    //不需要更新逻辑
                    // bulletArr[i].logicUpdate();
                }
            }
            for (let i = 0; i < deadBulletLen; i++) {
                let index = bulletArr.indexOf(this.deadBulletArr[i]);
                bulletArr.splice(index, 1);
                BulletPool.getBulletPool().push(this.deadBulletArr[i]);
            }
            this.deadBulletArr.length = 0;
            this._frameCount = 1;
            this._nArrBulletLen = this._arrBullet.length;
            return;
        }

        this._frameCount++;
    }

    onDestroy() {
        this._callback = null;
        this.bulletLayer = null;
        this.boos_commingUI = null;
        this._arrBullet = null;
        this.deadBulletArr = null;
        this._timerId && clearTimeout(this._timerId);
    }
}
