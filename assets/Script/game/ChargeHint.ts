import { ChargeType } from "../Const";
import VVMgr from "../core/VVMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChargeHint extends cc.Component {

    @property(cc.Label)
    hintLabel: cc.Label = null;

    _chargeType: ChargeType = null;

    showNode(chargeType: ChargeType) {
        this.node.active = true;
        this._chargeType = chargeType;
        if (chargeType == ChargeType.Bullet) {
            this.hintLabel.string = "您的金弹不足,请充值!";
        } else {
            this.hintLabel.string = "您的道具不足,请充值!";
        } 
        this.node.opacity = 0;
        const fadeAnim = this.node.getComponent(cc.Animation);
        fadeAnim.play();
    }

    isShowing() {
        cc.log("ChargeHint isShowing --- ", this.node.active);
        return this.node.active;
    }

    onCloseClick() {
        this.node.active = false;
    }

    onChargeClick() {
        this.node.active = false;
        VVMgr.sdkMgr.showChargeUI(this._chargeType);
    }
}
