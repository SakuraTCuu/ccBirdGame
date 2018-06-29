
const {ccclass, property} = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    @property(cc.Node)
    loadingImgNode: cc.Node = null;

    _isShow = false;
    _anim: cc.Animation = null;

    show() {
        if (this._isShow) return;

        this._isShow = true;
        this.node.active = true; 
        if (this._anim == null) {
            this._anim = this.loadingImgNode.getComponent(cc.Animation);
        }
        this._anim.play();
    }

    isShowing() {
        cc.log("Loading isShowing --- ", this._isShow);
        return this._isShow;
    }

    hide() {
        this._isShow = false;
        this._anim.stop();
        this.node.active = this._isShow; 
    }
}
