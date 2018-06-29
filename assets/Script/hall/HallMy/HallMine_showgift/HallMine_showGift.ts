import { HTTPPath } from "../../../Const";
import HTTPMgr from "../../../core/HTTPMgr";
import Hall from "../../Hall";
import { RechargeInfo, ShowGiftInfo } from "../../HallModel";
import HallMine_showGift_item from "./HallMine_showGift_item";
import { HintUIType } from "../../../HintUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallMine_showGift extends cc.Component {

    @property(cc.Node)
    contentNode: cc.Node = null;

    @property(cc.Node)
    showGiftNullNode: cc.Node = null;

    @property(cc.Prefab)
    showGiftItem: cc.Prefab = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    _showGiftListData: Array<ShowGiftInfo> = new Array;//用户宝箱信息
    _page: number = 1;//当前的页数
    _hasData: boolean = true;//服务器是否还有数据
    _flag: boolean = false; //内存是否还有数据

    onLoad() {
        this.scrollView.node.on("scroll-to-bottom", this.scrollEvent, this)
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

    // requestInfo(flag: number = 0) {
    //     if (flag == 0 && this._showGiftListData.length != 0) {
    //         // cc.log("列表已经有数据了");
    //         this.setupInfo(this._showGiftListData, flag);

    //     } else {
    //         flag = 1;
    //         const param = {    //分页查询,默认是第一页
    //             page: this._page,
    //         }
    //         HTTPMgr.get(HTTPPath.USERSHOWGIFT, param).then(info => {
    //             this.setupInfo(info["data"]["list"], flag);
    //         }).catch((err) => {
    //             Hall.instance.showFailure(err['msg']);
    //             cc.error("---err----" + err);
    //         });
    //     }
    // }

    // /**
    //      * 
    //      * @param list  数据
    //      * @param flag  是否添加进data  0不添加, 1添加
    //      */
    // setupInfo(list, flag: number) {
    //     if (list.length == 0) {
    //         this._hasData = false;
    //         // Hall.instance.showFailure("已经没有数据了");
    //         if (this._showGiftListData.length == 0) {
    //             this.showGiftNullNode.active = true;
    //         }
    //         return;
    //     }
    //     cc.log(list);
    //     if (flag == 0) { //不添加
    //         this.contentNode.removeAllChildren(); //移除之前的ui
    //         for (let i = 0; i < list.length; i++) {
    //             let item = cc.instantiate(this.showGiftItem);
    //             item.getComponent(HallMine_showGift_item).setData(list[i]);
    //             this.contentNode.addChild(item);
    //         }
    //     } else { //添加
    //         for (let i = 0; i < list.length; i++) {
    //             this._showGiftListData.push(list[i]);
    //             let item = cc.instantiate(this.showGiftItem);
    //             item.getComponent(HallMine_showGift_item).setData(list[i]);
    //             this.contentNode.addChild(item);
    //         }
    //     }
    // }


    requestInfo() {
        const param = {    //分页查询,默认是第一页
            page: this._page,
        }
        HTTPMgr.get(HTTPPath.USERSHOWGIFT, param).then(info => {
            this.setupInfo(info["data"]["list"]);
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure,err['msg']);
            cc.error("---err----" + err);
        });

    }

    setupInfo(list) {
        cc.log(list);
        if (list.length == 0) {
            this._hasData = false;
            if (!this._flag) {
                this.showGiftNullNode.active = true;
            }
            // return;
        }
        this._flag = true;

        // if (this._hasData) {

        // } else {
        //     this.contentNode.removeAllChildren();    //移除之前的ui
        // }
        for (let i = 0; i < list.length; i++) {
            let item = cc.instantiate(this.showGiftItem);
            item.getComponent(HallMine_showGift_item).setData(list[i]);
            this.contentNode.addChild(item);
        }
    }


    showNode() {
        this.node.active = true;
        // this.requestInfo(0);
        this.requestInfo();
    }

    onClickCloseBtn() {
        this.node.active = false;
    }

    onDestroy() {

    }
}
