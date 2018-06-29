import HallMine_address from "./HallMine_address/HallMine_address";
import HallMine_mybox from "./HallMine_mybox/HallMine_mybox";
import HallMine_recharge from "./HallMine_recharge/HallMine_recharge";
import HallMine_showGift from "./HallMine_showgift/HallMine_showGift";
import HallMine_myItem from "./HallMine_myItem/HallMine_myItem";
import HallMine_callServer from "./HallMine_callServer/HallMine_callServer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallMine extends cc.Component {

    @property(cc.Node)
    boxNode: cc.Node = null;

    @property(cc.Node)
    rechargeNode: cc.Node = null;

    @property(cc.Node)
    addressNode: cc.Node = null;

    @property(cc.Node)
    showGiftNode: cc.Node = null;

    @property(cc.Node)
    myItemNode: cc.Node = null;

    @property(cc.Node)
    callServerNode: cc.Node = null;

    showNode() {
        this.node.active = true;
        this.node.opacity = 100;
        const fadeAnim = this.node.getComponent(cc.Animation);
        fadeAnim.play();
    }

    //销毁还是隐藏 关于性能消耗
    onBtnClickClose() {
        // this.node.active = false;
        this.node.destroy();
    }

    //我的宝箱
    onBtnClickBox() {
        this.boxNode.getComponent(HallMine_mybox).showNode();
    }

    //充值记录
    onBtnClickRecharge() {
        this.rechargeNode.getComponent(HallMine_recharge).showNode();
    }

    //收宝地址
    onBtnClickAddress() {
        // this.addressNode.active = true;
        this.addressNode.getComponent(HallMine_address).showNode(0);
    }

    //我的晒宝
    onBtnClickShowGift() {
        this.showGiftNode.getComponent(HallMine_showGift).showNode();
    }

    //我的道具
    onBtnClickMyItem() {
        this.myItemNode.getComponent(HallMine_myItem).showNode();
    }

    //联系客服
    onBtnClickCallServer() {
        this.callServerNode.getComponent(HallMine_callServer).showNode();
    }

    onDestroy() {
        cc.log("HallMine destroy");
    }
}
