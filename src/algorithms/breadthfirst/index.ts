import { Animation, inputDataI } from '../astar/astar'

interface Node{
    isWall:boolean,
    visited:boolean,
    inQueue: boolean,
    parent: number,
    index: number,
}

var animationQueue: Animation[] = []
var searchQueue:Node[] = []

export const BreadthFirstSearch = (inputData:inputDataI):Animation[] => {
    const grid = inputData.grid
    const width = inputData.width
    const start = inputData.start
    const finish = inputData.finish
    animationQueue = []
    searchQueue = []
    const nodeGrid:Node[] = []
    for(let i=0;i<grid.length;i++){
        nodeGrid[i] = {
            isWall: grid[i],
            visited: false,
            inQueue: i === start,
            parent: (i === start) ? start : -1,
            index: i
        }
    }

    Enqueue(nodeGrid[start])

    while(searchQueue.length > 0){
        console.log(searchQueue.length)
        const currentNode = Dequeue()
        nodeGrid[currentNode.index] ={
            ...currentNode,
            visited: true
        }
        animationQueue.push({
            index:currentNode.index,
            className: ' searched'
        })
        if(currentNode.index === finish) break
        else AddSurrondingNodes(nodeGrid,currentNode.index,width)
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

const Enqueue = (node:Node) => searchQueue.push(node)

const Dequeue = ():Node => searchQueue.shift() as Node

export const AddSurrondingNodes = (nodeGrid:Node[],nodeIndex:number, width:number) => {
    const UpdateWeightCost = (index:number, parentIndex:number) => {
        if(!nodeGrid[index].isWall && !nodeGrid[index].visited && !nodeGrid[index].inQueue){
            nodeGrid[index] = {
                ...nodeGrid[index],
                inQueue: true,
                parent: parentIndex
            }
            animationQueue.push({
                index:index,
                className: ' openList'
            })
            Enqueue(nodeGrid[index])
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