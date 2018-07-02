import Hall from "./Hall";
import VVMgr from "../core/VVMgr";
import HallMsg from "./HallMsg";
import HallLottery from "./HallLottery";
import HallRank, { RankType } from "./HallRank";
import { WebCmd, ChargeType } from "../Const";
import NetMgr from "../core/NetMgr";
import { UserInfo, BatteryInfo } from "./HallModel";
import { BirdInfo } from "../game/BirdConfig";
import HallBrief, { BriefType } from "./HallBrief";
import HallShare from "./HallShare";
import HallSetting from "./HallSetting";
import HallMsgContent from "./HallMsgContent";
import SocketHint, { SocketHintType } from "../game/SocketHint";
import { HintUIType } from "../HintUI";
import ResLoadingManager from "../utils/ResLoadingManager";

const { ccclass, property } = cc._decorator;

export enum NativeUIType {
    Info = 0,
    My,
    Show
};

@ccclass
export default class HallUICtr extends cc.Component {

    @property(cc.Prefab)
    msgPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    msgContentPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    briefPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    rankPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    sharePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    settingPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    lotteryPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    socketHintPrefab: cc.Prefab = null;

    //我的 预制体
    @property(cc.Prefab)
    minePrefab: cc.Prefab = null;
    mineNode: cc.Node = null;

    msgNode: cc.Node = null;
    msgContentNode: cc.Node = null;
    briefNode: cc.Node = null;
    rankNode: cc.Node = null;

    shareNode: cc.Node = null;
    settingNode: cc.Node = null;
    lotteryNode: cc.Node = null;
    socketHintNode: cc.Node = null;

    private static _instance: HallUICtr = null;
    public static get instance(): HallUICtr {
        return HallUICtr._instance;
    }

    onLoad() {
        HallUICtr._instance = this;
        cc.log("HallUICtr onLoad");
    }

    onUserInfoClick() {
        VVMgr.sdkMgr.showNativeUI(NativeUIType.Info);
    }

    onMsgClick() {
        if (this.msgNode == null) {
            this.msgNode = cc.instantiate(this.msgPrefab);
            this.node.addChild(this.msgNode);
        }
        this.msgNode.getComponent(HallMsg).showNode();
    }

    onMsgContentClick(msgID: string) {
        if (this.msgContentNode == null) {
            this.msgContentNode = cc.instantiate(this.msgContentPrefab);
            this.node.addChild(this.msgContentNode);
        }
        this.msgContentNode.getComponent(HallMsgContent).showNode(msgID);
    }

    onBriefClick() {
        if (this.briefNode == null) {
            this.briefNode = cc.instantiate(this.briefPrefab);
            this.node.addChild(this.briefNode);
        }
        this.briefNode.getComponent(HallBrief).showNode(BriefType.Hall);
    }

    onSignClick() {
        if (this.lotteryNode == null) {
            this.lotteryNode = cc.instantiate(this.lotteryPrefab);
            this.node.addChild(this.lotteryNode);
        }
        this.lotteryNode.getComponent(HallLottery).showNode();
    }

    onRankClick() {
        if (this.rankNode == null) {
            this.rankNode = cc.instantiate(this.rankPrefab);
            this.node.addChild(this.rankNode);
        }
        this.rankNode.getComponent(HallRank).showNode(RankType.Hall);
    }

    onChargeClick() {
        VVMgr.sdkMgr.showChargeUI(ChargeType.Bullet);
    }

    onMineClick() {
        // VVMgr.sdkMgr.showNativeUI(NativeUIType.My);

        //creator集成
        this.mineNode = cc.instantiate(this.minePrefab);
        this.node.addChild(this.mineNode);
    }

    onShowClick() {
        VVMgr.sdkMgr.showNativeUI(NativeUIType.Show);
    }

    onShareClick() {
        if (this.shareNode == null) {
            this.shareNode = cc.instantiate(this.sharePrefab);
            this.node.addChild(this.shareNode);
        }
        this.shareNode.getComponent(HallShare).showNode();
    }

    onSettingClick() {
        if (this.settingNode == null) {
            this.settingNode = cc.instantiate(this.settingPrefab);
            this.node.addChild(this.settingNode);
        }
        this.settingNode.getComponent(HallSetting).showNode();
    }

    onJoinGameClick(touch: cc.Event.EventTouch, data) {
        const type = parseInt(data);
        Hall.instance.showLoading();
        const param = {
            "cmd": WebCmd.CMD_USER_INTOGAME_REQ,
            "token": VVMgr.token,
            "type": type
        };
        NetMgr._send(param);

        const callbackF = (callMsg) => {
            NetMgr._offEvent(WebCmd.CMD_USER_INTOGAME_RSP);
            cc.log("JS-WSS onJoinGameClick callMsg ---", callMsg);
            const code = callMsg['code'];
            if (code == 1) {
                const retData = callMsg['data'];
                VVMgr.gameType = type;
                VVMgr.group = retData['group'];
                VVMgr.otherUserInfoArr = <UserInfo[]>retData['otherUser'];
                VVMgr.birdInfoArr = <BirdInfo[]>retData['bird'];
                VVMgr.batteryInfoArr = <BatteryInfo[]>retData['battery'];
                cc.director.preloadScene('game', (err) => {
                    Hall.instance.hideLoading();

                    // cc.log("加载资源开始");
                    //TODO 新添加 加载资源
                    // ResLoadingManager.loadRoomRes(() => {
                    cc.director.loadScene('game');
                    // });
                });
            } else {
                Hall.instance.showHintUI(HintUIType.Failure, callMsg['msg']);
            }
        };
        NetMgr._onEvent(WebCmd.CMD_USER_INTOGAME_RSP, callbackF);
    }

    onSocketFailure() {
        if (this.socketHintNode == null) {
            this.socketHintNode = cc.instantiate(this.socketHintPrefab);
            this.node.addChild(this.socketHintNode);
        }
        this.socketHintNode.getComponent(SocketHint).showNode(SocketHintType.Hall);
    }
}
