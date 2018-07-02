import BirdBase from "./BirdBase";
import { FishResLoadUtil } from "./fishResLoadUtil";
import VVMgr from "../core/VVMgr";

export default class BirdNode extends BirdBase {

    private birdInfoArr: any = null;

    /** 鸟的碰撞区 */
    public _rectList: Array<cc.Rect> = new Array<cc.Rect>();

    //动画片段偏移量
    public _modifyRect: cc.Rect;

    /**销毁标记 */
    public destroyFlg = false;

    /**入池标记 */
    public inPoolFlg = false;

    /**在场景标记 */
    public inSceneFlg = false;

    public _bViewFlip: boolean;

    /** 基准适配比例 */
    public static contentWidth = 750;
    public static contentHeight = 1334;

    /**基准颜色 */
    //用于恢复颜色
    static BaseColor = cc.color(255, 255, 255, 255);
    // static HitColor_2 = cc.color(331.5, 114.75, 114.75, 255);
    static HitColor_2 = cc.color(75, 114, 114, 255);
    static HitColor_1 = cc.color(255, 114, 114, 255);
    static HitColor_0 = cc.color(49, 206, 62, 255);

    constructor(id: number, bViewFlip: boolean = false) {
        super(id);

        this.BIRD_LAYER = new cc.Node("BIRD_LAYER");
        this.addChild(this.BIRD_LAYER);

        this.EFFECT_LAYER = new cc.Node("effect_layer");
        this.addChild(this.EFFECT_LAYER);

        this.FISH_POP_LAYER = new cc.Node("fish_pop_layer");
        this.addChild(this.FISH_POP_LAYER);
        this._bViewFlip = bViewFlip;

        this.init(id);
    }

    init(id: number): void {
        this.setType(-1);
        let name = "bird";
        this.addFishData(id, name, 0, 0, 5);
        this.birdInfoArr = VVMgr.birdInfoArr;
    }

    /**
    * 添加鱼的动画效果 和 碰撞框
    * @param id  鱼类型ID
    * @param name  资源名
    */
    addFishData(id: number, name: string, posX: number, posY: number, frameRate: number) {
        let fish: cc.Node = new cc.Node(name);
        this.name = name;
        fish.group = "fish";

        this.BIRD_LAYER.addChild(fish);
        let sprite = fish.addComponent(cc.Sprite);

        let spriteFrames = FishResLoadUtil.getFishRes(name);
        //所有鸟的图集 必须分开
        let newSf = new Array<cc.SpriteFrame>();
        // let count = this.birdInfoArr.length;
        // count = count > 30 ? 30 : count;
        // for (let i = 0; i < count; i++) {
        //     let birdInfo = this.birdInfoArr[i];
        //     for (let k = 0; k < 5; k++) {
        //         name = i + "-" + k;
        //         newSf.push(spriteFrames.getSpriteFrame(name));
        //     }
        //     if (birdInfo.size == 1) {
        //         fish.scale = 1;
        //     } else if (birdInfo.size == 2) {
        //         fish.scale = 1.4;
        //     } else if (birdInfo.size == 3) {
        //         fish.scale = 1.8;
        //     }
        //     fish.active = true;
        //     fish.scaleX = birdInfo.direction == 1 ? -fish.scaleX : fish.scaleX;

        // }

        for (let i = 0; i < 5; i++) {
            newSf.push(spriteFrames[i]);
        }

        sprite.spriteFrame = spriteFrames[0];
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        // fish.width *= 1.5;
        // fish.height *= 1.5;

        let animation = fish.addComponent(cc.Animation);
        let frame = 5;
        if (frameRate > 0) {
            frame = frameRate;
        }

        let clip = FishResLoadUtil.getFishResLoadUtil().getFishAnimationClip(name, frame, newSf);
        animation.addClip(clip);
        animation.defaultClip = clip;
        animation.play(clip.name);

        fish.x = posX;
        fish.y = -posY;
        this._modifyRect = new cc.Rect(fish.x, fish.y, 0, 0);
        // this.addCollision(fish, name);
        this.addCollisionNode(fish, name);
    }

    /**添加碰撞框和碰撞组件 */
    private addCollisionNode(fish: cc.Node, name: string) {
        let data = cc.loader.getRes(`fish/${name}` + '_rect');
        if (!data) {
            let x = fish.x - fish.width / 2;
            let y = fish.y - fish.height / 2;
            this._rectList.push(new cc.Rect(x, y, fish.width, fish.height));
        } else {
            let rectData = data.rect;
            let len = rectData.length;
            for (let i = 0; i < len; i++) {
                this._rectList.push(new cc.Rect(rectData[i].x, rectData[i].y, rectData[i].w, rectData[i].h));
            }
        }
    }


    //设置位置
    public setFishPosition(posX: number, posY: number): void {
        this.x = posX;
        this.y = posY;
    }

    //在鸟身上加特效
    public addEffect(dis: cc.Node, name: string): boolean {
        // let child = this.EFFECT_LAYER.getChildByName(name);
        // if (child == null) {
        // this.EFFECT_LAYER.addChild(dis, 7);
        //     return true;
        // }
        // return false;
        this.EFFECT_LAYER.addChild(dis, 7);
        return true;
    }


    /**移除一个指定名称特效 */
    public removeEffect(name: string): void {
        let child = this.EFFECT_LAYER.getChildByName(name);
        child && child.destroy();
    }

    /**移除所有同名特效 */
    public removeAllAssignEffect(name: string) {
        let chileder = this.EFFECT_LAYER.children;
        let len = chileder.length;
        for (let i = 0; i < len; i++) {
            if (chileder[i].name == name) {
                chileder[i].destroy();
            }
        }
    }

