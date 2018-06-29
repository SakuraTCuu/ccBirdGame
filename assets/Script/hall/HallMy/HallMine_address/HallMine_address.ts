
import HallMine_address_edit from "./HallMine_address_edit";
import { addressInfo } from "../../HallModel";
import { HTTPPath } from "../../../Const";
import HTTPMgr from "../../../core/HTTPMgr";
import Hall from "../../Hall";
import HallMine_address_item from "./HallMine_address_item";
import { HintUIType } from "../../../HintUI";

const { ccclass, property } = cc._decorator;

export enum EditType {
    edit,
    delete,
    add,
    setDefault,
}

@ccclass
export default class HallMine_address extends cc.Component {

    @property(cc.Node)
    contentNode: cc.Node = null;

    //地址条目
    @property(cc.Prefab)
    addressItem: cc.Prefab = null;

    //地址编辑 增加/编辑
    @property(cc.Prefab)
    addressEdit: cc.Prefab = null;

    @property(cc.Node)
    address_delete_hint: cc.Node = null;

    @property(cc.Node)
    address_null_Node: cc.Node = null;

    _addressData: Array<addressInfo> = null;

    _addressEditNode: cc.Node = null;

    _deleteAddressId: number = null;
    // private static _instance: HallMine_address = null;
    // public static get instance(): HallMine_address {
    //     return HallMine_address._instance;
    // }

    /**
     * 
     * @param flag  0 表示正常打开 ,1 表示从其他ui打开
     */
    showNode(flag: number) {
        this.node.active = true;
        // this.node.opacity = 100;
        // const fadeAnim = this.node.getComponent(cc.Animation);
        // fadeAnim.play();
        if (flag == 0) {
            this.requestInfo();
        } else {
            this.onClickAddAdressBtn();
        }
    }


    /**
     * 关闭按钮
     */
    onClickClose() {
        this.node.active = false;
    }

