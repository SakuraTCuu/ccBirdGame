import GameNetCtr from "./GameNetCtr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ReturnHint extends cc.Component {

    showNode() {
        this.node.active = true;
        this.node.opacity = 0;
        const fadeAnim = this.node.getComponent(cc.Animation);
        fadeAnim.play();
    }

    onCloseClick() {
        this.node.active = false;
    }

    onReturnClick() {
        this.node.active = false;
        GameNetCtr.instance.sendExitMsg();
        cc.director.loadScene('hall');
    }

    onGoonClick() {
        this.node.active = false;
    }
}
