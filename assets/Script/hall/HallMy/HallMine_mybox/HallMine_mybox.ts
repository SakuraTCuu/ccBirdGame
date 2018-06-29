import HTTPMgr from "../../../core/HTTPMgr";
import { HTTPPath } from "../../../Const";
import Hall from "../../Hall";
import HallMine_mybox_item from "./HallMine_mybox_item";
import { UserGoodsInfo } from "../../HallModel";
import HallMine_mybox_address from "./HallMine_mybox_address";
import HallMine_address from "../HallMine_address/HallMine_address";
import HallMine_mybox_logistics from "./HallMine_mybox_logistics";
import { HintUIType } from "../../../HintUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallMine_mybox extends cc.Component {

    @property(cc.Node)
    contentNode: cc.Node = null;

    @property(cc.Node)
    myboxNullNode: cc.Node = null;

    @property(cc.Node)
    selectAddressNode: cc.Node = null;

    @property(cc.Node)
    logisticsNode: cc.Node = null;

    @property(cc.Node)
    addressNode: cc.Node = null;

    @property(cc.Label)
    value_lab: cc.Label = null;

    @property(cc.Prefab)
    mybox_item: cc.Prefab = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    _data: UserGoodsInfo = null;//宝箱id
    _userGoodsData: any = null; //用户物流信息
    _addressData: any = null; //地址信息
    _boxListData: Array<UserGoodsInfo> = new Array;//用户宝箱信息
    _page: number = 1;
    _hasData: boolean = true;//服务器是否还有数据
    _flag: boolean = false;//内存中是否还有数据

    onLoad() {
        this.scrollView.node.on("scroll-to-bottom", this.scrollEvent, this);
    }

    onEnable() {
        this._page = 1;
        this.contentNode.removeAllChildren();
    }

    scrollEvent() {
        cc.log("scrollEvent");
        //请求下一数组数据
        this._page++;
        if (this._hasData) {
            this.requestInfo();
        } else {
            // Hall.instance.showFailure("已经没有数据了");
            cc.log("已经没有数据了");
        }
    }

    //关闭按钮
    onClickCloseBtn() {
        this.node.active = false;
    }

    //关闭地址选择
    onClickCloseAddress() {
        this.selectAddressNode.active = false;
    }

    showNode() {
        this.node.active = true;
        this.requestInfo();
    }

    //展示地址编辑ui
    showAddressNode() {
        this.addressNode.getComponent(HallMine_address).showNode(1);
    }

    requestInfo() {
        let size = 20;    //一次请求20条数据
        const param = {    //分页查询,默认是第一页
            page: this._page,
            pageSize: size,
        }
        HTTPMgr.get(HTTPPath.USERBOXLIST, param).then(info => {
            this.setupInfo(info["data"]["list"]);
            if (this._page == 1) { //第一次请求才有的数据
                let money: number = info["data"]["Statistics"].total_money;
                if (money) {
                    this.value_lab.string = money + "元";
                } else {
                    this.value_lab.string = "";
                }
            }
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure,err['msg']);
            cc.error("---err----" + err);
        });

    }

    setupInfo(list) {
        cc.log(list);
        if (list.length == 0) {
            this._hasData = false;
            // Hall.instance.showFailure("已经没有数据了");
            if (!this._flag) {
                this.myboxNullNode.active = true;
                this.value_lab.string = "";
                this.node.getChildByName("value_lab_title").active = false;
            }
            return;
        }
        this._flag = true;
        // this.contentNode.removeAllChildren(); //移除之前的ui
        for (let i = 0; i < list.length; i++) {
            let item = cc.instantiate(this.mybox_item);
            item.name = list[i].gid + "";
            item.getComponent(HallMine_mybox_item).setData(this, list[i]);
            this.contentNode.addChild(item);
        }
    }

    /**
     * 
     * @param flag 数据是如何加载   0 ui展示的时候如果有数据说明不是第一次打开ui了,只需要把数据展示一下不需要保存,
     *                             1 用户滑到底部  需要重新请求数据展示并保存
     */
    // requestInfo(flag: number) {
    //     if (flag == 0 && this._boxListData.length != 0) {
    //         // cc.log("列表已经有数据了");
    //         this.setupInfo(this._boxListData, flag);

    //     } else {
    //         flag = 1;
    //         let size = 20;    //一次请求20条数据
    //         const param = {    //分页查询,默认是第一页
    //             page: this._page,
    //             pageSize: size,
    //         }
    //         HTTPMgr.get(HTTPPath.USERBOXLIST, param).then(info => {
    //             this.setupInfo(info["data"]["list"], flag);
    //             if (this._page == 1) { //第一次请求才有的数据
    //                 let money: number = info["data"]["Statistics"].total_money;
    //                 if (money) {
    //                     this.value_lab.string = money + "元";
    //                 } else {
    //                     this.value_lab.string = "";
    //                 }
    //             }
    //         }).catch((err) => {
    //             Hall.instance.showFailure(err['msg']);
    //             cc.error("---err----" + err);
    //         });
    //     }

    // }

    // /**
    //  * 
    //  * @param list  数据
    //  * @param flag  是否添加进data  0不添加, 1添加
    //  */
    // setupInfo(list, flag: number) {
    //     if (list.length == 0) {
    //         this._hasData = false;
    //         // Hall.instance.showFailure("已经没有数据了");
    //         if (this._boxListData.length == 0) {
    //             this.myboxNullNode.active = true;
    //             this.value_lab.string = "";
    //             this.node.getChildByName("value_lab_title").active = false;
    //         }
    //         return;
    //     }
    //     cc.log(list);
    //     if (flag == 0) { //不添加
    //         this.contentNode.removeAllChildren(); //移除之前的ui
    //         for (let i = 0; i < list.length; i++) {
    //             let item = cc.instantiate(this.mybox_item);
    //             item.name = list[i].gid + "";
    //             item.getComponent(HallMine_mybox_item).setData(this, list[i]);
    //             this.contentNode.addChild(item);
    //         }
    //     } else { //添加
    //         for (let i = 0; i < list.length; i++) {
    //             this._boxListData.push(list[i]);
    //             let item = cc.instantiate(this.mybox_item);
    //             item.name = list[i].gid + "";
    //             item.getComponent(HallMine_mybox_item).setData(this, list[i]);
    //             this.contentNode.addChild(item);
    //         }
    //     }
    // }

    //展示物流界面
    showLogisticsUi(data: UserGoodsInfo) {
        // if (this._userGoodsData) {
        //     this.logisticsNode.getComponent(HallMine_mybox_logistics).showNode();
        //     this.logisticsNode.getComponent(HallMine_mybox_logistics).setData(this._userGoodsData["Traces"]);
        // } else {
        const param = {
            gid: data.gid,
        }
        HTTPMgr.get(HTTPPath.USERGOODSSHIPPER, param).then(info => {
            cc.log(info);
            this._userGoodsData = info["data"];
            this.logisticsNode.getComponent(HallMine_mybox_logistics).showNode();
            this.logisticsNode.getComponent(HallMine_mybox_logistics).setData(info["data"]["Traces"]);
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure,err['msg']);
            cc.error("---err----" + err);
        });
        // }
    }

    //展示地址选择界面
    showSelectAddressUi(data: UserGoodsInfo) {
        this._data = data;
        // cc.log(this._addressData);
        // if (this._addressData && this._addressData.length != 0) {
        //     this.selectAddressNode.getComponent(HallMine_mybox_address).showNode();
        //     this.selectAddressNode.getComponent(HallMine_mybox_address).setData(this, this._addressData);
        // } else {
        HTTPMgr.get(HTTPPath.USERGETADDRESS).then(info => {
            cc.log(info);
            this._addressData = info["data"];
            this.selectAddressNode.getComponent(HallMine_mybox_address).showNode();
            this.selectAddressNode.getComponent(HallMine_mybox_address).setData(this, info["data"]);
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure,err['msg']);
            cc.error("---err----" + err);
        });
        // }

    }

    //调用原生接口 展示ui 上传图片
    showcameraCtr() {
        cc.log("展示晒宝界面");
    }

    //提货 发送消息
    goodsApplyMsg(addressId: number) {
        cc.log(addressId);
        cc.log(this._data.gid);
        if (!this._data) {
            cc.log("未知错误");
        }

        const param = {
            gid: this._data.gid,
            address_id: addressId,
        }

        HTTPMgr.post(HTTPPath.USERGOODSAPPLY, param).then(info => {
            cc.log("提货成功");
            Hall.instance.showHintUI(HintUIType.Success,"提货成功");
            //状态由已拍中改为已提货
            this._data.status = 2;
            //计划只刷新变化的ui
            let item = this.contentNode.getChildByName(this._data.gid + "");
            if (item) {
                item.getComponent(HallMine_mybox_item).setData(this, this._data);
            } else {
                cc.log("未查询到拍中的货物");
            }
            //隐藏地址ui
            this.selectAddressNode.active = false;
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure,err['msg']);
            cc.error("---err----" + err);
        });
    }

    onDestroy() {

    }
}
