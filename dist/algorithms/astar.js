"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalcNodeCosts = exports.ListRemove = exports.ListContains = exports.FindSmallestCost = exports.ManhattanDistance = exports.EuclideanDistance = exports.BuildNodeGrid = exports.AStarSearch = void 0;
var animationQueue = [];
exports.AStarSearch = (grid, width, start, finish) => {
    animationQueue = [];
    const openNodes = [];
    const closedNodes = [];
    const nodeGrid = [...exports.BuildNodeGrid(grid)];
    nodeGrid[start] = Object.assign(Object.assign({}, nodeGrid[start]), { gWeight: 0, hWeight: 0, fWeight: 0, parent: start });
    openNodes.push(nodeGrid[start]);
    while (openNodes.length > 0) {
        var currentNode = nodeGrid[exports.FindSmallestCost(openNodes)];
        if (currentNode.index !== start && currentNode.index !== finish)
            animationQueue.push({ index: currentNode.index, className: ' searched' });
        exports.ListRemove(openNodes, currentNode.index);
        closedNodes.push(currentNode);
        if (currentNode.index === finish)
            break;
        exports.CalcNodeCosts(nodeGrid, currentNode.index, closedNodes, openNodes, start, finish, width);
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
exports.BuildNodeGrid = (grid) => {
    const buildNodeGrid = [];
    grid.map((_, idx) => {
        buildNodeGrid[idx] = {
            isWall: (grid[idx] === true) ? true : false,
            gWeight: Infinity,
            hWeight: Infinity,
            fWeight: Infinity,
            parent: -1,
            index: idx,
        };
    });
    return buildNodeGrid;
};
exports.EuclideanDistance = (p, q, width) => {
    const pRow = Math.floor(p / width);
    var pCol;
    if (p >= width)
        pCol = p % width;
    else
        pCol = p;
    const qRow = Math.floor(q / width);
    var qCol;
    if (q >= width)
        qCol = q % width;
    else
        qCol = q;
    return Math.floor(Math.sqrt(Math.pow(qRow - pRow, 2) + Math.pow(qCol - pCol, 2)) * 10);
};
exports.ManhattanDistance = (p, q, width) => {
    const pRow = Math.floor(p / width);
    var pCol;
    if (p >= width)
        pCol = p % width;
    else
        pCol = p;
    const qRow = Math.floor(q / width);
    var qCol;
    if (q >= width)
        qCol = q % width;
    else
        qCol = q;
    return Math.floor((Math.abs(qRow - pRow) + Math.abs(qCol - pCol)) * 10);
};
exports.FindSmallestCost = (array) => {
    let smallestIndex = 0;
    array.map((_, idx) => {
        if (array[idx].fWeight < array[smallestIndex].fWeight) {
            smallestIndex = idx;
        }
        else if (array[idx].fWeight === array[smallestIndex].fWeight && array[idx].hWeight < array[smallestIndex].hWeight) {
            smallestIndex = idx;
        }
    });
    return array[smallestIndex].index;
};
exports.ListContains = (nodeList, index) => {
    if (nodeList.length === 0)
        return false;
    for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].index === index)
            return true;
    }
    return false;
};
exports.ListRemove = (nodeList, gridIndex) => {
    for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].index === gridIndex) {
            nodeList.splice(i, 1);
            break;
        }
    }
};
exports.CalcNodeCosts = (nodeGrid, nodeIndex, closedNodes, openNodes, start, finish, width) => {
    const UpdateWeightCost = (index, parentIndex) => {
        if (!nodeGrid[index].isWall && !exports.ListContains(closedNodes, index)) {
            if (index !== finish) {
                animationQueue.push({
                    index: index,
                    className: ' openList'
                });
            }
            const tempNode = Object.assign(Object.assign({}, nodeGrid[index]), { gWeight: nodeGrid[parentIndex].gWeight + exports.ManhattanDistance(index, parentIndex, width), hWeight: exports.ManhattanDistance(index, finish, width), get fWeight() {
                    return this.gWeight + this.hWeight;
                }, parent: parentIndex });
            if (tempNode.fWeight < nodeGrid[index].fWeight || !exports.ListContains(openNodes, index)) {
                nodeGrid[index] = tempNode;
                openNodes.push(nodeGrid[index]);
            }
            else if (tempNode.fWeight === nodeGrid[index].fWeight && tempNode.hWeight < nodeGrid[index].hWeight) {
                nodeGrid[index] = tempNode;
                openNodes.push(nodeGrid[index]);
            }
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
//# sourceMappingURL=astar.js.map