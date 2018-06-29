import HallMine_address from "./HallMine_address";
import Hall from "../../Hall";
import VVMgr from "../../../core/VVMgr";
import HTTPMgr from "../../../core/HTTPMgr";
import { HintUIType } from "../../../HintUI";

const { ccclass, property } = cc._decorator;

export interface provinceInfo {
    id: number,
    cityname: string,
    parentid: number
}


@ccclass
export default class HallMine_address_edit extends cc.Component {

    @property(cc.Prefab)
    city_item: cc.Prefab = null;

    @property(cc.Node)
    title_add: cc.Node = null;

    @property(cc.Node)
    title_edit: cc.Node = null;

    @property(cc.Node)
    btn_add: cc.Node = null;

    @property(cc.Node)
    btn_edit: cc.Node = null;

    @property(cc.Node)
    province_show_btn: cc.Node = null;

    @property(cc.Node)
    city_show_btn: cc.Node = null;

    @property(cc.Node)
    province_show: cc.Node = null;

    @property(cc.Node)
    province_content: cc.Node = null;

    @property(cc.Node)
    city_show: cc.Node = null;

    @property(cc.Node)
    city_show_content: cc.Node = null;

    @property(cc.EditBox)
    name_editbox: cc.EditBox = null;

    @property(cc.EditBox)
    phone_editbox: cc.EditBox = null;

    @property(cc.EditBox)
    address_editbox: cc.EditBox = null;

    _addressJs: HallMine_address = null;  //HallMine_address脚本
    _adress_id: number = null;            //编辑地址 id

    _provinceData: Array<provinceInfo> = new Array();
    _cityData: Array<provinceInfo> = new Array();
    _provinceId: number = null; //省份id
    _cityId: number = null;   //城市id

    _oneAddressData: any = null;  //一个收货地址的数据

    _province_cityInfo: any = null; //省份和城市的数据列表
    onLoad() {
        this.btn_add.on(cc.Node.EventType.TOUCH_END, this.touchEndAdd, this);
        this.btn_edit.on(cc.Node.EventType.TOUCH_END, this.touchEndEdit, this);

        this.province_show_btn.on(cc.Node.EventType.TOUCH_END, this.provinceShow, this);
        this.city_show_btn.on(cc.Node.EventType.TOUCH_END, this.cityShow, this);
    }

    //隐藏 重置属性
    onClickCloseBtn() {
        this.name_editbox.string = "";
        this.phone_editbox.string = "";
        this.address_editbox.string = "";
        this.province_show_btn.getComponent(cc.Label).string = "请选择";
        this.city_show_btn.getComponent(cc.Label).string = "请选择";
        this._provinceId = null;
        this._cityId = null;
        this.node.active = false;
    }

    //增加地址
    touchEndAdd() {
        let nameStr = this.name_editbox.string;
        let phoneStr = this.phone_editbox.string;
        let addressStr = this.address_editbox.string;
        cc.log(nameStr);
        if (nameStr == "" && nameStr.length <= 0) {
            cc.log("名字不符合要求");
            Hall.instance.showHintUI(HintUIType.Failure,"请填写名字");
            return;
        }
        if (phoneStr == "" && phoneStr.length <= 0) {
            // cc.log("手机号不符合要求");
            Hall.instance.showHintUI(HintUIType.Failure,"请填写手机号");
            return;
        }
        if (addressStr == "" && addressStr.length <= 0) {
            // cc.log("地址不符合要求");
            Hall.instance.showHintUI(HintUIType.Failure,"请填写地址");
            return;
        }

        if (this._cityId == null) {
            // cc.log("请选择城市");
            Hall.instance.showHintUI(HintUIType.Failure,"请选择城市");
            return;
        }

        if (this._provinceId == null) {
            // cc.log("请选择省份");
            Hall.instance.showHintUI(HintUIType.Failure,"请选择省份");
            return;
        }

        const data = {
            name: nameStr,
            mobile: phoneStr,
            province: this._provinceId,
            city: this._cityId,
            address: addressStr
        };
        cc.log(data);
        if (this._addressJs) {
            this._addressJs.addAddressMsg(data);
        }

        this.onClickCloseBtn();
    }

