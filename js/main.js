/* global d3 CoincidenceGraph */

d3.json("data/nalogi.json", function (error, data) {

  var cGraph = new CoincidenceTextGraph("#d3graph");
  cGraph.draw(data, {baseCharge: -40, maxSize: 30, eoThresholdMin: 1});
  cGraph.createLegend();

});
