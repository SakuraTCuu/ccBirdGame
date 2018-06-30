import BirdBase from "./BirdBase";
import { PathPoint } from "./PathPoint";
import BirdNode from "./BirdNode";


/** 
1,转圈 + 变大
2,加快速度 + 变大
3,加快速度
 */
export enum FishDeadType {
    RotationAndScale = 1,
    SpeedAndScale = 2,
    Speed = 3,
    DeadAtOnce = 4,
    N_1 = 5, //新的鱼死亡  方鱼
    N_2 = 6,  //新的鱼死亡  长鱼
    Alpha = 7  //新的鱼死亡  直接淡出
}


/**
 * 鱼的游动动作相关
 */
export class ActionBase {

    /**销毁方法 */
    public static destroyFun(target: BirdBase) {
        target.stopAllActions();

        target.setActive(false);
        target.setIsUpdate(false);

    }
    // static con1: number = 0;
    /**
     * 给鱼绑定移动逻辑
     * @param pathPointArray 路径关键点
     * @param target 动作对象
     */
    // private static time = -1;
    public static bindMoveAction(pathPointArray: Array<PathPoint>, target: BirdBase) {
        // this.time = new Date().getTime();
        let actionArray: Array<cc.FiniteTimeAction> = new Array();
        // let tempR = target.rotation;
        // let time = 0;
        let len = pathPointArray.length;
        for (let i = 0; i < len; i++) {
            let p = pathPointArray[i];
            // time += p.t;
            let action1 = cc.moveBy(p.t / 1000, p.x, -p.y);
            // tempR += p.r;
            let action2 = cc.rotateBy(p.t / 1000, p.r);
            let action = cc.spawn(action1, action2);

            actionArray.push(action);

            if (p.e > 0) {
                let flip = cc.callFunc(
                    function () {
                        target.fishflipY();
                    }
                );
                actionArray.push(flip);
            }
            // action = cc.sequence(action, flip);
        }

        let destroy = cc.callFunc(this.destroyFun, target);

        //如果路径数据为空，直接销毁
        if (!pathPointArray || pathPointArray.length <= 0) {
            target.runAction(destroy);
            return;
        }
        actionArray.push(destroy);
        let action = cc.sequence(actionArray);
        target.runAction(action);


        //随机位置不动
        // let posy = Math.random() * 720;
        // let posX = Math.random() * 1280;

        // target.x = posX;
        // target.y = posy;
        // // GameLog.log("随机的位置");
        // // GameLog.log(posX);
        // // GameLog.log(posy);

        // let actionFinal = cc.sequence(
        //     cc.delayTime(time / 1000),
        //     destroy
        // );
        // target.runAction(actionFinal);
    }

