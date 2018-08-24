import "./Tooltip.scss";
import * as d3 from "d3";

export default class Tooltip {
  constructor() {
    let tooltipClass = "tooltip hidden";
    const nonScrollXPadding = 15;
    const scrollXPadding = 2;
    tooltipClass += this.tooltipScrollable ? " scrollable" : "";
    this.xPadding = this.tooltipScrollable ? scrollXPadding : nonScrollXPadding;

    this.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", tooltipClass);

    if (this.tooltipScrollable) {
      this.tooltip.append("div").attr("class", "tooltip__fadeout__top");
      this.tooltip.append("div").attr("class", "tooltip__fadeout__bottom");
    }

    this.contentContainer = this.tooltip
      .append("div")
      .attr("class", "tooltip__content-container");
  }

  html(content) {
    this.contentContainer.html(content);
    return this;
  }

  show(e) {
    if (window.innerWidth < 450) {
      return;
    }
    let mouse = [e.pageX, e.pageY];
    this.tooltip.classed("hidden", false);
    let tooltipCoords = this.getTooltipCoords(mouse);
    this.tooltip.attr(
      "style",
      "left:" + tooltipCoords[0] + "px; top:" + tooltipCoords[1] + "px"
    );
    return this;
  }

  hide() {
    this.tooltip.classed("hidden", true);
    return this;
  }

  getTooltipCoords(mouse) {
    let retCoords = mouse;
    let windowWidth = window.innerWidth;
    let tooltipHeight = this.tooltip.node().offsetHeight;
    let tooltipWidth = this.tooltip.node().offsetWidth;

    if (mouse[0] > windowWidth - tooltipWidth - this.xPadding) {
      retCoords[0] = mouse[0] - tooltipWidth - 50;
      retCoords[0] -= this.xPadding;
    } else {
      retCoords[0] += this.xPadding;
    }

    retCoords[1] -= tooltipHeight / 2 + 15;
    return retCoords;
  }
}
