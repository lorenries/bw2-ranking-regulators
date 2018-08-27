import "./index.scss";
import "./charts/Table/Table.scss";
import * as d3 from "d3";
import React from "react";
import ReactDOM from "react-dom";
import PindropMap from "./charts/PindropMap";
import rawData from "./data/all.csv";

const data = d3.csvParse(rawData);

const settings = {
  bw2_ranking_regulators_column_chart: {
    init: mixedTableBarInit
  },
  bw2_ranking_regulators_pindrop_map: {
    init: mapInit
  }
};

window.renderDataViz = function(el) {
  var id = el.getAttribute("id");
  settings[id].init(el);
};

function dataTableInit() {}

function mapInit(el) {
  const tooltipTemplate = d => (
    <div>
      <div className="tooltip__title-container">
        <h1 className="tooltip__title">{d["Regulators"]}</h1>
      </div>
      <div className="tooltip__category">
        <div className="tooltip__category__list-item">
          <span className="tooltip__category__list-item__label">
            Type/Country:
          </span>
          <span className="tooltip__category__list-item__value">
            {d["Type/Country"]}
          </span>
        </div>
        <div className="tooltip__category__list-item">
          <span className="tooltip__category__list-item__label">Ranking:</span>
          <span className="tooltip__category__list-item__value">
            {d["Ranking"]}
          </span>
        </div>
        <div className="tooltip__category__list-item">
          <span className="tooltip__category__list-item__label">
            Total Score:
          </span>
          <span className="tooltip__category__list-item__value">
            {d["Total Score"]}
          </span>
        </div>
      </div>
    </div>
  );

  ReactDOM.render(
    <PindropMap
      data={data}
      geometry="world"
      width={el.offsetWidth}
      height={(2 * el.offsetWidth) / 5}
      title="Test Title"
      subtitle="test SubTitle"
      tooltip={tooltipTemplate}
    />,
    el
  );
}

function mixedTableBarInit(el) {
  const filteredData = data
    .map(row => {
      return {
        Ranking: row["Ranking"],
        Regulator: row["Regulators"],
        "Type/Country": row["Type/Country"],
        "Total Score": row["Total Score"]
      };
    })
    .sort(function(x, y) {
      return d3.ascending(+x["Ranking"], +y["Ranking"]);
    });

  const columns = d3.keys(filteredData[0]);

  // Setup the scale for the values for display, use abs max as max value
  var x = d3
    .scaleLinear()
    .domain([0, d3.max(filteredData, d => d["Total Score"])])
    .range([0, 100]);

  var table = d3
    .select(el)
    .append("table")
    .classed("table dataTable", true);

  var tbody = table.append("tbody");
  var thead = table.append("thead");

  thead
    .append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text(function(d) {
      return d;
    });

  // Create a table with rows and bind a data row to each table row
  var tr = tbody
    .selectAll("tr.data")
    .data(filteredData)
    .enter()
    .append("tr")
    .attr("class", "datarow");

  // Set the odd columns for styling
  d3.selectAll(".datarow")
    .filter(":nth-child(odd)")
    .attr("class", "odd");

  tr.append("td")
    .attr("class", "rank sorting_1")
    .text(function(d) {
      return d["Ranking"];
    });

  // Create the regulator column
  tr.append("td")
    .attr("class", "rank")
    .text(function(d) {
      return d["Regulator"];
    });

  // Create the Type / Country column
  tr.append("td")
    .attr("class", "type")
    .text(function(d) {
      return d["Type/Country"];
    });

  // Create a column at the end of the table for the chart
  var chart = tr
    .append("td")
    .attr("class", "chart")
    .style("vertical-align", "middle")
    .style("min-width", "16rem");
  // .attr("width", "40%");

  // Create the div structure of the chart
  chart.append("div").attr("class", "bar-container");

  tr.selectAll("div.bar-container")
    .style("width", "0%")
    .transition()
    .duration(500)
    .style("background-color", "#2ebcb3")
    .style("height", "18px")
    .style("width", d => `${x(d["Total Score"])}%`)
    .text(d => d["Total Score"])
    .style("color", "white")
    .style("text-align", "right")
    .style("padding-right", "5px");
}
