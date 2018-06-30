
/**
 * 为了处理运行结束后结点的删除问题
 */
export default class NodeRemoveUtil {

    private static nodeArr = new Array<cc.Node>();

    /**
     * 批量删除结点
     * @param nodeList 
     */
    public static removeNodeArray(nodeList: Array<cc.Node>) {
        if (nodeList) {
            let len = nodeList.length;
            for (let i = len - 1; i > 0; i--) {
                let node = nodeList[i];
                this.addNode(node);
                nodeList[i] = null;
            }
        }
    }

    /**
     * 添加要删除的节点，(1.6.3问题已解决)
     * @param node
     */
    public static addNode(node: cc.Node) {
        // if (node.parent) {
        //     node.removeFromParent();
        // }
        node.stopAllActions();
        node.destroyAllChildren();
        node.removeAllChildren();
        node.removeFromParent(true);
        node.destroy();
        // NodeRemoveUtil.nodeArr.push(node);
    }

    public static clearNode() {
        // if (NodeRemoveUtil.nodeArr && NodeRemoveUtil.nodeArr.length > 0) {
        //     for (let node of NodeRemoveUtil.nodeArr) {
        //         if(node && node.parent){
        //             node.removeFromParent();
        //             node.destroy();
        //         }
        //     }
        //     NodeRemoveUtil.nodeArr = new Array<cc.Node>();
        // }
    }
}
