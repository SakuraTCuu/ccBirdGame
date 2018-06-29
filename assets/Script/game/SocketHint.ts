import GameNetCtr from "./GameNetCtr";

const {ccclass, property} = cc._decorator;

export enum SocketHintType {
    Hall = 2,
    Game,
}

@ccclass
export default class SocketHint extends cc.Component {

    _socketHintType: SocketHintType = null;

    showNode(hintType: SocketHintType) {
        this._socketHintType = hintType;
        this.node.active = true;
        this.node.opacity = 0;
        const fadeAnim = this.node.getComponent(cc.Animation);
        fadeAnim.play();
    }

    onCloseClick() {
        this.node.active = false;
    }

    onReturnClick() {
        GameNetCtr.instance.sendExitMsg();
        if (this._socketHintType == SocketHintType.Game) {
            cc.director.loadScene('hall');
        }
        this.node.active = false;
    }
}
