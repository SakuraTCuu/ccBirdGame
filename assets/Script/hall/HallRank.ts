import Hall from "./Hall";
import HTTPMgr from "../core/HTTPMgr";
import { HTTPPath } from "../Const";
import { UserRank } from "./HallModel";
import Game from "../game/Game";
import VVMgr from "../core/VVMgr";
import { HintUIType } from "../HintUI";

const {ccclass, property} = cc._decorator;

export enum RankType {
    Hall,
    Game
}

@ccclass
export default class HallRank extends cc.Component {

    @property(cc.Label)
    wordLabel: cc.Label = null;
    // @property(cc.Node)
    // scrollNode: cc.Node = null;
    @property(cc.Node)
    contentNode: cc.Node = null;
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    _rankData: Array<UserRank> = null;

    requestInfo(rankType: RankType) {
        if (this._rankData) return;
        let param = null;
        const path = rankType == RankType.Hall ? HTTPPath.USERONLINERANK : HTTPPath.USERONLINE;
        if (rankType == RankType.Game) {
            param = {
                type: VVMgr.gameType
            };
        }
        HTTPMgr.get(path, param).then(info => {
            this.setupInfo(info["data"], rankType);
        }).catch((err) => {
            if (rankType == RankType.Hall) {
                Hall.instance.showHintUI(HintUIType.Failure, err['msg']);
            } else {
                Game.instance.showHintUI(HintUIType.Failure, err['msg']);
            }
            cc.error("---err----" + err);
        });
    }

    setupInfo(data, rankType: RankType) {
        let in_rank = 0; //1： 代表上榜 0： 代表未上榜
        if (rankType == RankType.Hall) {
            this._rankData = <Array<UserRank>>data['list'];
            in_rank = data['in_rank'];
        } else {
            this._rankData = <Array<UserRank>>data;
        }
        const totlaLength = this._rankData.length;
        const length = totlaLength > 20 ? 20 : totlaLength;
        if (rankType == RankType.Hall) {
            if (in_rank == 0) {
                this.wordLabel.string = "- 很抱歉您暂未上榜 -";
            } else {
                this.wordLabel.string = "- 您已经上排行榜 -";
            }
        } else {
            this.wordLabel.string = "- 在线玩家 " + totlaLength + "人 -";
        }
        
        for (let index = 0; index < length; index++) {
            const element = this._rankData[index];
            const item = cc.instantiate(this.itemPrefab);
            this.contentNode.addChild(item);
            item.y = -(item.height * (0.5 + index));
            item.getChildByName("rank").getComponent(cc.Label).string = (index+1) + "";
            item.getChildByName("name").getComponent(cc.Label).string = element.nickname;
            if (rankType == RankType.Hall) {
                item.getChildByName("count").getComponent(cc.Label).string = element.count + "";
            } else {
                item.getChildByName("count").getComponent(cc.Label).string = "";
            }
            if (element.pic) { //头像
                cc.loader.load({url: element.pic, type: 'png'}, (err, texture) => {
                    // cc.log('length', arguments.length);
                    if (err == null) {
                        const sp = new cc.SpriteFrame(texture);
                        item.getChildByName('head').getChildByName('avatar').getComponent(cc.Sprite).spriteFrame = sp;
                    }
                });
            }
        }
        if (this._rankData.length > 0) {
            this.contentNode.height = length*this.contentNode.children[0].height;
        }
    }

    showNode(rankType: RankType) {
        this.node.active = true;
        this.node.opacity = 100;
        const fadeAnim = this.node.getComponent(cc.Animation);
        fadeAnim.play();

        this.requestInfo(rankType);
    }
    
    onCloseClick() { 
        this.node.active = false;
    }
}
