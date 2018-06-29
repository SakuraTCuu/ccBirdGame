import Game from "./Game";
import GamePTCtr from "./GamePTCtr";
import Net from "./Net";
import BirdCtr from "./BirdCtr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
    // 子弹速度
    speed: number = 1500;

    bulletLevel = 1;
    oriRadian = 0;

    // 子弹攻击力，基础攻击力
    private attack: number = 6;

    _maxY: number;
    _minY: number;
    _maxX: number;
    _minX: number;

    shot(gameJS: Game, level: number, degress: number, weaponNode: cc.Node) {
        this.bulletLevel = level;
        this.oriRadian = cc.degreesToRadians(degress);
        this.enabled = true; // 启动update函数

        this._maxX = gameJS.gameNode.width * 0.5 + 10;
        this._minX = - this._maxX;
        this._maxY = gameJS.gameNode.height * 0.5 + 10;
        this._minY = - this._maxY;
        
        this.node.rotation = degress;

        cc.log("weaponNode pos --- ", weaponNode.position);
        const oriPos = cc.p(weaponNode.x + 50 * Math.sin(this.oriRadian), weaponNode.y + 50 * Math.cos(this.oriRadian));
        this.node.position = oriPos;
        cc.log("bullet pos --- ", oriPos);

        this.node.getComponent(cc.Sprite).spriteFrame = gameJS.gameAtlas.getSpriteFrame('bullet_' + this.bulletLevel);
        this.node.getComponent(cc.BoxCollider).size = this.node.getContentSize();

        this.node.parent = weaponNode.parent;
    }

    update(dt) {
        let bx = this.node.x;
        let by = this.node.y;
        bx += dt * this.speed * Math.sin(this.oriRadian);
        by += dt * this.speed * Math.cos(this.oriRadian);
        this.node.x = bx;
        this.node.y = by;

        if (this.node.x < this._minX || this.node.x > this._maxX
            || this.node.y < this._minY || this.node.y > this._maxY) {
            cc.log("bullet destory", this.node.position);
            this.enabled = false;
            Game.instance.putACacheBullet(this.node);
        }
    }

    onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
        const bird = <BirdCtr>other.node.getComponent(BirdCtr);
        if (bird == null) return;
        
        if (!bird.canBeAttack()) return;
        
        cc.log("---onCollisionEnter   bullet---", bird.birdInfo.bird_id);

        // 矩形碰撞组件顶点坐标，左上，左下，右下，右上
        const posB = self["world"].points;
        // 取左上和右上坐标计算中点当做碰撞中点
        const posNet = cc.pMidpoint(posB[0], posB[3]);
        //撒网
        const netNode = Game.instance.getACaheNet();
        const weaponLevel = GamePTCtr.instance.weaponLevel;
        netNode.getComponent(Net).show(Game.instance, weaponLevel, posNet);
        //销毁子弹
        Game.instance.putACacheBullet(this.node);
    }

    getAttackValue() : number {
        return this.attack * this.bulletLevel;
    }
}
