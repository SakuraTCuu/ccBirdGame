
const {ccclass, property} = cc._decorator;

@ccclass
export default class Progress extends cc.Component {

    @property(cc.Node)
    iconNode: cc.Node = null;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    _isShow = false;
    _anim: cc.Animation = null;

    show() {
        if (this._isShow) return;

        this._isShow = true;
        this.node.active = true; 
        if (this._anim == null) {
            this._anim = this.iconNode.getComponent(cc.Animation);
        }
        this.iconNode.x = -170;
        this.progressBar.progress = 0;
        
        this._anim.play();
        this.schedule(() => {
            this.progressBar.progress += 0.05;
            this.iconNode.x = this.progressBar.node.width * this.progressBar.progress - 170;
        }, 0.1, 20);
    }

    hide() {
        this._isShow = false;
        this._anim.stop();
        this.node.active = this._isShow; 
    }
}
