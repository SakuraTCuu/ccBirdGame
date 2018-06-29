import VVMgr from "../core/VVMgr";

const {ccclass, property} = cc._decorator;

export enum ShareType {
    QQ = 0,
    WX,
    PYQ
};

@ccclass
export default class HallShare extends cc.Component {

    onQQClick() {
        VVMgr.sdkMgr.notifyNativeShare(ShareType.QQ);
        this.node.active = false;
    }

    onWXClick() {
        VVMgr.sdkMgr.notifyNativeShare(ShareType.WX);
        this.node.active = false;
    }

    onPYQClick() {
        VVMgr.sdkMgr.notifyNativeShare(ShareType.PYQ);
        this.node.active = false;
    }

    showNode() {
        this.node.active = true;
        this.node.opacity = 100;
        const fadeAnim = this.node.getComponent(cc.Animation);
        fadeAnim.play();
    }

    onCloseClick() {
        this.node.active = false;
    }
}
