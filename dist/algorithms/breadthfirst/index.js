"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSurrondingNodes = exports.BreadthFirstSearch = void 0;
var animationQueue = [];
var searchQueue = [];
exports.BreadthFirstSearch = (inputData) => {
    const grid = inputData.grid;
    const width = inputData.width;
    const start = inputData.start;
    const finish = inputData.finish;
    animationQueue = [];
    searchQueue = [];
    const nodeGrid = [];
    for (let i = 0; i < grid.length; i++) {
        nodeGrid[i] = {
            isWall: grid[i],
            visited: false,
            inQueue: i === start,
            parent: (i === start) ? start : -1,
            index: i
        };
    }
    Enqueue(nodeGrid[start]);
    while (searchQueue.length > 0) {
        console.log(searchQueue.length);
        const currentNode = Dequeue();
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
const Enqueue = (node) => searchQueue.push(node);
const Dequeue = () => searchQueue.shift();
exports.AddSurrondingNodes = (nodeGrid, nodeIndex, width) => {
    const UpdateWeightCost = (index, parentIndex) => {
        if (!nodeGrid[index].isWall && !nodeGrid[index].visited && !nodeGrid[index].inQueue) {
            nodeGrid[index] = Object.assign(Object.assign({}, nodeGrid[index]), { inQueue: true, parent: parentIndex });
            animationQueue.push({
                index: index,
                className: ' openList'
            });
            Enqueue(nodeGrid[index]);
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