    /**鱼死亡动作 */
    public static fishDeadAction(deadType: FishDeadType, target: BirdNode) {
        switch (deadType) {
            case FishDeadType.RotationAndScale: {
                let actionArray: Array<cc.FiniteTimeAction> = new Array();
                actionArray.push(cc.scaleTo(0.2, 1.8));
                actionArray.push(cc.rotateBy(0.8, 360));
                actionArray.push(cc.fadeTo(0.2, 0));
                actionArray.push(cc.callFunc(this.destroyFun, target));
                let action = cc.sequence(actionArray);
                target.runAction(action);
                break;
            }
            case FishDeadType.Speed: {
                let animation = target.getComponentInChildren<cc.Animation>(cc.Animation);
                let clip = animation.currentClip;
                let animationState = animation.getAnimationState(clip.name); //用来动态控制播放速度
                animationState.speed = 3; //播放速度修改为5倍
                let actionArray: Array<cc.FiniteTimeAction> = new Array();
                actionArray.push(cc.fadeTo(0.2, 0));
                actionArray.push(cc.callFunc(this.destroyFun, target));
                let action = cc.sequence(actionArray);
                target.runAction(action);
                break;
            }
            case FishDeadType.SpeedAndScale: {
                let animation = target.getComponentInChildren<cc.Animation>(cc.Animation);
                let clip = animation.currentClip;
                let animationState = animation.getAnimationState(clip.name); //用来动态控制播放速度
                animationState.speed = 3; //播放速度修改为3倍
                let actionArray: Array<cc.FiniteTimeAction> = new Array();
                actionArray.push(cc.scaleTo(0.2, 1.5));
                actionArray.push(cc.delayTime(1));
                actionArray.push(cc.fadeTo(0.2, 0));
                actionArray.push(cc.callFunc(this.destroyFun, target));
                let action = cc.sequence(actionArray);
                target.runAction(action);
                break;
            }
            case FishDeadType.DeadAtOnce: {
                target.runAction(cc.callFunc(this.destroyFun, target));
                break;
            }
            case FishDeadType.N_1: {
                target.scale = 1.3;
                let animation = target.getComponentInChildren<cc.Animation>(cc.Animation);
                let clip = animation.currentClip;
                let animationState = animation.getAnimationState(clip.name); //用来动态控制播放速度
                animationState.speed = 3; //播放速度修改为3倍
                let actionArray: Array<cc.FiniteTimeAction> = new Array();
                actionArray.push(cc.scaleTo(0.1, 1.2));
                actionArray.push(cc.scaleTo(0.1, 1.3));
                actionArray.push(cc.scaleTo(0.1, 1.2));
                actionArray.push(cc.scaleTo(0.1, 1.3));
                actionArray.push(cc.scaleTo(0.1, 1.2));
                actionArray.push(cc.scaleTo(0.1, 0.3));
                let temp = cc.spawn(cc.scaleTo(0.2, 1.2), cc.fadeTo(1.2, 0), cc.rotateBy(1.2, -360));
                actionArray.push(temp);
                actionArray.push(cc.callFunc(this.destroyFun, target));
                let action = cc.sequence(actionArray);
                target.runAction(action);
                break;
            }
            case FishDeadType.N_2: {
                let actionArray: Array<cc.FiniteTimeAction> = new Array();
                actionArray.push(cc.delayTime(0.18));
                actionArray.push(cc.rotateBy(0, -120));
                actionArray.push(cc.delayTime(0.18));
                actionArray.push(cc.rotateBy(0, -120));
                actionArray.push(cc.delayTime(0.18));
                actionArray.push(cc.rotateBy(0, -120));
                actionArray.push(cc.delayTime(0.18));
                actionArray.push(cc.spawn(cc.rotateBy(0, -150), cc.fadeTo(0, target.opacity - 0.125 * 255)));
                actionArray.push(cc.delayTime(0.18));
                actionArray.push(cc.spawn(cc.rotateBy(0, -150), cc.fadeTo(0, target.opacity - 0.125 * 255)));
                actionArray.push(cc.delayTime(0.18));
                actionArray.push(cc.spawn(cc.rotateBy(0, -150), cc.fadeTo(0, target.opacity - 0.125 * 255)));
                actionArray.push(cc.delayTime(0.18));
                actionArray.push(cc.spawn(cc.rotateBy(0, -150), cc.fadeTo(0, target.opacity - 0.125 * 255)));
                actionArray.push(cc.delayTime(0.18));
                actionArray.push(cc.spawn(cc.rotateBy(0, -150), cc.fadeTo(0.18, target.opacity - 0.25 * 255)));
                actionArray.push(cc.delayTime(0.18));
                actionArray.push(cc.spawn(cc.rotateBy(0, -150), cc.fadeTo(0.18, target.opacity - 0.25 * 255)));
                actionArray.push(cc.callFunc(this.destroyFun, target));
                let action = cc.sequence(actionArray);
                target.runAction(action);
                break;
            }
            case FishDeadType.Alpha: {
                let actionArray: Array<cc.FiniteTimeAction> = new Array();
                actionArray.push(cc.fadeTo(0.416, 0));
                actionArray.push(cc.callFunc(this.destroyFun, target));
                let action = cc.sequence(actionArray);
                target.runAction(action);
                break;
            }
        }
    }


    public static runaway(target: BirdBase) {
        target.stopAllActions();
        target.rotation = 180;
        target.fishflipY();
        // if (!target.isFlipY()) {
        // }
        let action = cc.sequence(
            cc.moveTo(1, -1040, target.y),
            cc.callFunc(() => {
                ActionBase.destroyFun(target);
            })
        );

        target.runAction(action);
    }

    public static runAway(arr: Array<BirdBase>) {

        for (let i = 0; i < arr.length; i++) {
            ActionBase.runaway(arr[i]);
        }
    }
}