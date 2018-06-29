import VVMgr from "../core/VVMgr";
import NetMgr from "../core/NetMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallSetting extends cc.Component {

    @property(cc.Slider)
    yinxiaoSlider: cc.Slider = null;

    @property(cc.Node)
    yinxiaoProgressNode: cc.Node = null;

    @property(cc.Slider)
    yinyueSlider: cc.Slider = null;

    @property(cc.Node)
    yinyueProgressNode: cc.Node = null;

    _progressWidth: number = 396;
    
    onLoad () {
        // this._progressWidth = this.yinxiaoSlider.node.width;
        this.yinxiaoSlider.progress = VVMgr.audioMgr.sfxVolume;
        this.yinxiaoProgressNode.width = this.yinxiaoSlider.progress*this._progressWidth;
        this.yinyueSlider.progress = VVMgr.audioMgr.bgmVolume;
        this.yinyueProgressNode.width = this.yinyueSlider.progress*this._progressWidth;
    }

    showNode() {
        this.node.active = true;
        this.node.opacity = 100;
        const fadeAnim = this.node.getComponent(cc.Animation);
        fadeAnim.play();
    }
    
    onCloseClick() {
        this.node.active = false;
    }

    onYinxiaoSlided() {
        cc.log('yinxiaoSlider --- ', this.yinxiaoSlider.progress);
        VVMgr.audioMgr.setSFXVolume(this.yinxiaoSlider.progress);
        this.yinxiaoProgressNode.width = this.yinxiaoSlider.progress*this._progressWidth;
    }

    onYinyueSlided() {
        VVMgr.audioMgr.setBGMVolume(this.yinyueSlider.progress);
        this.yinyueProgressNode.width = this.yinyueSlider.progress*this._progressWidth;
    }

    onChageAccountClick() {
        cc.sys.localStorage.setItem('token', null);
        cc.sys.localStorage.setItem('userId', null);
        cc.sys.localStorage.setItem('tokenExpire', null);
        //断开websocket
        NetMgr._close();
        cc.director.loadScene('login');
    }
}
