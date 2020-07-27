import { Animation, inputDataI } from '../astar/astar'

var animationQueue: Animation[] = []
var heap:Node[] = []
var size: number

interface Node {
    isWall: boolean,
    visited: boolean,
    fcost: number,
    parent: number, 
    index: number
}

export const BestFirstSearch = (inputData:inputDataI):Animation[] => {
    const grid = inputData.grid
    const width = inputData.width
    const start = inputData.start
    const finish = inputData.finish
    animationQueue = []
    heap = []
    size = 0
    const nodeGrid:Node[] = new Array(grid.length)
    for(let i=0;i<grid.length;i++){
        nodeGrid[i] = {
            isWall: grid[i],
            visited: false,
            fcost: (i === start) ? ManhattanDistance(i,finish,width): Infinity,
            parent: (i === start)? start : -1,
            index: i
        }
    }

    HeapInsert(nodeGrid[start])

    while(heap.length > 0 && heap.length < width * 20){
        const currentNode = HeapRemove()
        nodeGrid[currentNode.index] = { 
            ...currentNode,
            visited: true,
        }
        animationQueue.push({
            index:currentNode.index,
            className: ' searched'
        })
        if(currentNode.index === finish) break
        else AddSurrondingNodes(nodeGrid,currentNode.index,width,finish)
    }

    var parent = nodeGrid[finish].parent  
    if(parent !== -1){
        var reverseQueue:Animation[] = [] 
        while(parent !== nodeGrid[parent].parent){
            reverseQueue.push({index: parent, className: ' shortestPath'})
            parent = nodeGrid[parent].parent
        }
        while(reverseQueue.length > 0) animationQueue.push(reverseQueue.pop() as Animation)
    }
    else 
    {
        console.log('No Path Found')
    }
    return animationQueue
}

export const Heapify = (index:number) => {
    const LeftChild = (index: number):number => Math.floor(2*index+1) 
    const RightChild = (index: number):number => Math.floor(2*index+2)
    const HasLeftChild = (index: number):boolean => LeftChild(index) < size
    const HasRightChild = (index: number):boolean => RightChild(index) < size

    var currentIndex = index
    while(HasLeftChild(currentIndex)){    
        var smallerIndex = LeftChild(currentIndex)
        if(HasRightChild(currentIndex) && 
        heap[RightChild(currentIndex)].fcost < heap[LeftChild(currentIndex)].fcost){
            smallerIndex = RightChild(currentIndex)
        }
        if(heap[currentIndex].fcost < heap[smallerIndex].fcost) break
        else Swap(currentIndex, smallerIndex)
        currentIndex = smallerIndex
    }
}

export const Swap = (index1:number, index2:number) => {
    const temp = heap[index1]
    heap[index1] = heap[index2]
    heap[index2] = temp
}

export const HeapInsert = (item:Node) => {
    const Parent = (index: number):number => Math.floor((index - 1) / 2)
    const HasParent = (index: number):boolean => Parent(index) >= 0
    heap[size] = item
    size++
    var current = size - 1 
    while(HasParent(current) && (heap[current].fcost < heap[Parent(current)].fcost)){
        Swap(current,Parent(current))
        current = Parent(current)
    }
}

export const HeapRemove = ():Node => {
    const first = heap[0]
    heap[0] = heap[size - 1]
    const newHeap = heap.slice(0,size-1)
    heap = [...newHeap]
    size--
    Heapify(0)
    return first
}

export const ManhattanDistance = (p:number, q:number, width: number):number => {
    const pRow = Math.floor(p/width)
    var pCol
    if(p >= width) pCol = p % width
    else pCol = p
    const qRow = Math.floor(q/width)
    var qCol
    if(q >= width) qCol = q % width
    else qCol = q
    return Math.floor((Math.abs(qRow - pRow) + Math.abs(qCol - pCol))*10)  
}

export const AddSurrondingNodes = (nodeGrid:Node[],nodeIndex:number, width:number,finish:number) => {
    const UpdateWeightCost = (index:number, parentIndex:number) => {
        if(!nodeGrid[index].isWall && !nodeGrid[index].visited && nodeGrid[index].fcost === Infinity){
            nodeGrid[index] = {
                ...nodeGrid[index],
                fcost: ManhattanDistance(index,finish,width),
                parent: parentIndex
            }
            animationQueue.push({
                index:index,
                className: ' openList'
            })
            HeapInsert(nodeGrid[index])
        }
    }

    //Top
    if(nodeIndex >= width){
        UpdateWeightCost(nodeIndex-width,nodeIndex)
    }
    //Right
    if(nodeIndex % width !== width-1){
       UpdateWeightCost(nodeIndex+1,nodeIndex)
    }
    //Bottom
    if(nodeIndex < nodeGrid.length - width){
       UpdateWeightCost(nodeIndex+width,nodeIndex)
    }
    //Left
    if(nodeIndex % width !== 0){
       UpdateWeightCost(nodeIndex-1,nodeIndex)
    }
}