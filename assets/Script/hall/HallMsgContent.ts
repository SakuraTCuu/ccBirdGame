import HTTPMgr from "../core/HTTPMgr";
import { HTTPPath } from "../Const";
import Hall from "./Hall";
import { HintUIType } from "../HintUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallMsgContent extends cc.Component {

    @property(cc.Node)
    contentNode: cc.Node = null;
    @property(cc.Label)
    briefLabel: cc.Label = null;

    requestInfo(msgID: string) {
        const param = {
            id: msgID
        };
        HTTPMgr.get(HTTPPath.USERVIEWMESSAGE, param).then(info => {
            this.setupInfo(info["data"]);
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure, err['msg']);
            cc.error("---err----" + err);
        });
    }

    setupInfo(data) {
        this.briefLabel.string = data["content"];
        this.contentNode.height = this.briefLabel.node.height;
    }

    showNode(msgID: string) {
        this.node.active = true;
        this.node.opacity = 100;
        const fadeAnim = this.node.getComponent(cc.Animation);
        fadeAnim.play();

        this.requestInfo(msgID);
    }
    
    onCloseClick() {
        this.node.active = false;
    }
}