    /**
     * 请求服务器
     */
    requestInfo() {
        HTTPMgr.get(HTTPPath.USERGETADDRESS).then(info => {
            this.setupInfo(info["data"]);
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure, err['msg']);
            cc.error("---err----" + err);
        });
    }

    setupInfo(data) {
        cc.log(data);
        this._addressData = data;
        if (data.length <= 0) {
            cc.log("空空如也");
            Hall.instance.showHintUI(HintUIType.Failure,"你还没有添加收货地址哦!");
            this.address_null_Node.active = true;
            this.contentNode.removeAllChildren();
            // return
        } else {
            this.address_null_Node.active = false;
            this.contentNode.removeAllChildren();
            for (let i = 0; i < data.length; i++) {
                let item = cc.instantiate(this.addressItem);
                item.getComponent(HallMine_address_item).setData(data[i]);
                item.getComponent(HallMine_address_item).setFun(this);
                this.contentNode.addChild(item);
            }
        }
    }


    /**
     * 增加地址按钮
     */
    onClickAddAdressBtn() {
        cc.log("增加地址");
        if (this._addressEditNode == null) {
            this._addressEditNode = cc.instantiate(this.addressEdit);
            this.node.addChild(this._addressEditNode);
        }
        this._addressEditNode.getComponent(HallMine_address_edit).showNode();
        this._addressEditNode.getComponent(HallMine_address_edit).setData(1);
        this._addressEditNode.getComponent(HallMine_address_edit).setFun(this);
    }

    //修改默认地址
    setDefaultAddressMsg(address_id: number) {
        const param = {
            id: address_id
        };
        HTTPMgr.post(HTTPPath.USERSETDAFAULTADDRESS, param).then(info => {
            cc.log("默认地址设置成功");
            //添加地址,但不知道地址的id,需要重新请求所有地址并刷新ui
            this.requestInfo();
            //更新数据 刷新ui
            // this.refreshData(EditType.setDefault, address_id);
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure,err['msg']);
            cc.error("---err----" + err);
        });
    }

    //添加地址
    addAddressMsg(data: any) {
        cc.log(data);
        HTTPMgr.post(HTTPPath.USERADDADDRESS, data).then(info => {
            cc.log("地址添加成功");
            this.requestInfo();
            //更新数据 刷新ui
            // this.refreshData(EditType.add, 0, data);
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure,err['msg']);
            cc.error("---err----" + err);
        });

        // this._addressEditNode.active = false;
    }

    //编辑地址 发送编辑后的地址信息
    editAddressSendMsg(data: any) {
        cc.log(data);
        HTTPMgr.post(HTTPPath.USEREDITADDRESS, data).then(info => {
            cc.log("地址编辑成功");
            this.requestInfo();
            //更新数据 刷新ui
            // this.refreshData(EditType.edit, data.id, data);
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure,err['msg']);
            cc.error("---err----" + err);
        });
        // this._addressEditNode.active = false;
    }

    //编辑地址ctr
    editAddressCtr(address_id: number) {
        cc.log(address_id);
        const param = {
            id: address_id,
        };
        HTTPMgr.get(HTTPPath.USERGETONEADDRESS, param).then(info => {
            cc.log("地址获取成功");
            let data = info["data"];
            cc.log(data);
            //获取到地址信息后 开始展示ui
            if (this._addressEditNode == null) {
                this._addressEditNode = cc.instantiate(this.addressEdit);
                this.node.addChild(this._addressEditNode);
            }
            this._addressEditNode.getComponent(HallMine_address_edit).showNode();
            this._addressEditNode.getComponent(HallMine_address_edit).setData(0, address_id, data);
            this._addressEditNode.getComponent(HallMine_address_edit).setFun(this);
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure,err['msg']);
            cc.error("---err----" + err);
        });

    }

    //删除地址
    deleteAddressMsg(address_id: number) {
        //弹出删除地址确认框
        cc.log(address_id);
        this._deleteAddressId = address_id;
        this.address_delete_hint.active = true;
    }

    //删除提示框确定按钮
    onClickDeleteBtn() {
        //sendMsg
        cc.log("确定删除");
        let address_id = this._deleteAddressId;
        const param = {
            id: address_id
        };

        HTTPMgr.post(HTTPPath.USERDELETEADDRESS, param).then(info => {
            cc.log("删除地址成功");
            // this.requestInfo();
            //更新数据 刷新ui
            this.refreshData(EditType.delete, address_id);
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure,err['msg']);
            cc.error("---err----" + err);
        });

        this.address_delete_hint.active = false;
    }

    //删除提示框取消按钮
    onClickCancelBtn() {
        this.scheduleOnce(() => {
            this.address_delete_hint.active = false;
        }, 0.1);
    }

    //删除提示框x按钮
    onClickHintCloseBtn() {
        this.address_delete_hint.active = false;
    }

    //刷新默认数据
    refreshData(type: EditType, address_id: number, data: any = null) {
        if (type == EditType.setDefault) {

            let len = this._addressData.length;
            for (let i = 0; i < len; i++) {
                if (address_id == this._addressData[i].id) {
                    this._addressData[i].is_default = 1;
                } else {
                    this._addressData[i].is_default = 0;
                }
            }
        } else if (type == EditType.delete) {
            let len = this._addressData.length;
            let tempId = -1;
            for (let i = 0; i < len; i++) {
                if (address_id == this._addressData[i].id) {
                    tempId = i;
                    break;
                }
            }
            if (tempId != -1) {
                this._addressData.splice(tempId, 1);
            } else {
                cc.log("未找到要删除的地址");
            }

            //删除剩最后一个地址时,需要把最后这个地址设为默认地址
            if (this._addressData.length == 1) {
                this._addressData[0].is_default = 1;
            }
        } else if (type == EditType.edit) {
            let len = this._addressData.length;
            for (let i = 0; i < len; i++) {
                //把编辑的信息更新到数组里
                if (address_id == this._addressData[i].id) {
                    this._addressData[i].name = data.name;
                    this._addressData[i].mobile = data.mobile;
                    this._addressData[i].province_id = data.province;
                    this._addressData[i].city_id = data.city;
                    this._addressData[i].address = data.address;
                    break;
                }
            }
        }
        //重新设置数据
        this.setupInfo(this._addressData);
    }


    onDestroy() {

    }
}
