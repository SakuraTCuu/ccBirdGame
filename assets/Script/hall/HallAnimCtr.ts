import Hall from "./Hall";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallAnimCtr extends cc.Component {

    @property(cc.Node)
    cloud2Node: cc.Node = null;
    @property(cc.Node)
    cloud3Node: cc.Node = null;
    @property(cc.Node)
    cloud4Node: cc.Node = null;
    @property(cc.Node)
    cloud5Node: cc.Node = null;
    @property(cc.Node)
    breatheNode: cc.Node = null;
    @property(cc.Node)
    birdNode: cc.Node = null;

    // private _hallTS: Hall = null;

    // onLoad () {
    //     this._hallTS = this.node.getComponent(Hall);

    //     cc.log("HallAnimCtr onLoad");
    // }

    start () {
        this.cloud2Node.getComponent(cc.Animation).play();
        this.cloud5Node.getComponent(cc.Animation).play();
        this.breatheNode.getComponent(cc.Animation).play();
        this.cloud3Anim();
        this.cloud4Anim();

        this.birdNode.opacity = 0;
        this.birdAnim();
    }

    cloud3Anim() {
        const fromPos = this.cloud3Node.position;
        const toPos = new cc.Vec2(-this.cloud3Node.x, 210);
        const midPos = new cc.Vec2(this.randomGameNodeX(), this.randomGameNodeY(210, 210));
        const bezierTo = cc.bezierTo(cc.random0To1() * 10 + 10, [fromPos, midPos, toPos]);
        const seq = cc.sequence(bezierTo, cc.callFunc(this.cloud3Anim, this));
        this.cloud3Node.runAction(seq);
    }

    cloud4Anim() {
        const fromPos = this.cloud4Node.position;
        const toPos = new cc.Vec2(-this.cloud4Node.x, -230);
        const midPos = new cc.Vec2(this.randomGameNodeX(), this.randomGameNodeY(-230, 230));
        const bezierTo = cc.bezierTo(cc.random0To1() * 10 + 10, [fromPos, midPos, toPos]);
        const seq = cc.sequence(bezierTo, cc.callFunc(this.cloud4Anim, this));
        this.cloud4Node.runAction(seq);
    }

    birdAnim() {
        if (this.birdNode.scaleX == 1) {
            cc.log("birdAnim porid1");
            this.birdNode.scaleX = -1;
            const fromPos = new cc.Vec2(-30, -220);
            const toPos = new cc.Vec2(230, -90);
            const midPos = new cc.Vec2(Math.random()*200, Math.random()*-200);
            const time = cc.random0To1() * 5 + 5;
            const bezierTo = cc.bezierTo(time, [fromPos, midPos, toPos]);
            const fadeIn = cc.fadeIn(time);
            const fadeOut = cc.fadeOut(time);
            const seq = cc.sequence(fadeIn, bezierTo, fadeOut, cc.callFunc(this.birdAnim, this));
            this.birdNode.runAction(seq);   
        } else {
            cc.log("birdAnim porid2");
            this.birdNode.scaleX = 1;
            const fromPos = new cc.Vec2(230, -90);
            const toPos = new cc.Vec2(-30, -220);
            const midPos = new cc.Vec2(Math.random()*200, Math.random()*-200);
            const time = cc.random0To1() * 5 + 5;
            const bezierTo = cc.bezierTo(time, [fromPos, midPos, toPos]);
            const fadeIn = cc.fadeIn(time);
            const fadeOut = cc.fadeOut(time);
            const seq = cc.sequence(fadeIn, bezierTo, fadeOut, cc.callFunc(this.birdAnim, this));
            this.birdNode.runAction(seq);
        }
    }

    randomGameNodeX() {
        const x = (Math.random() - 0.5) * this.node.width * 0.5;
        // cc.log("randomGameNodeX --- ", x);
        return Math.floor(x);
    }

    randomGameNodeY(nodeY: number, randValue: number) {
        const y = cc.random0To1() == 0 ? (nodeY + Math.random() * randValue) : (nodeY - Math.random() * randValue);
        // cc.log("randomGameNodeY --- ", y);
        return Math.floor(y);
    }
}
