import HTTPMgr from "../../../core/HTTPMgr";
import { HTTPPath } from "../../../Const";
import Hall from "../../Hall";
import { CardInfo } from "../../HallModel";
import HallMine_myItem_item from "./HallMine_myItem_item";
import { HintUIType } from "../../../HintUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallMine_myItem extends cc.Component {

    @property(cc.Node)
    contentNode: cc.Node = null;

    @property(cc.Node)
    myItemNullNode: cc.Node = null;

    @property(cc.Prefab)
    myItem: cc.Prefab = null;

    requestInfo() {
        HTTPMgr.get(HTTPPath.USERCARDMYCARD).then(info => {
            this.setupInfo(info["data"]);
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure,err['msg']);
            cc.error("---err----" + err);
        });

    }

    setupInfo(info: Array<CardInfo>) {
        if (info.length != 0) {
            this.contentNode.removeAllChildren();
            let len = info.length;
            for (let i = 0; i < len; i++) {
                let item = cc.instantiate(this.myItem);
                item.getComponent(HallMine_myItem_item).setData(this, info[i]);
                this.contentNode.addChild(item);
            }
        } else {
            this.myItemNullNode.active = false;
        }
    }

    onClickCloseBtn() {
        this.node.active = false;
    }

    showNode() {
        this.node.active = true;
        this.requestInfo();
    }

    //跳转到充值界面
    showCharge(card_id: number) {
        cc.log("跳转到充值界面");
    }

    onDestroy() {

    }
}
