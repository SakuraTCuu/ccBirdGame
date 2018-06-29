import Game from "./Game";
import HallRank, { RankType } from "../hall/HallRank";
import GameProp from "./Prop";
import GameGift from "./Gift";
import GameScore from "./Score";
import { GiftGoodInfo } from "../hall/HallModel";
import HallBrief, { BriefType } from "../hall/HallBrief";
import HallShare from "../hall/HallShare";
import ReturnHint from "./ReturnHint";
import { ChargeType } from "../Const";
import ChargeHint from "./ChargeHInt";
import SocketHint, { SocketHintType } from "./SocketHint";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameUICtr extends cc.Component {

    @property(cc.Prefab)
    giftPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    rankPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    briefPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    sharePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    propPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    scorePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    chargeHintPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    returnHintPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    socketHintPrefab: cc.Prefab = null;
    
    giftNode: cc.Node = null;    
    rankNode: cc.Node = null;
    briefNode: cc.Node = null;
    shareNode: cc.Node = null;
    propNode: cc.Node = null;
    scoreNode: cc.Node = null;
    chargeHintNode: cc.Node = null;
    returnHintNode: cc.Node = null;
    socketHintNode: cc.Node = null;

    onLoad () {
        cc.log("GameUICtr onLoad");
    }

    onReturnClick() {
        if (this.returnHintNode == null) {
            this.returnHintNode = cc.instantiate(this.returnHintPrefab);
            this.node.addChild(this.returnHintNode);
        }
        this.returnHintNode.getComponent(ReturnHint).showNode();
    }

    onGiftClick() {
        if (this.giftNode == null) {
            this.giftNode = cc.instantiate(this.giftPrefab);
            this.node.addChild(this.giftNode);
        }
        this.giftNode.getComponent(GameGift).showNode();
    }

    onRankClick() {
        if (this.rankNode == null) {
            this.rankNode = cc.instantiate(this.rankPrefab);
            this.node.addChild(this.rankNode);
        }
        this.rankNode.getComponent(HallRank).showNode(RankType.Game);
    }
    
    onBriefClick() {
        if (this.briefNode == null) {
            this.briefNode = cc.instantiate(this.briefPrefab);
            this.node.addChild(this.briefNode);
        }
        this.briefNode.getComponent(HallBrief).showNode(BriefType.Game);
    }

    onShareClick() {
        if (this.shareNode == null) {
            this.shareNode = cc.instantiate(this.sharePrefab);
            this.node.addChild(this.shareNode);
        }
        this.shareNode.getComponent(HallShare).showNode();
    }

    onPropClick() {
        if (this.propNode == null) {
            this.propNode = cc.instantiate(this.propPrefab);
            this.node.addChild(this.propNode);
        }
        this.propNode.getComponent(GameProp).showNode();
    }

    onScoreClick(giftMsg: GiftGoodInfo) {
        if (this.scoreNode == null) {
            this.scoreNode = cc.instantiate(this.scorePrefab);
            this.node.addChild(this.scoreNode);
        }
        const gameSocre = this.scoreNode.getComponent(GameScore);
        if (gameSocre.isShowing()) return;
        gameSocre.showNode(giftMsg);
    }

    onChargeClick(chargeType: ChargeType) {
        if (this.chargeHintNode == null) {
            this.chargeHintNode = cc.instantiate(this.chargeHintPrefab);
            this.node.addChild(this.chargeHintNode);
        }
        const chargeHint = this.chargeHintNode.getComponent(ChargeHint);
        if (chargeHint.isShowing()) return;
        chargeHint.showNode(chargeType);
    }

    onSocketFailure() {
        if (this.socketHintNode == null) {
            this.socketHintNode = cc.instantiate(this.socketHintPrefab);
            this.node.addChild(this.socketHintNode);
        }
        this.socketHintNode.getComponent(SocketHint).showNode(SocketHintType.Game);
    }
}
