import { addressInfo } from "../../HallModel";
import Hall from "../../Hall";
import HallMine_mybox_address_item from "./HallMine_mybox_address_item";
import HallMine_mybox from "./HallMine_mybox";
import { HintUIType } from "../../../HintUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallMine_mybox_address extends cc.Component {

    @property(cc.Node)
    contentNode: cc.Node = null;

    @property(cc.Prefab)
    addressItem: cc.Prefab = null;

    @property(cc.Node)
    address_null_Node: cc.Node = null;

    @property(cc.Node)
    address_confirmBtn: cc.Node = null;

    @property(cc.Node)
    address_addBtn: cc.Node = null;

    _clickId: number = null;//点击的哪一个地址
    // _data: Array<addressInfo> = null; //地址列表
    _myboxJs: HallMine_mybox = null; //脚本引用
    _flag: boolean = false; //是否有地址


    onEnable() {
        this._clickId = null;
        this._flag = false;
    }

    setData(myboxJs: HallMine_mybox, data: Array<addressInfo>) {
        this._myboxJs = myboxJs;
        if (data.length <= 0) {
            this._flag = false;
            cc.log("空空如也");
            Hall.instance.showHintUI(HintUIType.Failure,"你还没有添加收货地址哦!");
            this.address_null_Node.active = true;
            this.address_confirmBtn.active = false;
            this.address_addBtn.active = true;
            this.contentNode.removeAllChildren();
            // return
        } else {
            this._flag = true;
            this.address_confirmBtn.active = true;
            this.address_addBtn.active = false;
            this.address_null_Node.active = false;
            this.contentNode.removeAllChildren();
            for (let i = 0; i < data.length; i++) {
                let item = cc.instantiate(this.addressItem);
                item.name = data[i].id + "";
                let item_ts = item.getComponent(HallMine_mybox_address_item);
                item_ts.setData(data[i]);
                item.on(cc.Node.EventType.TOUCH_END, () => {
                    this._clickId = data[i].id;
                    this.refreshUi();
                }, this)
                this.contentNode.addChild(item);
            }
        }
    }

    //地址更换 刷新ui
    refreshUi() {
        let len = this.contentNode.childrenCount;
        for (let i = 0; i < len; i++) {
            let id = Number(this.contentNode.children[i].name);
            let item_ts = this.contentNode.children[i].getComponent(HallMine_mybox_address_item);
            if (id == this._clickId) {//点击的
                item_ts.showSelect(1);
            } else {
                item_ts.showSelect(0);
            }
        }
    }

    //确定地址
    onClickConfirmBtn() {
        if (!this._clickId) {
            cc.log("请先选择收货地址");
            Hall.instance.showHintUI(HintUIType.Failure,"请先选择收货地址");
        } else {
            this._myboxJs.goodsApplyMsg(this._clickId);
        }
    }

    //跳转到添加地址ui
    onClickAddBtn() {
        if (!this._flag) {
            //跳转
            this._myboxJs.showAddressNode();
            this.onClickCloseBtn();
        } else {
            cc.log("已经有地址了哦");
        }
    }

    //关闭ui
    onClickCloseBtn() {
        this.node.active = false;
    }

    //展示ui
    showNode() {
        this.node.active = true;
    }

    onDestroy() {
        this._myboxJs = null;
    }
}
