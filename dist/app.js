"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const astar_1 = require("./algorithms/astar/astar");
const dijkstras_1 = require("./algorithms/dijkstras");
const bestfirst_1 = require("./algorithms/bestfirst");
const breadthfirst_1 = require("./algorithms/breadthfirst");
const depthfirst_1 = require("./algorithms/depthfirst");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.set("port", process.env.PORT || 5000);
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendfile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}
app.get("/status", (req, res) => {
    res.send("running");
});
app.post('/solutions', (req, res) => {
    const inputData = {
        algorithm: req.body.algorithm,
        grid: req.body.grid,
        width: req.body.width,
        start: req.body.start,
        finish: req.body.finish
    };
    var animations = [];
    if (inputData.algorithm === 'astar')
        animations = astar_1.AStarSearch(inputData);
    else if (inputData.algorithm === 'dijkstra')
        animations = dijkstras_1.Dijkstra(inputData);
    else if (inputData.algorithm === 'best-first')
        animations = bestfirst_1.BestFirstSearch(inputData);
    else if (inputData.algorithm === 'depth-first')
        animations = depthfirst_1.DepthFirstSearch(inputData);
    else if (inputData.algorithm === 'breadth-first')
        animations = breadthfirst_1.BreadthFirstSearch(inputData);
    res.send(JSON.stringify(animations));
});
app.listen(app.get("port"), () => {
    console.log("App is running on http://localhost:%d in %s mode", app.get("port"), app.get("env"));
});
exports.default = app;
//# sourceMappingURL=app.js.map