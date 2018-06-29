import NetMgr from "../core/NetMgr";
import { WebCmd, PropType } from "../Const";
import Game from "./Game";
import { BatteryInfo } from "../hall/HallModel";
import { BirdInfo } from "./BirdConfig";
import VVMgr from "../core/VVMgr";
import GameMsgCtr from "./GameMsgCtr";
import GamePTCtr from "./GamePTCtr";
import GameBirdCtr from "./GameBirdCtr";
import { HintUIType } from "../HintUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameNetCtr extends cc.Component {

    private static _instance: GameNetCtr = null;
    public static get instance(): GameNetCtr {
        return GameNetCtr._instance;
    }
    
    onLoad() {
        GameNetCtr._instance = this;

        NetMgr._onEvent(WebCmd.CMD_GAME_USERIN, this.callbackUserIn);
        NetMgr._onEvent(WebCmd.CMD_GAME_USEREXIT, this.callbackUserExit);
        
        NetMgr._onEvent(WebCmd.CMD_GAME_USERBINGO, this.callbackUserBingo);
        NetMgr._onEvent(WebCmd.CMD_GAME_MESSAGE, this.callbackUserMsg);

        NetMgr._onEvent(WebCmd.CMD_USER_HIRBIRD_RSP, this.callbackBirdAttack);
        NetMgr._onEvent(WebCmd.CMD_ROBOT_HIRBIRD_RSP, this.callbackRobotAttack);

        NetMgr._onEvent(WebCmd.CMD_GAME_BIRDFILL, this.callbackBirdFill);

        cc.log("GameNetCtr onLoad");
    }

    onDestroy() {
        NetMgr._offEvent(WebCmd.CMD_GAME_USERIN);
        NetMgr._offEvent(WebCmd.CMD_GAME_USEREXIT);
        NetMgr._offEvent(WebCmd.CMD_GAME_USERBINGO);
        NetMgr._offEvent(WebCmd.CMD_GAME_MESSAGE);
        NetMgr._offEvent(WebCmd.CMD_USER_HIRBIRD_RSP);
        NetMgr._offEvent(WebCmd.CMD_GAME_BIRDFILL);

        cc.log("GameNet onDestroy");
    }

    callbackUserIn(callMsg) {
        const data = callMsg['data'];
        GameNetCtr.instance.node.getComponent(GameMsgCtr).receiveUserIn(data);
        GameNetCtr.instance.node.getComponent(GamePTCtr).receiveUserIn(data);
        cc.log("   callbackUserIn   ", callMsg);
    }

    callbackUserExit(callMsg) {
        const data = callMsg['data'];
        // GameNetCtr.instance.node.getComponent(GameMsgCtr).receiveUserExit(data);
        GameNetCtr.instance.node.getComponent(GamePTCtr).receiveUserExit(data);
        cc.log("   callbackUserExit   ", callMsg);
    }

    callbackUserBingo(callMsg) {
        const data = callMsg['data'];
        // GameNetCtr.instance.node.getComponent(GameUICtr).onScoreClick(data);
        Game.instance.serverBingoABird(data);
        cc.log("   callbackUserBingo   ", callMsg);
    }

    callbackUserMsg(callMsg) {
        const data = callMsg['data'];
        //目前消息只有 谁获得了xxx
        GameNetCtr.instance.node.getComponent(GameMsgCtr).receiveCommonMsg(data);
        cc.log("   callbackUserMsg   ", callMsg);
    }

    callbackRobotAttack(callMsg) {
        const data = callMsg['data'];
        if (callMsg['code'] == 1) {
            Game.instance.robotAttackABird(data);
        } 
        cc.log("   callbackRobotAttack   ", callMsg);
    }

    callbackBirdAttack(callMsg) {
        const data = callMsg['data'];
        if (callMsg['code'] == 1) {
            Game.instance.serverAttackAbird(data);
        } else {
            Game.instance.showHintUI(HintUIType.Failure, callMsg['msg']);
        }
        cc.log("   callbackBirdAttack   ", callMsg);
    }

    callbackBirdFill(callMsg) {
        const data = callMsg['data'];
        Game.instance.serverFillABird(data);
        cc.log("   callbackBirdFill   ", callMsg);
    }

    sendShotMsg(birdInfo: BirdInfo, weaponInfo: BatteryInfo, propType: PropType, cardToken: string) {
        const shootParam = {
            "cmd": WebCmd.CMD_USER_HIRBIRD_REQ,
            "token": VVMgr.token, 
            "bird_id": birdInfo.bird_id,
            "type": VVMgr.gameType,
            "is_use_battery": 1,
            "bid": weaponInfo.bid,
            "group": VVMgr.group,
            "extra": weaponInfo.level,
        };
        if (cardToken) {
            if (propType == PropType.DuZKa) {
                shootParam["monopoly_token"] = cardToken;
            } else if (propType == PropType.BeiLKa) {
                shootParam["rate_token"] = cardToken;
            }
        }
        NetMgr._send(shootParam);
    }

    sendRobotMsg(encrypt_uid: string) {
        const birdInfo = GameBirdCtr.instance.getARandomBirdInfo();
        const shootParam = {
            "cmd": WebCmd.CMD_ROBOT_HIRBIRD_REQ,
            "bird_id": birdInfo.bird_id,
            "type": VVMgr.gameType,
            "encrypt_uid": encrypt_uid,
            "group": VVMgr.group,
            "extra": birdInfo.bird_id,
        };
        NetMgr._send(shootParam);
    }
    // {
    //     "cmd" : "robotPlayBird"  ,
    //     "type" : 1 , 
    //     "group" : "group_7325c029b694593c711fcd777b0c0900" , 
    //     "encrypt_uid" : "UUvngb8tBa2Oddddddgsx1",
    //     "extra" : {
    //      "bird_id" : 23
    //      }
    // }

    sendWillUseCard(cardId: string, propType: PropType, birdId?: string) {
        const cardParam = {
            "cmd": WebCmd.CMD_USER_USERCARD_REQ,
            "token": VVMgr.token, 
            "type": VVMgr.gameType,
            "card_id": cardId
        };
        NetMgr._send(cardParam);
        const callbackF = (callMsg) => {
            NetMgr._offEvent(WebCmd.CMD_USER_USERCARD_RSP);
            const code = callMsg['code'];
            if (code == 1) {
                // "token" : "7d2abc84438cefe909466dfa659fddeb" ,
                // "expire" : 200
                const retData = callMsg['data'];
                if (propType == PropType.XueLKa) {
                    this.sendUseXuLCard(retData["token"], retData["expire"]);
                } else if (propType == PropType.DuZKa) {
                    this.sendUseDuZCard(retData["token"], retData["expire"], birdId);
                } else {
                    Game.instance.onUseBeika(retData["token"], retData["expire"]);
                }
                // cc.log("retData --- ", retData);
            } else {
                Game.instance.showHintUI(HintUIType.Failure, callMsg['msg']);
            }
        };
        NetMgr._onEvent(WebCmd.CMD_USER_USERCARD_RSP, callbackF);
    }

    sendUseXuLCard(card_token: string, expire: number) {
        const cardParam = {
            "cmd": WebCmd.CMD_USER_USERCARD_REQ,
            "token": VVMgr.token, 
            "type": VVMgr.gameType,
            "operation": "showBold",
            "card_token": card_token,
            "group": VVMgr.group
        };
        NetMgr._send(cardParam);
        const callbackF = (callMsg) => {
            NetMgr._offEvent(WebCmd.CMD_USER_USERCARD_XUL_RSP);
            const code = callMsg['code'];
            if (code == 1) {
                const retData = <Array<any>>callMsg['data'];
                Game.instance.onUseXueLka(retData, card_token, expire);
                cc.log("retData --- ", retData);
            } else {
                Game.instance.showHintUI(HintUIType.Failure, callMsg['msg']);
            }
        };
        NetMgr._onEvent(WebCmd.CMD_USER_USERCARD_XUL_RSP, callbackF);
    }

    sendUseDuZCard(card_token: string, expire: number, birdId: string) {
        const cardParam = {
            "cmd": WebCmd.CMD_USER_USERCARD_REQ,
            "token": VVMgr.token, 
            "type": VVMgr.gameType,
            "operation": "monopolyBird",
            "card_token": card_token,
            "group": VVMgr.group, 
            "bird_id": birdId
        };
        NetMgr._send(cardParam);
        const callbackF = (callMsg) => {
            NetMgr._offEvent(WebCmd.CMD_USER_USERCARD_DUZ_RSP);
            const code = callMsg['code'];
            if (code == 1) {
                const retData = <Array<string>>callMsg['data'];
                const birdId = retData[0];
                Game.instance.onUseDuZka(birdId, card_token, expire);
                cc.log("retData --- ", retData);
            } else {
                Game.instance.showHintUI(HintUIType.Failure, callMsg['msg']);
            }
        };
        NetMgr._onEvent(WebCmd.CMD_USER_USERCARD_DUZ_RSP, callbackF);
    }

    sendExitMsg() {
        const exitParam = {
            "cmd": WebCmd.CMD_USER_EXITGAME_REQ,
            "token": VVMgr.token, 
            "type": VVMgr.gameType,
            "group": VVMgr.group
        };
        NetMgr._send(exitParam);
    }
}
