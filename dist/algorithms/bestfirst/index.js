"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSurrondingNodes = exports.ManhattanDistance = exports.HeapRemove = exports.HeapInsert = exports.Swap = exports.Heapify = exports.BestFirstSearch = void 0;
var animationQueue = [];
var heap = [];
var size;
exports.BestFirstSearch = (inputData) => {
    const grid = inputData.grid;
    const width = inputData.width;
    const start = inputData.start;
    const finish = inputData.finish;
    animationQueue = [];
    heap = [];
    size = 0;
    const nodeGrid = new Array(grid.length);
    for (let i = 0; i < grid.length; i++) {
        nodeGrid[i] = {
            isWall: grid[i],
            visited: false,
            fcost: (i === start) ? exports.ManhattanDistance(i, finish, width) : Infinity,
            parent: (i === start) ? start : -1,
            index: i
        };
    }
    exports.HeapInsert(nodeGrid[start]);
    while (heap.length > 0 && heap.length < width * 20) {
        const currentNode = exports.HeapRemove();
        nodeGrid[currentNode.index] = Object.assign(Object.assign({}, currentNode), { visited: true });
        animationQueue.push({
            index: currentNode.index,
            className: ' searched'
        });
        if (currentNode.index === finish)
            break;
        else
            exports.AddSurrondingNodes(nodeGrid, currentNode.index, width, finish);
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
exports.Heapify = (index) => {
    const LeftChild = (index) => Math.floor(2 * index + 1);
    const RightChild = (index) => Math.floor(2 * index + 2);
    const HasLeftChild = (index) => LeftChild(index) < size;
    const HasRightChild = (index) => RightChild(index) < size;
    var currentIndex = index;
    while (HasLeftChild(currentIndex)) {
        var smallerIndex = LeftChild(currentIndex);
        if (HasRightChild(currentIndex) &&
            heap[RightChild(currentIndex)].fcost < heap[LeftChild(currentIndex)].fcost) {
            smallerIndex = RightChild(currentIndex);
        }
        if (heap[currentIndex].fcost < heap[smallerIndex].fcost)
            break;
        else
            exports.Swap(currentIndex, smallerIndex);
        currentIndex = smallerIndex;
    }
};
exports.Swap = (index1, index2) => {
    const temp = heap[index1];
    heap[index1] = heap[index2];
    heap[index2] = temp;
};
exports.HeapInsert = (item) => {
    const Parent = (index) => Math.floor((index - 1) / 2);
    const HasParent = (index) => Parent(index) >= 0;
    heap[size] = item;
    size++;
    var current = size - 1;
    while (HasParent(current) && (heap[current].fcost < heap[Parent(current)].fcost)) {
        exports.Swap(current, Parent(current));
        current = Parent(current);
    }
};
exports.HeapRemove = () => {
    const first = heap[0];
    heap[0] = heap[size - 1];
    const newHeap = heap.slice(0, size - 1);
    heap = [...newHeap];
    size--;
    exports.Heapify(0);
    return first;
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
exports.AddSurrondingNodes = (nodeGrid, nodeIndex, width, finish) => {
    const UpdateWeightCost = (index, parentIndex) => {
        if (!nodeGrid[index].isWall && !nodeGrid[index].visited && nodeGrid[index].fcost === Infinity) {
            nodeGrid[index] = Object.assign(Object.assign({}, nodeGrid[index]), { fcost: exports.ManhattanDistance(index, finish, width), parent: parentIndex });
            animationQueue.push({
                index: index,
                className: ' openList'
            });
            exports.HeapInsert(nodeGrid[index]);
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