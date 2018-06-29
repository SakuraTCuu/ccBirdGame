import HTTPMgr from "../core/HTTPMgr";
import { HTTPPath } from "../Const";
import Login from "./Login";
import { HintUIType } from "../HintUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginMobile extends cc.Component {

    @property(cc.EditBox)
    phoneBox: cc.EditBox = null;
    @property(cc.EditBox)
    codeBox: cc.EditBox = null;

    @property(cc.Node)
    codeBtnNode: cc.Node = null;
    @property(cc.Node)
    codeTimeNode: cc.Node = null;
    @property(cc.Label)
    timeLabel: cc.Label = null;

    private _isTiming = false;
    private _time = 60;

    onLoginClick() {
        if (this.phoneBox.string == "" || this.codeBox.string == "") {
            cc.log("Mobile or Code empty");
            return;
        }
        const param = {
            mobile: this.phoneBox.string,
            code: this.codeBox.string
        }
        this.node.active = false;
        this.node.parent.getComponent(Login).doLogin(param);
    }

    onRegisterClick() {
        this.node.active = false;
        this.node.parent.getComponent(Login).doRegister();
    }

    onCodeClick() {
        if (this.phoneBox.string == "") {
            cc.log("Mobile empty");
            return;
        }
        const available = Login.instance.isPoneAvailable(this.phoneBox.string)
        if (!available) {
            Login.instance.showHintUI(HintUIType.Failure, '手机号码格式不对');
            return;
        }
        const param = {
            mobile: this.phoneBox.string
        }
        if (this._isTiming) return;
        this._isTiming = true;
        HTTPMgr.post(HTTPPath.LOGINSMS, param).then(() => {
            this.doStartTime();
        }).catch((err) => {
            this._isTiming = false;
            Login.instance.showHintUI(HintUIType.Failure, err['msg']);
            cc.error("---err----" + err);
        });
    }

    doStartTime() {
        this._time = 60;
        this.codeBtnNode.active = false;
        this.codeTimeNode.active = true;
        this.schedule(() => {
            this.timeLabel.string = this._time + "S";
            this._time--;
            if (this._time == 0) {
                this._isTiming = false;
                this.codeBtnNode.active = true;
                this.codeTimeNode.active = false;
            }
        }, 1, 60);
    }

    onCloseClick() {
        this.node.active = false;
    }
}
