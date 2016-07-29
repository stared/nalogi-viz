/* global d3 Tooltip */

function CoincidenceGraph(selector) {
  "use strict";

  var width = 900,
      height = 700;

  var svg = d3.select(selector).append("svg")
    .attr("width", width)
    .attr("height", height);

  var g = svg.append("g");

  var tooltip = new Tooltip(selector);

  var siNumberApprox = function (x) {
    var prefix = d3.formatPrefix(x);
    var scaled = prefix.scale(x);
    return scaled.toFixed(scaled < 10 ? 1 : 0) + prefix.symbol;
  };

  this.draw = function (graph, options) {

    var options = options || {};
    var maxSize = options.maxSize || 75;
    var baseCharge = options.baseCharge || -70;
    var eoThresholdMin = options.eoThresholdMin || 1.25;
    var muteCategory = options.muteCategory || false;

    this.categories = _.chain(graph.nodes)
      .countBy('category')
      .keys()
      .value();

    var colors = d3.scale.category10()  // XXX inne mapowanie kolorow
      .domain(this.categories);

    graph.links = graph.links.sort(function (a, b) {
      return b.count - a.count;
    });

    // but it hides some data...
    graph.links = graph.links.filter(function (e) {
      return e.oe > eoThresholdMin; // || e.oe < 0.5;
    });

    var sizeScale = d3.scale.pow().exponent(0.25)
      .domain([0, d3.max(graph.nodes, function (d) { return d.count; })])
      .range([0, maxSize]);

    var maxOe = d3.max(graph.links, function (e) { return e.oe; });

    var opacityScale = d3.scale.pow().exponent(0.1)  // XXX do podswietlania moze raczej prawdopodobienstwo warunkowe?
      .domain([options.eoThresholdMin, maxOe])
      .range([0, 1]);

    var force = d3.layout.force()
        .charge(function (d) { return baseCharge * sizeScale(d.count); })
        .linkDistance(0)
        .gravity(0.4)
        .size([width - 200, height])
        .linkStrength(function (e) {
          return e.oe > 1 ? (e.oe - 1) / (maxOe - 1) : 0;
        })
        .nodes(graph.nodes)
        .links(graph.links);

    var node = g.selectAll(".label")
      .data(graph.nodes)
      .enter().append("text")
        .attr("class", "label")
        .style("font-size", function (d) { return sizeScale(d.count); })
        .style("fill", function (d) {
          return colors(d.category);
        })
        .style("opacity", 0.8)
        .on("mouseover", function (d) {
          node.style("opacity", function (d2) {
            var link;
            if (d === d2) {
              return 1;
            } else {
              for (var i = 0; i < graph.links.length; i++) {
                link = graph.links[i];
                if ((link.target === d && link.source === d2) || (link.source === d && link.target === d2)) {
                  return opacityScale(link.oe);
                }
              }
              return 0;
            }
          });
          // XXX napis(?) pod zamist niepasujacego tooltipa
          tooltip.show(siNumberApprox(d.count).replace("k", " tys.") + ":<br>" + d.name);
        })
        .on("mouseout", function () {
          node.style("opacity", 0.8);
          tooltip.out();
        })
        .text(function (d) { return d.name.toLowerCase(); });

    var drag = force.drag();
    node.call(drag);

    force.start();

    force.on("tick", function() {
        node.attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });

        // link.attr("x1", function(e) { return e.source.x; })
        //     .attr("y1", function(e) { return e.source.y; })
        //     .attr("x2", function(e) { return e.target.x; })
        //     .attr("y2", function(e) { return e.target.y; });
    });

  };

  this.createLegend = function () {

    var colors = d3.scale.category10()
      .domain(this.categories);

    var legend = new Legend(selector + " svg");

    legend.g.attr("transform", "translate(650, 50)");

    var legendList = this.categories.map(function (cat) {
      return {name: cat, color: colors(cat)};
    })

    legend.create(legendList);

  };

  this.remove = function () {
    svg.remove();
  }

}
