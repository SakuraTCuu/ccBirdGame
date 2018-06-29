import { addressInfo } from "../../HallModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallMine_mybox_address_item extends cc.Component {

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    phoneLab: cc.Label = null;

    @property(cc.Label)
    addressLab: cc.Label = null;

    @property(cc.Node)
    btn_normal: cc.Node = null;

    @property(cc.Node)
    btn_select: cc.Node = null;

    setData(data: addressInfo) {
        this.nameLab.string = data.name;
        this.phoneLab.string = data.mobile;
        this.addressLab.string = data.address;

        //默认是都不选中的
        this.btn_normal.active = true;
        this.btn_select.active = false;
    }

    showSelect(flag: number) {
        if (flag == 0) {
            this.btn_normal.active = true;
            this.btn_select.active = false;
        } else {
            this.btn_normal.active = false;
            this.btn_select.active = true;
        }
    }

    onDestroy(){
        
    }

}
