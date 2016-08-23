/* global d3 CoincidenceGraph */

d3.json("data/nalogi.json", function (error, data) {

  data.nodes.forEach(function (d) {
    d.category = d.category.toLowerCase();  // I should fix it in data processing instead
  });

  var cGraph = new CoincidenceTextGraph("#d3graph");
  cGraph.draw(data, {baseCharge: -45, maxSize: 22, eoThresholdMin: 1});
  cGraph.createLegend();
  // cGraph.credits();

});
