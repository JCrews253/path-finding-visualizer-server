"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var animationQueue;
exports.Dijkstra = (inputData) => {
    const grid = inputData.grid;
    const width = inputData.width;
    const start = inputData.start;
    const finish = inputData.finish;
    animationQueue = [];
    const sptSet = new Array(grid.length).fill(false);
    const nodeGrid = new Array(grid.length);
    for (let i = 0; i < nodeGrid.length; i++) {
        nodeGrid[i] = {
            isWall: grid[i] ? true : false,
            distance: Infinity,
            parent: -1,
            index: i
        };
        sptSet[i] = nodeGrid[i].isWall;
    }
    nodeGrid[start] = Object.assign(Object.assign({}, nodeGrid[start]), { distance: 0, parent: start });
    while (!sptSet[finish]) {
        var currentNode = nodeGrid[exports.FindMinNode(nodeGrid, sptSet, finish)];
        animationQueue.push({ index: currentNode.index, className: ' searched' });
        exports.FindNodeDistances(nodeGrid, sptSet, currentNode.index, width);
        sptSet[currentNode.index] = true;
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
exports.FindMinNode = (nodeGrid, sptSet, finish) => {
    let smallestIndex = finish;
    nodeGrid.map((_, idx) => {
        if (nodeGrid[idx].distance < nodeGrid[smallestIndex].distance && !sptSet[idx]) {
            smallestIndex = idx;
        }
    });
    return smallestIndex;
};
exports.FindNodeDistances = (nodeGrid, sptSet, nodeIndex, width) => {
    const UpdateWeightCost = (index, parentIndex) => {
        if (!nodeGrid[index].isWall && !sptSet[index]) {
            nodeGrid[index] = Object.assign(Object.assign({}, nodeGrid[index]), { distance: nodeGrid[parentIndex].distance + 1, parent: parentIndex });
            animationQueue.push({
                index: index,
                className: ' openList'
            });
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