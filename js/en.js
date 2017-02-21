/* global d3 CoincidenceGraph */

var cGraph = new CoincidenceTextGraph("#d3graph");

// d3.csv("data/addictions.csv", function (error, data) {
//   cGraph.rowsToGraph(data);
// });

cGraph.fromCSV("data/addictions.csv",
               {baseCharge: -70, maxSize: 30, eoThresholdMin: 1, legend: true});
