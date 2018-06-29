import HallMine_address from "./HallMine_address";
import { addressInfo } from "../../HallModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallMine_address_item extends cc.Component {

    @property(cc.Node)  //默认地址选择
    defaultAddress_select: cc.Node = null;

    @property(cc.Node) //默认地址未选中
    defaultAddress_normal: cc.Node = null;

    @property(cc.Label) //名字lab
    nameLab: cc.Label = null;

    @property(cc.Label) //手机label
    phoneLab: cc.Label = null;

    @property(cc.Label) //地址lebel
    addressLab: cc.Label = null;

    @property(cc.Node)  //编辑地址
    editNode: cc.Node = null;

    @property(cc.Node) //删除地址
    deleteNode: cc.Node = null;


    _data: addressInfo = null;

    // _setDefaultAddressFun: Function = null;
    // _deleteAddressFun: Function = null;
    // _editAddressFun: Function = null;
    _addressJs: HallMine_address = null;

    onLoad() {
        this.editNode.on(cc.Node.EventType.TOUCH_END, this.editAdress, this);
        this.deleteNode.on(cc.Node.EventType.TOUCH_END, this.deleteAdress, this);

        // this.defaultAddress_select.on(cc.Node.EventType.TOUCH_END, this.selectDefault, this);
        this.defaultAddress_normal.on(cc.Node.EventType.TOUCH_END, this.selectDefault, this);
    }

    //选择默认地址
    selectDefault() {
        let address_id = this._data.id;
        if (this._addressJs) {
            this._addressJs && this._addressJs.setDefaultAddressMsg(address_id);
        }
    }

    //编辑地址
    editAdress(event) {
        cc.log("编辑地址");
        let address_id = this._data.id;
        if (this._addressJs) {
            this._addressJs && this._addressJs.editAddressCtr(address_id);
        }
    }

    //删除地址
    deleteAdress(event) {
        cc.log("弹出确定删除");
        let address_id = this._data.id;
        if (this._addressJs) {
            this._addressJs && this._addressJs.deleteAddressMsg(address_id);
        }
    }

    //设置回调函数
    /**
     * 
     * @param fun1  设置默认地址
     * @param fun2  删除地址
     * @param fun3  编辑地址
     */
    //, fun1: Function, fun2: Function, fun3: Function
    setFun(addreddJs: HallMine_address) {
        // this._setDefaultAddressFun = fun1;
        // this._deleteAddressFun = fun2;
        // this._editAddressFun = fun3;
        this._addressJs = addreddJs;
    }

    setData(data: addressInfo) {
        this._data = data;
        if (data.is_default == 1) {
            this.defaultAddress_select.active = true;
            this.defaultAddress_normal.active = false;
        } else {
            this.defaultAddress_select.active = false;
            this.defaultAddress_normal.active = true;
        }

        this.nameLab.string = data.name;
        this.phoneLab.string = data.mobile;
        this.addressLab.string = data.address;
    }

    onDestroy() {
        this._addressJs = null;
        this._data = null;
    }
}
