import AnySDKMgr from "./AnySDKMgr";
import AudioMgr from "./AudioMgr";
import { GameType, GameState } from "../Const";
import { BirdInfo } from "../game/BirdConfig";
import { UserInfo, BatteryInfo } from "../hall/HallModel";

export default class VVMgr {
    static userId: string = null;
    static token: string = null;

    static version: string = null;
    static resource_host: string = null;

    static group: string = null;
    static userInfo: UserInfo = null;

    static otherUserInfoArr: UserInfo[] = null;
    static birdInfoArr: BirdInfo[] = null;
    static batteryInfoArr: BatteryInfo[] = null;
            
    static gameType: GameType;
    

    //{'100001':{nickname:xxx,ip:xxx,sex:xxx,avatar:xxx,id:xxx}, }
    static gameUserInfoMap: any;
    //{'100001':0, }
    static gameUserIdsIndexMap: any;
    static gameUserIdsArr: Array<string>;

    static gameState = GameState.Idle;

    //赔率
    static loss = 2.2;

    static dataEventHandler: cc.Node; 
    
    static audioMgr: AudioMgr;    
    static sdkMgr: AnySDKMgr;

    //node事件传递
    static dispatchEvent(event: string, data: any) {
        if (VVMgr.dataEventHandler && VVMgr.gameState != GameState.Pause) {
            //http://www.cocos.com/docs/creator/scripting/events.html
            VVMgr.dataEventHandler.emit(event, data);
        }
    }

    // static willChangeGame() {
    //     VVMgr.willChangingFlag = true;
    //     VVMgr.gameState = GameState.Zhangting;
    //     cc.director.loadScene('start');
    // }

    // static getGameScene() {
    //     let scene = null;
    //     if (this.gameType == GameType.NN) {
    //         scene = 'nngame';
    //     } else if (this.gameType == GameType.ZJH) {
    //         scene = 'zjhgame';
    //     } else if (this.gameType == GameType.YZ) {
    //         scene = 'yzgame';
    //     }
    //     return scene;
    // }

    //URL解析
    static urlParse() {
        const params = {};
        if (window.location == null) {
            return params;
        }
        
        let str = window.location.href; //取得整个地址栏
        let num = str.indexOf("?") 
        str = str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
    
        let name;
        let value; 
        const arr = str.split("&"); //各个参数放到数组里
        const length = arr.length;
        for (let i = 0; i < length; i++) { 
            num = arr[i].indexOf("="); 
            if (num > 0) { 
                name = arr[i].substring(0, num);
                value = arr[i].substr(num+1);
                params[name] = value;
            } 
        }
        return params;
    }

    static randomIndex(num) { //0<= x < num取值
        return Math.floor(Math.random() * num);
    }
}