    //编辑地址
    touchEndEdit() {
        let nameStr = this.name_editbox.string;
        let phoneStr = this.phone_editbox.string;
        let addressStr = this.address_editbox.string;
        if (nameStr == "" && nameStr.length <= 0) {
            cc.log("名字不符合要求");
            Hall.instance.showHintUI(HintUIType.Failure,"请填写名字");
            return;
        }
        if (phoneStr == "" && phoneStr.length <= 0) {
            // cc.log("手机号不符合要求");
            Hall.instance.showHintUI(HintUIType.Failure,"请填写手机号");
            return;
        }

        if (phoneStr.length != 11) {
            // cc.log("手机号不符合要求");
            Hall.instance.showHintUI(HintUIType.Failure,"请填写正确的手机号");
            return;
        }

        if (addressStr == "" && addressStr.length <= 0) {
            // cc.log("地址不符合要求");
            Hall.instance.showHintUI(HintUIType.Failure,"请填写地址");
            return;
        }

        if (this._cityId == null) {
            // cc.log("请选择城市");
            Hall.instance.showHintUI(HintUIType.Failure,"请选择城市");
            return;
        }

        if (this._provinceId == null) {
            // cc.log("请选择省份");
            Hall.instance.showHintUI(HintUIType.Failure,"请选择省份");
            return;
        }

        const data = {
            name: nameStr,
            mobile: phoneStr,
            province: this._provinceId,
            city: this._cityId,
            address: addressStr,
            id: this._adress_id
        };
        if (this._addressJs) {
            this._addressJs.editAddressSendMsg(data);
        }
        this.onClickCloseBtn();
    }

    //请求省份列表
    provinceShow() {
        this.province_show.active = true;
        if (this._province_cityInfo) {
            this.showProvince();
        } else {
            let url = VVMgr.resource_host + "json/city_json.json?version=" + VVMgr.version;
            cc.log(url);
            //请求城市列表
            HTTPMgr.get2(url).then(info => {
                this._province_cityInfo = info;
                this.parseJsonData(info);
                this.showProvince();
            }).catch((err) => {
                cc.error("---err----" + err);
            });
        }
    }

    //展示省份列表
    showProvince() {
        this.province_content.removeAllChildren();
        let len = this._provinceData.length;
        for (let i = 0; i < len; i++) {
            let item = cc.instantiate(this.city_item);
            this.province_content.addChild(item);
            item.getChildByName("city_name").getComponent(cc.Label).string = this._provinceData[i].cityname;
            item.on(cc.Node.EventType.TOUCH_END, () => {
                this._provinceId = this._provinceData[i].id;
                this.province_show_btn.getComponent(cc.Label).string = this._provinceData[i].cityname;
                this.province_show.active = false;
            }, this);
        }
    }

    //展示城市列表
    cityShow() {
        this.city_show_content.removeAllChildren();
        if (!this._provinceId) {
            // cc.log("请先选择省份");
            Hall.instance.showHintUI(HintUIType.Failure,"请先选择省份");
            return;
        }
        this.city_show.active = true;

        let newList: Array<provinceInfo> = new Array();
        for (let i = 0; i < this._cityData.length; i++) {
            if (this._cityData[i].parentid == this._provinceId) {
                cc.log(this._cityData[i].parentid);
                //避免重复的!
                newList.push(this._cityData[i]);
            }
        }

        for (let i = 0; i < newList.length; i++) {
            let item = cc.instantiate(this.city_item);
            this.city_show_content.addChild(item);
            item.getChildByName("city_name").getComponent(cc.Label).string = newList[i].cityname;
            item.on(cc.Node.EventType.TOUCH_END, () => {
                this._cityId = newList[i].id;
                this.city_show_btn.getComponent(cc.Label).string = newList[i].cityname;
                this.city_show.active = false;
                newList.length = 0;
            }, this);
        }
    }

    setFun(addressJs: HallMine_address) {
        this._addressJs = addressJs;
    }

    //type  1表示添加 2表示修改
    setData(type: number, adress_id: number = null, data: any = null) {
        if (type == 1) { //增加地址
            this.title_add.active = true;
            this.btn_add.active = true;
            this.title_edit.active = false;
            this.btn_edit.active = false;
        } else {
            this._adress_id = adress_id;

            this.title_edit.active = true;
            this.btn_edit.active = true;
            this.title_add.active = false;
            this.btn_add.active = false;

            this._oneAddressData = data;
            this.showDefaultData();
        }
    }

    //展示默认数据
    showDefaultData() {
        if (this._oneAddressData) {
            this.name_editbox.string = this._oneAddressData.name;
            this.phone_editbox.string = this._oneAddressData.mobile;
            this.address_editbox.string = this._oneAddressData.address;
            this.city_show_btn.getComponent(cc.Label).string = this._oneAddressData.city;
            this.province_show_btn.getComponent(cc.Label).string = this._oneAddressData.province;
            this._provinceId = this._oneAddressData.province_id;
            this._cityId = this._oneAddressData.city_id;
        }
    }

    showNode() {
        this.node.active = true;
    }

    //解析json 分离省份和城市
    parseJsonData(data: any) {
        let len = data.length;
        for (let i = 0; i < len; i++) {
            if (data[i]["parentid"] == 1) {  //省份
                this._provinceData.push(data[i]);
            } else {
                this._cityData.push(data[i]);
            }
        }
    }

    onDestroy() {
        this._addressJs = null;
    }
}
