
export class Tools {


    /**计算两个向量之间的距离 */
    public static pDistance(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    /**返回两个向量之间的弧度 */
    public static pAngleSigned(x1: number, y1: number, x2: number, y2: number) {
        let ab = x1 * x2 + y1 * y2;
        let moduleA = Math.sqrt(x1 * x1 + y1 * y1);
        let moduleB = Math.sqrt(x2 * x2 + y2 * y2);
        let cos = ab / (moduleA * moduleB);
        return Math.acos(cos);
    }


    /**
     * 移除所有动作（包括子节点的动作）
     */
    public static removeAllAction(node: cc.Node) {
        node.stopAllActions();
        let childrenNode = node.children;
        if (childrenNode) {
            let len = childrenNode.length;
            for (let i = 0; i < len; i++) {
                // childenNode[i].stopAllActions();
                Tools.removeAllAction(childrenNode[i]);
            }
        }
    }

    /**
     * 顺时针旋转动画
     * @param obj 旋转的对象节点
     * @param during   单圈旋转的时间 以秒为单位
     */
    public static roation(obj: cc.Node, during: number) {
        let action = cc.rotateBy(during, 360).repeatForever();
        obj.runAction(action);
    }

    /**
     * 逆时针旋转动画
     * @param obj 
     * @param during 
     */
    public static rotationAnti(obj: cc.Node, during: number) {
        let action = cc.rotateBy(during, -360).repeatForever();
        obj.runAction(action);
    }
    /**
		 * 循环收缩
		 * amplitude：振幅
		 * during：单次时间
		 */
    public static shrink(obj: cc.Node, amplitude: number, during: number): void {
        let action = cc.sequence(cc.scaleTo(during / 1, obj.scaleX - amplitude, obj.scaleY - amplitude),
            cc.scaleTo(during / 1, obj.scaleX + amplitude, obj.scaleY + amplitude)).repeatForever();

        obj.runAction(action);
    }

    /**
     * 圆型波纹效果
     * @param obj 
     */
    public static circle(obj: cc.Node): void {
        let action = cc.sequence(
            cc.callFunc(() => {
                obj.scaleX = 0.2;
                obj.scaleY = 0.2;
                obj.opacity = 255
            }),
            cc.scaleTo(0.7, 0.7, 0.7),
            cc.spawn(cc.scaleTo(0.3, 1.2, 1.2), cc.fadeTo(0.3, 0))
        ).repeatForever();
        obj.runAction(action);
    }

    /** 
		 * 渐隐渐现 
		 * during：单次消失和出现的时间
		 * */
    public static showOutAndIn(obj: cc.Node, during: number): void {
        let action = cc.sequence(
            cc.fadeOut(during / 2),
            cc.fadeIn(during / 2),
        ).repeatForever();
        obj.runAction(action);
    }

}