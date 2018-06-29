import HTTPMgr from "../core/HTTPMgr";
import Hall from "./Hall";
import { HTTPPath } from "../Const";
import { MsgInfo } from "./HallModel";
import HallUICtr from "./HallUICtr";
import { HintUIType } from "../HintUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallMsg extends cc.Component {

    @property(cc.Node)
    contentNode: cc.Node = null;
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    _msgData: Array<MsgInfo> = null;

    requestInfo() {
        // if (this._msgData) return;
        HTTPMgr.get(HTTPPath.USERMESSAGE).then(info => {
            this.setupInfo(info["data"]);
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure, err['msg']);
            cc.error("---err----" + err);
        });
    }

    setupInfo(data) {
        this._msgData = <Array<MsgInfo>>data;
        this._msgData.forEach((element, index) => {
            const item = cc.instantiate(this.itemPrefab);
            this.contentNode.addChild(item);
            item.y = -(item.height * (0.5 + index));
            item.getChildByName("title").getComponent(cc.Label).string = element.title;
            item.getChildByName("time").getComponent(cc.Label).string = element.create_date;
            if (element.is_read == 1) {
                // debugger;
                // cc.log("getChildByName--- ", item.getChildByName("iconS").getComponent(cc.Sprite));
                const sprite = item.getChildByName("iconS").getComponent(cc.Sprite);
                sprite.spriteFrame = Hall.instance.hallAtlas.getSpriteFrame("gonggao_yidu");
            } 
            const eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "HallMsg";
            eventHandler.handler = "onItemClick";
            eventHandler.customEventData = element.id;
            item.getComponent(cc.Button).clickEvents.push(eventHandler);
        });
        if (this._msgData.length > 0) {
            this.contentNode.height = this._msgData.length * this.contentNode.children[0].height;
        }
    }

    onItemClick(touch: cc.Event.EventTouch, eventData) {
        this.onCloseClick();

        const param = {
            id: eventData
        };
        HTTPMgr.post(HTTPPath.USERREADMESSAGE, param);
        HallUICtr.instance.onMsgContentClick(eventData);
    }

    showNode() {
        this.node.active = true;
        this.node.opacity = 100;
        const fadeAnim = this.node.getComponent(cc.Animation);
        fadeAnim.play();

        this.requestInfo();
    }

    onCloseClick() {
        this.node.active = false;
    }
}
