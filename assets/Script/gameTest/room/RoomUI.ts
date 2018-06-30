const { ccclass, property } = cc._decorator;

@ccclass
export default class RoomUI extends cc.Component {



    	//跟进炮台位置设置炮台隐藏和显示
	public setGunVisableByPos(pos: number, vis: boolean): void {
		cc.log("setGunVisableByPos=" + pos + "vis=" + vis);
		// let action = cc.repeatForever(cc.sequence(cc.fadeIn(1.5), cc.fadeOut(1.5)));
		// switch (pos) {
		// 	case RoomPosEnum.GUN_POS_0:
		// 		//group隐藏
		// 		this.groupGun_0.active = vis;
		// 		this.gunInfo0.active = vis;
		// 		this.money0.active = vis;
		// 		// this.pos_0.active = vis;
		// 		this.posEff_0.active = vis;
		// 		this.posEff_4.active = vis;
		// 		this.rateLab_num_0.node.active = vis;

		// 		this.waiting_0.active = !vis;
		// 		if (!vis) {
		// 			this.waiting_0.runAction(action);
		// 		} else {
		// 			this.waiting_0.stopAllActions();
		// 		}
		// 		break;
		// 	case RoomPosEnum.GUN_POS_1:
		// 		this.groupGun_1.active = vis;
		// 		this.gunInfo1.active = vis;
		// 		this.money1.active = vis;
		// 		// this.pos_1.active = vis;
		// 		this.posEff_1.active = vis;
		// 		this.posEff_5.active = vis;
		// 		this.rateLab_num_1.node.active = vis;

		// 		this.waiting_1.active = !vis;
		// 		if (!vis) {
		// 			this.waiting_1.runAction(action);
		// 		} else {
		// 			this.waiting_1.stopAllActions();
		// 		}
		// 		break;
		// 	case RoomPosEnum.GUN_POS_2:
		// 		this.groupGun_2.active = vis;
		// 		this.gunInfo2.active = vis;
		// 		this.money2.active = vis;
		// 		// this.pos_2.active = vis;
		// 		this.posEff_2.active = vis;
		// 		this.posEff_6.active = vis;
		// 		this.rateLab_num_2.node.active = vis;

		// 		this.waiting_2.active = !vis;
		// 		if (!vis) {
		// 			this.waiting_2.runAction(action);
		// 		} else {
		// 			this.waiting_2.stopAllActions();
		// 		}
		// 		break;
		// 	case RoomPosEnum.GUN_POS_3:
		// 		this.groupGun_3.active = vis;
		// 		this.gunInfo3.active = vis;
		// 		this.money3.active = vis;
		// 		// this.pos_3.active = vis;
		// 		this.posEff_3.active = vis;
		// 		this.posEff_7.active = vis;
		// 		this.rateLab_num_3.node.active = vis;

		// 		this.waiting_3.active = !vis;
		// 		if (!vis) {
		// 			this.waiting_3.runAction(action);
		// 		} else {
		// 			this.waiting_3.stopAllActions();
		// 		}
		// 		break;
		// }
	}
}
