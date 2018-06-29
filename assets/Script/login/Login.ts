import VVMgr from "../core/VVMgr";
import AnySDKMgr from "../core/AnySDKMgr";
import AudioMgr from "../core/AudioMgr";
import HTTPMgr from "../core/HTTPMgr";
import Progress from "../Progress";
import { HTTPPath, NotifyPath, LoginType } from "../Const";
import { UserInfo } from "../hall/HallModel";
import Loading from "../Loading";
import HintUI, { HintUIType } from "../HintUI";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Login extends cc.Component {

    @property(cc.Prefab)
    loginMobilePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    registerMobilePrefab: cc.Prefab = null;

    loginMobileNode: cc.Node = null;
    registerMobileNode: cc.Node = null;

    @property(cc.Node)
    contentNode: cc.Node = null;

    @property(cc.Node)
    loadingNode: cc.Node = null;
    @property(cc.Node)
    progressNode: cc.Node = null;
    @property(cc.Node)
    hintUINode: cc.Node = null;

    private static _instance: Login = null;
    public static get instance(): Login {
        return Login._instance;
    }

    onLoad() {
        Login._instance = this;

        this.initVVMgr();

        const token = cc.sys.localStorage.getItem("token");
        const tokenExpire = cc.sys.localStorage.getItem("tokenExpire");

        let willLogin = false;

        //token是否有效
        if (token != undefined && tokenExpire != undefined) {
            cc.log("Login delta --- ", tokenExpire - Date.now());
            if (tokenExpire - Date.now() > 0) {
                willLogin = true;
            }
        }

        cc.log("Login token --- ", token);
        cc.log("Login tokenExpire --- ", tokenExpire);
        cc.log("Login willLogin --- ", willLogin);

        if (willLogin) { //token有效 获取用户信息
            this.contentNode.active = false;

            VVMgr.token = token;
            VVMgr.userId = cc.sys.localStorage.getItem("userId");

            this.requestUserInfo(true);
        } else {
            this.contentNode.active = true;
        }

        this.node.on(NotifyPath.ThirdLogin, (data) => {
            this.thirdLogin(data.detail);
        });
    }

    start() {
        VVMgr.dataEventHandler = this.node;
    }

    onDestroy() {
        cc.info("Login onDestroy");

        VVMgr.dataEventHandler = null;
    }

    initVVMgr() {
        if (VVMgr.sdkMgr == null) {
            VVMgr.audioMgr = new AudioMgr();
            VVMgr.sdkMgr = new AnySDKMgr();
        }
    }

    //获取用户信息
    requestUserInfo(init = false) {
        this.showLoading();
        HTTPMgr.get(HTTPPath.USERINFO).then((info) => {
            const userInfo = <UserInfo>info["data"];
            VVMgr.userInfo = userInfo;
            this.requestSystemInfo();
            this.doLoadScene();
        }).catch(err => {
            this.hideLoading();
            if (init) {
                this.contentNode.active = true;
            }
            cc.error("---err----" + err);
            this.showHintUI(HintUIType.Failure, err['msg']);
        });
    }

    //获取版本号
    requestSystemInfo() {
        let type = 0;
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            type = 2;
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            type = 1;
        } else if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            type = 3;
        }
        //TODO  系统版本号后期必须修改  web默认是Android ============================
        if (type == 0) {
            type = 2;
        }

        const param = {
            type: type,
        }

        //请求当前版本号
        HTTPMgr.get(HTTPPath.GETSYSTEMVERSION, param).then((info) => {
            const versionData = info["data"];
            VVMgr.version = versionData["version"];
            VVMgr.resource_host = versionData["resource_host"];
        }).catch(err => {
            cc.error("---err----" + err);
            this.showHintUI(HintUIType.Failure, err['msg']);
        });
    }

    onMobileLogin() {
        if (this.loginMobileNode == null) {
            this.loginMobileNode = cc.instantiate(this.loginMobilePrefab);
            this.node.addChild(this.loginMobileNode);
        }
        this.loginMobileNode.active = true;
        this.loginMobileNode.opacity = 100;
        const fadeAnim = this.loginMobileNode.getComponent(cc.Animation);
        fadeAnim.play();
    }

    /**
     * 执行登录
     * @param param 
     */
    doLogin(param) {
        if (param == null || Object.keys(param).length < 1) {
            cc.warn("doLogin param empty");
            return;
        }
        this.showLoading();
        HTTPMgr.post(HTTPPath.LOGIN, param).then((info) => {
            this.doParseInfo(info["data"]);
            this.requestUserInfo();
        }).catch((err) => {
            cc.error("---err----" + err);
            this.hideLoading();
            this.showHintUI(HintUIType.Failure, err['msg']);
        });
    }

    /**
     * 解析用户信息
     * @param data 
     */
    doParseInfo(data) {
        VVMgr.token = data["token"];
        VVMgr.userId = data["user_id"];
        cc.log("doParseInfo VVMgr.token --- ", VVMgr.token);
        cc.sys.localStorage.setItem('token', VVMgr.token);
        cc.sys.localStorage.setItem('userId', VVMgr.userId);
        cc.sys.localStorage.setItem('tokenExpire', Date.now() + 24 * 60 * 60 * 1000);
    }

    /**
     * 加载场景
     */
    doLoadScene() {
        this.hideLoading();
        this.doProgressLoad();
        VVMgr.sdkMgr.notifyNativeToken(VVMgr.token);
        cc.director.preloadScene('hall', (err) => {
            this.scheduleOnce(() => {
                this.stopProgressLoad();
                cc.director.loadScene('hall');
            }, 2);
        });
    }

    onVisitorLogin() {

    }

    onQQLogin() {
        VVMgr.sdkMgr.notifyNativeLogin(LoginType.QQ);
    }

    onWXLogin() {
        VVMgr.sdkMgr.notifyNativeLogin(LoginType.WX);
    }

    /**
     * 注册页面
     */
    doRegister() {
        if (this.registerMobileNode == null) {
            this.registerMobileNode = cc.instantiate(this.registerMobilePrefab);
            this.node.addChild(this.registerMobileNode);
        }
        this.registerMobileNode.active = true;
        this.registerMobileNode.opacity = 100;
        const fadeAnim = this.registerMobileNode.getComponent(cc.Animation);
        fadeAnim.play();
    }

    doRegisterAction(param) {
        if (param == null || Object.keys(param).length < 1) {
            cc.warn("doLogin param empty");
            return;
        }
        this.showLoading();
        HTTPMgr.post(HTTPPath.REGISTER, param).then((info) => {
            this.doParseInfo(info["data"]);
            this.requestUserInfo();
        }).catch((err) => {
            cc.error("---err----" + err);
            this.hideLoading();
            this.showHintUI(HintUIType.Failure, err['msg']);
        });
    }

    thirdLogin(data) {
        if (Object.keys(data).length < 1) {
            this.showHintUI(HintUIType.Failure, "第三方登录失败");
        } else {
            this.doParseInfo(data);
            this.requestUserInfo();
        }
    }
    // -----------     tool method     -----------     
    showLoading() {
        const loadingJS = this.loadingNode.getComponent(Loading);
        if (loadingJS.isShowing()) return false;
        loadingJS.show();
        return true;
    }

    hideLoading() {
        const loadingJS = this.loadingNode.getComponent(Loading);
        loadingJS.hide();
    }

    doProgressLoad() {
        this.contentNode.active = false;
        this.progressNode.getComponent(Progress).show();
    }

    stopProgressLoad() {
        this.contentNode.active = true;
        this.progressNode.getComponent(Progress).hide();
    }

    showHintUI(hintUIType: HintUIType, msg?: string) {
        const failureJS = this.hintUINode.getComponent(HintUI);
        if (failureJS.isShowing()) return false;
        failureJS.show(hintUIType, msg);
        return true;
    }

    isPoneAvailable(str) {
        const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!phoneReg.test(str)) {
            return false;
        } else {
            return true;
        }
    }
}
