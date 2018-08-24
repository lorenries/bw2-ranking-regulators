import d3 from "d3";
import React from "react";

export default class HorizontalBarChart extends React.Component {
  constructor(opts) {
    // load in arguments from config object
    this.element = opts.element;
    this.data = opts.data;
    this.x = 0;
    this.y = 1;
    // create the chart
    this.draw();
  }

  x(value) {
    this.x = value;
  }

  y(value) {
    this.y = value;
  }

  xAxisLabel(value) {
    this.xAxisLabel = value
  }

  yAxisLabel(value) {
    this.yAxisLabel = value
  }

  title(value) {
    this.title = value;
  }

  subTitle(value) {
    this.subTitle = value;
  }

  source(value) {
    this.source = source;
  }

  showTooltips(bool) {
    this.showTooltips = bool;
  }

  width(number) {
    this.w = number
  }

  height(number) {
    this.h = number;
  }

  draw() {
    // define width, height and margin
    this.width = this.element.offsetWidth;
    this.height = this.width / 2;
    this.margin = {
        top: 20,
        right: 75,
        bottom: 45,
        left: 50
    };

    // set up parent element and SVG
    this.element.innerHTML = '';
    const el = d3.select(this.element)
    if (this.title) {
      // append title
    }
    if (this.subTitle) {
      // append subtitle
    }
    if (this.caption) {
      // append caption
    }
    const svg = el.append('svg');
    svg.attr('width',  this.width);
    svg.attr('height', this.height);

    // we'll actually be appending to a <g> element
    this.plot = svg.append('g')
        .attr('transform',`translate(${this.margin.left},${this.margin.top})`);

    // create the other stuff
    this.createScales();
    this.addAxes();
    this.addLine();
  }

  createScales() {
    // shorthand to save typing later
    const m = this.margin;

    // calculate max and min for data
    const xExtent = d3.extent(this.data, d => d[this.x]);
    const yExtent = d3.extent(this.data, d => d[this.y]);

    this.xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[this.x])])
      .range([m.left, this.width - m.right])

    this.yScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([m.top, this.height - m.bottom])
      .padding(0.1)

    // force zero baseline if all data points are positive
    if (yExtent[0] > 0) { yExtent[0] = 0; };

    this.xScale = d3.scaleTime()
      .range([0, this.width - m.right])
      .domain(xExtent);

    this.yScale = d3.scaleLinear()
      .range([this.height - (m.top + m.bottom), 0])
      .domain(yExtent);
  }

  addAxes() {
    const m = this.margin;

    // create and append axis elements
    // this is all pretty straightforward D3 stuff
    const xAxis = d3.axisBottom()
      .scale(this.xScale)
      .ticks(d3.timeMonth);

    const yAxis = d3.axisLeft()
      .scale(this.yScale)
      .tickFormat(d3.format("d"));

    this.plot.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${this.height - (m.top + m.bottom)})`)
      .call(xAxis);

    this.plot.append("g")
      .attr("class", "y axis")
      .call(yAxis)
  }

  render() {
    return (
      { this.state.title ? `<Title />` : null}
      { this.state.subTitle ? `<SubTitle />` : null}
      { this.state.caption ? `<Caption />` : null}
    )
  }
}