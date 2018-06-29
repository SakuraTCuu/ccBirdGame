import Hall from "../../Hall";
import HTTPMgr from "../../../core/HTTPMgr";
import { HTTPPath } from "../../../Const";
import { UserGoodsInfo, RechargeInfo } from "../../HallModel";
import HallMine_recharge_item from "./HallMine_recharge_item";
import { HintUIType } from "../../../HintUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallMine_recharge extends cc.Component {

    @property(cc.Prefab)
    rechargeItem: cc.Prefab = null;

    @property(cc.Node)
    contentNode: cc.Node = null;

    @property(cc.Node)
    rechargeNullNode: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    _rechargeListData: Array<RechargeInfo> = new Array;//用户宝箱信息
    _page: number = 1;//当前的页数
    _hasData: boolean = true;//服务器是否还有数据

    onLoad() {
        this.scrollView.node.on("scroll-to-bottom", this.scrollEvent, this)
    }

    scrollEvent() {
        //请求下一数组数据
        this._page++;
        if (this._hasData) {
            this.requestInfo(1);
        } else {
            // Hall.instance.showFailure("已经没有数据了");
            cc.log("已经没有数据了");
        }
    }

    requestInfo(flag: number) {
        if (flag == 0 && this._rechargeListData.length != 0) {
            // cc.log("列表已经有数据了");
            this.setupInfo(this._rechargeListData, flag);

        } else {
            flag = 1;
            const param = {    //分页查询,默认是第一页
                page: this._page,
            }
            HTTPMgr.get(HTTPPath.USERRECHARGELIST, param).then(info => {
                this.setupInfo(info["data"]["list"], flag);
            }).catch((err) => {
                Hall.instance.showHintUI(HintUIType.Failure,err['msg']);
                cc.error("---err----" + err);
            });
        }
    }

    /**
         * 
         * @param list  数据
         * @param flag  是否添加进data  0不添加, 1添加
         */
    setupInfo(list, flag: number) {
        if (list.length == 0) {
            this._hasData = false;
            if (this._rechargeListData.length == 0) {
                this.rechargeNullNode.active = true;
            }
            return;
        }
        cc.log(list);
        if (flag == 0) { //不添加
            this.contentNode.removeAllChildren(); //移除之前的ui
            for (let i = 0; i < list.length; i++) {
                let item = cc.instantiate(this.rechargeItem);
                item.getComponent(HallMine_recharge_item).setData(list[i]);
                this.contentNode.addChild(item)        ;
            }
        } else { //添加
            for (let i = 0; i < list.length; i++) {
                this._rechargeListData.push(list[i]);
                let item = cc.instantiate(this.rechargeItem);
                item.getComponent(HallMine_recharge_item).setData(list[i]);
                this.contentNode.addChild(item);
            }
        }
    } 

    showNode() {
        this.node.active = true;

        this.requestInfo(0);
    }

    onClickCloseBtn() {
        this.node.active = false;
    }

    onDestroy() {

    }
}