    //获取显示特效偏移量
    public getModifyRect(): cc.Rect {
        return this._modifyRect;
    }



    private _isInHit: boolean = false;
    /**鸟被击中效果 */
    public playHitEffect(): void {
        // let vo = T_Fish_Table.getVoByKey(this.getFishId());
        let fishNodes = this.getBIRD_LAYER().children;
        let len = this.getBIRD_LAYER().childrenCount;
        if (!this._isInHit) {
            this._isInHit = true;
            for (let i = 0; i < len; i++) {

                //颜色特效展示
                // if (vo.Matrix == FilterEnmu.FISH_TYPE_MATRIX_1) {
                //     fishNodes[i].color = APP.HitColor_1;
                // } else if (vo.Matrix == FilterEnmu.FISH_TYPE_MATRIX_2) {
                //     fishNodes[i].color = APP.HitColor_2;
                // } else {
                //     fishNodes[i].color = APP.HitColor_0;
                // }

                let action = cc.sequence(cc.delayTime(0.12), cc.callFunc(() => {
                    fishNodes[i].color = BirdNode.BaseColor;
                    this._isInHit = false;
                    fishNodes[i].stopAllActions();
                }));
                fishNodes[i].runAction(action);
            }
        }
    }

    //鸟死亡
    public playDead(): void {
        // let boxColliders = this.getComponentsInChildren(cc.BoxCollider); //鱼死亡时 停用其碰撞框 
        // for (let collider of boxColliders) {
        //     collider.enabled = false;
        // }

        //播放死亡音效
        // SoundManager.playFishDeathSound(this.getFishId());

        //暂时停止其它动作
        this.stopAllActions();
        //播放死亡特效

        //不同鸟的死亡动画不同  
        // let obj = this.getBIRD_LAYER().children;
        // let vo = T_Fish_Table.getVoByKey(this.getFishId());

        // ActionBase.fishDeadAction(vo.deadType, this);

        if (this.EFFECT_LAYER) {
            this.EFFECT_LAYER.removeAllChildren();
        }
    }

    /**重置鸟的数据 */
    public resetData() {
        this.scaleX = 1;
        this.scaleY = 1;
        this.opacity = 255;
        this.rotation = 0;
        this.color = BirdNode.BaseColor;
        this.setIsUpdate(true);


        let fishChildren = this.BIRD_LAYER.children;
        let len = fishChildren.length;
        for (let i = 0; i < len; i++) {
            fishChildren[i].color = BirdNode.BaseColor;
            let animation = fishChildren[i].getComponent(cc.Animation);
            if (animation) {
                let clip = animation.currentClip;
                let animationState = animation.getAnimationState(clip.name); //用来动态控制播放速度
                animationState.speed = 1; //还原播放速度
            }
        }

        // let boxColliders = this.getComponentsInChildren(cc.BoxCollider);
        // for (let collider of boxColliders) {
        //     collider.enabled = true;
        // }

        if (this.EFFECT_LAYER) {
            this.EFFECT_LAYER.destroyAllChildren();
        }
        this.opacity = 255;
    }


    /**
    * 鸟翻转
    */
    public fishflipY(): void {

        let childFishs = this.BIRD_LAYER.childrenCount;
        for (let i = 0; i < childFishs; i++) {
            let fish = this.BIRD_LAYER.children[i];
            fish.scaleY = -fish.scaleY;
            if (fish.scaleY < 0) {
                this._bFlipY = true;
            } else {
                this._bFlipY = false;
            }
        }

        //特效翻转
        let childEffects = this.EFFECT_LAYER.childrenCount;
        for (let i = 0; i < childEffects; i++) {
            let child = this.EFFECT_LAYER.children[i];
            child.y = -child.y;
        }

        // if (this.getBirdId() == 100) {
        //     let childPop = this.FISH_POP_LAYER.childrenCount;
        //     for (let i = 0; i < childPop; i++) {
        //         let child = this.FISH_POP_LAYER.children[i];
        //         child.y = -child.y;
        //         if (this._bFlipY != this._bViewFlip) {
        //             if (!this._bFlipY) {
        //                 child.scaleY = child.scaleY;
        //                 child.scaleX = child.scaleX;
        //             } else {
        //                 child.scaleY = -child.scaleY;
        //                 child.scaleX = -child.scaleX;
        //             }
        //         } else {
        //             if (!this._bFlipY) {
        //                 child.scaleY = -child.scaleY;
        //                 child.scaleX = -child.scaleX;
        //             } else {
        //                 child.scaleY = child.scaleY;
        //                 child.scaleX = child.scaleX;
        //             }
        //         }
        //     }
        // }
    }

    public destroy(): boolean {
        // Tools.removeAllAction(this);
        // let len = this.timerId.length;
        // for (let i = 0; i < len; i++) {
        //     clearTimeout(this.timerId[i]);
        // }
        // this.timerId = null;

        if (this.EFFECT_LAYER) {
            this.EFFECT_LAYER.destroyAllChildren();
            this.EFFECT_LAYER.removeAllChildren();
            this.EFFECT_LAYER.removeFromParent(true);
        }

        if (this.FISH_POP_LAYER) {
            this.FISH_POP_LAYER.destroyAllChildren();
            this.FISH_POP_LAYER.removeAllChildren();
            this.FISH_POP_LAYER.removeFromParent(true);
        }
        if (this.BIRD_LAYER) {
            this.BIRD_LAYER.destroyAllChildren();
            this.BIRD_LAYER.removeAllChildren();
            this.BIRD_LAYER.removeFromParent(true);
        }
        this._rectList = null;
        // this.stopAllActions();
        this.destroyAllChildren();
        this.removeAllChildren(true);
        this._modifyRect = null;

        this.destroyFlg = true;
        return super.destroy();
    }
}
