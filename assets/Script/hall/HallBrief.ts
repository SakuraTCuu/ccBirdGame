import HTTPMgr from "../core/HTTPMgr";
import { HTTPPath } from "../Const";
import Hall from "./Hall";
import Game from "../game/Game";
import { HintUIType } from "../HintUI";

const {ccclass, property} = cc._decorator;

export enum BriefType {
    Hall = 2,
    Game,
}

@ccclass
export default class HallBrief extends cc.Component {

    @property(cc.Node)
    contentNode: cc.Node = null;
    @property(cc.Label)
    briefLabel: cc.Label = null;

    _briefRuleData = null;
    _briefGameData = null;

    requestInfo(briefType: BriefType) {
        if (briefType == BriefType.Hall && this._briefRuleData) return;
        if (briefType == BriefType.Game && this._briefGameData) return;
        const param = {
            message_type: briefType
        };
        HTTPMgr.get(HTTPPath.USERHELP, param).then(info => {
            this.setupInfo(info["data"], briefType);
        }).catch((err) => {
            if (briefType == BriefType.Hall) {
                Hall.instance.showHintUI(HintUIType.Failure, err['msg']);
            } else {
                Game.instance.showHintUI(HintUIType.Failure, err['msg']);
            }
            cc.error("---err----" + err);
        });
    }

    setupInfo(data, briefType: BriefType) {
        if (briefType == BriefType.Hall) {
            this._briefRuleData = data;
        } else {
            this._briefGameData = data;
        }
        this.briefLabel.string = data["message"];
        this.contentNode.height = this.briefLabel.node.height;
    }

    showNode(briefType: BriefType) {
        this.node.active = true;
        this.node.opacity = 100;
        const fadeAnim = this.node.getComponent(cc.Animation);
        fadeAnim.play();

        this.requestInfo(briefType);
    }
    
    onCloseClick() {
        this.node.active = false;
    }
}
