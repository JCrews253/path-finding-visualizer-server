import * as express from "express";
import * as cors from 'cors'
import {inputDataI,AStarSearch,Animation} from './algorithms/astar/astar'
import { Dijkstra } from "./algorithms/dijkstras";
import { BestFirstSearch } from "./algorithms/bestfirst";
import { BreadthFirstSearch } from "./algorithms/breadthfirst";
import { DepthFirstSearch } from "./algorithms/depthfirst";
import * as path from 'path'

const app = express();
app.use(cors())
app.use(express.json())
//app.use(express.urlencoded())
app.set("port", process.env.PORT || 5000);

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'))
  app.get('*', (req,res) => {
    res.sendfile(path.join(__dirname,'client','build','index.html'))
  })
}


app.get("/status", (req, res) => {
  res.send("running");
});

app.post('/solutions', (req,res) => {
  const inputData: inputDataI = {
    algorithm: req.body.algorithm,
    grid:req.body.grid,
    width:req.body.width,
    start: req.body.start,
    finish: req.body.finish
  }

  var animations:Animation[] = []
  if(inputData.algorithm === 'astar') animations = AStarSearch(inputData)
  else if(inputData.algorithm === 'dijkstra') animations = Dijkstra(inputData)
  else if(inputData.algorithm === 'best-first') animations = BestFirstSearch(inputData)
  else if(inputData.algorithm === 'depth-first') animations = DepthFirstSearch(inputData)
  else if(inputData.algorithm === 'breadth-first') animations = BreadthFirstSearch(inputData)

  res.send(JSON.stringify(animations))
})

app.listen(app.get("port"), () => {
  console.log(
    "App is running on http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
});

export default app;