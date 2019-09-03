/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/* global d3 */
/* global Timeplot, initial_load */
/* global fullrange, startdate, enddate, time_data */
/* global params */

let compare_link = document.head.querySelector('link[rel=compare-locales]').href;
var data;

function renderPlot() {
  var tp = new Timeplot("#my-timeplot");
  var svg = tp.graph_layer;
  var defs = svg.append("defs");

  function genGradient(id, data_) {
    return defs.append("linearGradient")
      .attr("id", id)
      .attr("x2", "0")
      .attr("y2", "100%")
      .selectAll("stop")
      .data(data_)
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color)
      .attr("stop-opacity", (d) => d.opacity);
  }

  genGradient("missingGradient", [
    {offset: "5%", color: "rgb(204, 128, 128)", opacity: ".8"},
    {offset: "95%", color: "rgb(204, 128, 128)", opacity: ".2"}
  ]);
  genGradient("obsoleteGradient", [
    {offset: "5%", color: "#808080", opacity: ".8"},
    {offset: "95%", color: "#808080", opacity: ".2"}
  ]);
  genGradient("unchangedGradient", [
    {offset: "5%", color: "#cccccc", opacity: ".8"},
    {offset: "65%", color: "#cccccc", opacity: ".1"}
  ]);
  var missingArea = d3.area()
    .curve(d3.curveStepAfter)
    .x((d) => tp.x(d.srctime))
    .y0(tp.height)
    .y1((d) => tp.y(d.missing));
  var obsoleteArea = d3.area()
    .curve(d3.curveStepAfter)
    .x((d) => tp.x(d.srctime))
    .y0(tp.height)
    .y1((d) => tp.y(d.obsolete));
  var unchangedArea = d3.area()
    .curve(d3.curveStepAfter)
    .x((d) => tp.x(d.srctime))
    .y0(tp.height)
    .y1((d) => tp.y2(d.unchanged));

  data = time_data;
  tp.drawAxes(
    [startdate, enddate], fullrange,
    [0, d3.max(data.map((d) => d3.max([d.missing, d.obsolete])))],
    [0, d3.max(data.map((d) => d.unchanged))],
    params
  )
  svg.append("path")
    .data([data])
    .attr("d", unchangedArea)
    .attr("class", "unchanged-graph")
    .attr("stroke", "#cccccc")
    .attr("fill", "url(#unchangedGradient)");
  svg.append("path")
    .data([data])
    .attr("d", obsoleteArea)
    .attr("class", "obsolete-graph")
    .attr("stroke", "#808080")
    .attr("fill", "url(#obsoleteGradient)");
  svg.append("path")
    .data([data])
    .attr("d", missingArea)
    .attr("class", "missing-graph")
    .attr("stroke", "red")
    .attr("fill", "url(#missingGradient)");
  var markers = svg.selectAll('a.marker')
    .data(data.slice(0, -1))
    .enter()
    .append('svg:a')
    .attr('class', 'marker missing')
    .attr('xlink:href', (d) => compare_link + '?run=' + d.run)
    .attr('xlink:show', 'new');
  markers.append('path')
    .attr('transform', (d) => `translate(${tp.x(d.srctime)},${tp.y(d.missing)})`)
    .attr("d", d3.symbol().type(d3.symbolCircle)())
  markers.append('title').text((d) => `missing: ${d.missing}`);
  tp.showMilestones();
}

initial_load();
