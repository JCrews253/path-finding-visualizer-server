"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var animationQueue = [];
var searchStack = [];
exports.DepthFirstSearch = (inputData) => {
    const grid = inputData.grid;
    const width = inputData.width;
    const start = inputData.start;
    const finish = inputData.finish;
    animationQueue = [];
    searchStack = [];
    const nodeGrid = [];
    for (let i = 0; i < grid.length; i++) {
        nodeGrid[i] = {
            isWall: grid[i],
            visited: false,
            parent: (i === start) ? start : -1,
            index: i
        };
    }
    searchStack.push(nodeGrid[start]);
    while (searchStack.length > 0) {
        const currentNode = searchStack.pop();
        nodeGrid[currentNode.index] = Object.assign(Object.assign({}, currentNode), { visited: true });
        animationQueue.push({
            index: currentNode.index,
            className: ' searched'
        });
        if (currentNode.index === finish)
            break;
        else
            exports.AddSurrondingNodes(nodeGrid, currentNode.index, width);
    }
    var parent = nodeGrid[finish].parent;
    if (parent !== -1) {
        var reverseQueue = [];
        while (parent !== nodeGrid[parent].parent) {
            reverseQueue.push({ index: parent, className: ' shortestPath' });
            parent = nodeGrid[parent].parent;
        }
        while (reverseQueue.length > 0)
            animationQueue.push(reverseQueue.pop());
    }
    else {
        console.log('No Path Found');
    }
    return animationQueue;
};
exports.AddSurrondingNodes = (nodeGrid, nodeIndex, width) => {
    const UpdateWeightCost = (index, parentIndex) => {
        if (!nodeGrid[index].isWall && !nodeGrid[index].visited) {
            nodeGrid[index] = Object.assign(Object.assign({}, nodeGrid[index]), { parent: parentIndex });
            animationQueue.push({
                index: index,
                className: ' openList'
            });
            searchStack.push(nodeGrid[index]);
        }
    };
    //Top
    if (nodeIndex >= width) {
        UpdateWeightCost(nodeIndex - width, nodeIndex);
    }
    //Right
    if (nodeIndex % width !== width - 1) {
        UpdateWeightCost(nodeIndex + 1, nodeIndex);
    }
    //Bottom
    if (nodeIndex < nodeGrid.length - width) {
        UpdateWeightCost(nodeIndex + width, nodeIndex);
    }
    //Left
    if (nodeIndex % width !== 0) {
        UpdateWeightCost(nodeIndex - 1, nodeIndex);
    }
};
//# sourceMappingURL=index.js.map