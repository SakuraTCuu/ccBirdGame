import { Traces } from "../../HallModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallMine_mybox_logistics extends cc.Component {


    @property(cc.Node)
    contentNode: cc.Node = null;

    @property(cc.Node)
    logisticsNullNode: cc.Node = null;

    @property(cc.Prefab)
    logisticsItem: cc.Prefab = null;


    onClickCloseBtn() {
        this.node.active = false;
    }

    setData(data: Array<Traces>) {
        if (data.length == 0) {
            this.logisticsNullNode.active = true;
        }else{
            this.logisticsNullNode.active = false;
        }
        this.contentNode.removeAllChildren();
        for (let i = 0; i < data.length; i++) {
            let item = cc.instantiate(this.logisticsItem);
            item.getChildByName("timeLab").getComponent(cc.Label).string = data[i].AcceptTime;
            item.getChildByName("contenLab").getComponent(cc.Label).string = data[i].AcceptStation;
            this.contentNode.addChild(item);
        }
    }

    showNode() {
        this.node.active = true;
    }

    onDestroy() {

    }
}
