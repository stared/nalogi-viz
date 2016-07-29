/* global d3 CoincidenceGraph */

d3.json("data/nalogi.json", function (error, data) {

  var cGraph = new CoincidenceGraph("#d3graph");
  cGraph.draw(data, {baseCharge: -30, maxSize: 30, eoThresholdMin: 0.7});
  cGraph.createLegend();

});
