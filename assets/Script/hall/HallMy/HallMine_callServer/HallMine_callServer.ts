import HTTPMgr from "../../../core/HTTPMgr";
import { HTTPPath } from "../../../Const";
import Hall from "../../Hall";
import { CardInfo, callServerInfo } from "../../HallModel";
import HallMine_callServer_item from "./HallMine_callServer_item";
import { HintUIType } from "../../../HintUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallMine_callServer extends cc.Component {

    @property(cc.Prefab)
    callServerItem: cc.Prefab = null;

    @property(cc.Node)
    contentNode: cc.Node = null;

    requestInfo() {
        HTTPMgr.get(HTTPPath.USERCALLSERVER).then(info => {
            this.setupInfo(info["data"]);
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure,err['msg']);
            cc.error("---err----" + err);
        });
    }

    setupInfo(info: Array<callServerInfo>) {
        if (info) {
            this.contentNode.removeAllChildren();
            let len = info.length;
            for (let i = 0; i < len; i++) {
                let item = cc.instantiate(this.callServerItem);
                item.getComponent(HallMine_callServer_item).setData(this, info[i]);
                this.contentNode.addChild(item);
            }
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
    callNativeInterface(type: number) {
        cc.log("跳转到原生界面");
        if (type == 1) {

        } else if (type == 2) {

        } else if (type == 3) {

        }
    }

    onDestroy() {

    }
}
