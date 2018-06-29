import VVMgr from "../core/VVMgr";
import { UserInfo } from "../hall/HallModel";
import Game from "./Game";
import GameNetCtr from "./GameNetCtr";

const {ccclass, property} = cc._decorator;

interface RobotUserInfo {
    user_id: string;
    encrypt_uid: string;
    nickname: string;
    r: string;
    pic: string;
};

@ccclass
export default class GamePTCtr extends cc.Component {

    @property(cc.Node)
    gameNode: cc.Node = null;
    @property(cc.Node)
    weaponMyNode: cc.Node = null;
    @property(cc.Sprite)
    weaponMySprite: cc.Sprite = null;

    @property(cc.Label)
    bulletLabel: cc.Label = null;
    @property(cc.Label)
    silverLabel: cc.Label = null;
    @property(cc.Label)
    goldLabel: cc.Label = null;

    _robotUserInfoArr = new Array<RobotUserInfo> ();

    weaponLevel: number = 1;
    total: number = 9;
    fireAnim: cc.Animation = null;

    _weaponUserNodeMap = {};

    private static _instance: GamePTCtr = null;
    public static get instance(): GamePTCtr {
        return GamePTCtr._instance;
    }

    onLoad () {
        GamePTCtr._instance = this;

        // this.fireAnim = this.fireNode.getComponent(cc.Animation);
        // this.fireAnim.on("finished", this.onFireAnimFinished, this);

        cc.log("GamePTCtr onLoad");

        this.refreshBulletInfo();
        this.refreshWeaponInfo();

        this.schedule(this.robotShot, 5, cc.macro.REPEAT_FOREVER);
    }

    onDestroy () {
        this.unschedule(this.robotShot);
    }

    robotShot() {
        // cc.log('---GamePTCtr robotShot---');
        const length = this._robotUserInfoArr.length;
        if (length < 1) return;
        const index = VVMgr.randomIndex(length);
        const robotUserInfo = this._robotUserInfoArr[index];
        cc.info('---GamePTCtr robotShot---', robotUserInfo);
        GameNetCtr.instance.sendRobotMsg(robotUserInfo.encrypt_uid);
    }

    // onFireAnimFinished() {
    //     this.fireNode.active = false;
    // }

    refreshBulletInfo() {
        cc.log("refreshBulletInfo ---", VVMgr.userInfo);
        this.silverLabel.string = VVMgr.userInfo.silver + "";
        this.goldLabel.string = VVMgr.userInfo.gold + "";
    }

    refreshWeaponInfo() {
        this.gameNode.getChildByName("pt1").active = false;
        this.gameNode.getChildByName("pt2").active = false;
        this.gameNode.getChildByName("pt3").active = false;
        this.gameNode.getChildByName("pt4").active = false;

        let otherLength = VVMgr.otherUserInfoArr.length;//10 3
        for(let i = otherLength - 1; i >= 0; i--) {
            const index = otherLength - i;
            if (index > 4) break;
            cc.log("---refreshWeaponInfo---", index);
            const node = this.gameNode.getChildByName("pt" + index);
            node.active = true;

            const info = VVMgr.otherUserInfoArr[i];
            if (info.ptLevel == undefined) info.ptLevel = 1;
            cc.log("---refreshWeaponInfo---", info.ptLevel);
            const sp = Game.instance.gameAtlas.getSpriteFrame("paota_" + info.ptLevel);
            node.getChildByName('weapon').getComponent(cc.Sprite).spriteFrame = sp;

            this._weaponUserNodeMap[info.user_id] = node;
        }
    }

    receiveUserIn(callMsg) {
        if (callMsg['r'] != null && callMsg['r'] == 1) {
            const robotUserInfo = <RobotUserInfo>callMsg;
            this._robotUserInfoArr.push(robotUserInfo);
        }

        const userInfo = <UserInfo>callMsg;

        const length = VVMgr.otherUserInfoArr.length;
        let isExist = false;
        let info = null;
        for (let i = 0; i < length; i++) {
            info = VVMgr.otherUserInfoArr[i];
            if (info.user_id == userInfo.user_id) {
                isExist = true;
                break;
            }
        }
        if (!isExist) { //不存在
            VVMgr.otherUserInfoArr.push(userInfo);
            this.refreshWeaponInfo();
        }
    }

    receiveUserExit(callMsg) {
        const userInfo = <UserInfo>callMsg;

        const length = VVMgr.otherUserInfoArr.length;
        let i = 0;
        let info = null;
        for (; i < length; i++) {
            info = VVMgr.otherUserInfoArr[i];
            if (info.user_id == userInfo.user_id) break;
        }
        VVMgr.otherUserInfoArr.splice(i, 1);
        this.refreshWeaponInfo();
    }

    getMyWeapon() {
        return this.weaponMyNode;
    }

    getWhoWeapon(userId: string) {
        return this._weaponUserNodeMap[userId];
    }

    updateWhoWeapon(userId: string, ptLevel: number) {
        const weapon = this._weaponUserNodeMap[userId];
        const sp = Game.instance.gameAtlas.getSpriteFrame("paota_" + ptLevel);
        weapon.getChildByName('weapon').getComponent(cc.Sprite).spriteFrame = sp;

        let otherLength = VVMgr.otherUserInfoArr.length;
        otherLength = otherLength > 4 ? 4 : otherLength;
        for(let i = 0; i < otherLength; i++) {
            const info = VVMgr.otherUserInfoArr[i];
            if (info.user_id == userId) {
                info.ptLevel = ptLevel;
                break;
            }
        }
    }

    getWeaponInfo() {
        return VVMgr.batteryInfoArr[this.weaponLevel-1];
    }

    onPlus() {
        if (this.weaponLevel == this.total) return;
        this.weaponLevel++;
        this.updateBulletInfo();
    }

    onMinus() {
        if (this.weaponLevel == 1) return;
        this.weaponLevel--;
        this.updateBulletInfo();
    }

    updateBulletInfo() {
        this.weaponMySprite.spriteFrame = Game.instance.gameAtlas.getSpriteFrame("paota_" + this.weaponLevel);
        const batteryInfo = this.getWeaponInfo();
        this.bulletLabel.string = "每次" + batteryInfo.base_bullet*batteryInfo.level + "发";
    }
}
