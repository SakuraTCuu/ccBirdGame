import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Net extends cc.Component {

    netLevel: number = 1;

    onLoad() {
        this.node.getComponent(cc.Animation).on("finished", this.hideNet, this);
    }

    show(gameJS: Game, level: number, pos: cc.Vec2) {
        this.netLevel = level;

        this.node.parent = gameJS.node;
        this.node.position = gameJS.node.convertToNodeSpaceAR(pos);
        this.node.getComponent(cc.Animation).play('NetAnim_' + this.netLevel);
    }

    hideNet() {
        this.node.removeFromParent();
        Game.instance.putACacheNet(this.node);
    }
}
