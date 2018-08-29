import "./index.scss";
import "react-table/react-table.css";
import "./scss/DataTable.scss";
import * as d3 from "d3";
import React from "react";
import ReactDOM from "react-dom";
import PindropMap from "./charts/PindropMap";
import ReactTable from "react-table";
import rawData from "./data/all.csv";
import {CheckMark, XMark, YellowCircle} from "./components/icons.js"

const data = d3.csvParse(rawData);

  d3.json("http://na-data-projects.s3.amazonaws.com/data/bw2/ranking_regulators.json", data => {
    console.log(data)
  })

const settings = {
  bw2_ranking_regulators_column_chart: {
    init: mixedTableBarInit
  },
  bw2_ranking_regulators_pindrop_map: {
    init: mapInit
  },
  bw2_ranking_regulators_data_table: {
    init: dataTableInit
  }
};

window.renderDataViz = function(el) {
  var id = el.getAttribute("id");
  settings[id].init(el);
};

function dataTableInit(el) {
  class DataTable extends React.Component {
    constructor() {
      super();
      const cleanData = data.map(row => {
          return {
            ...row,
            Ranking: +row["Ranking"],
            "Total Score": +row["Total Score"]
          }
        });
      cleanData.columns = data.columns;
        console.log(cleanData)
      this.state = {
        data: cleanData
      };
    }
    render() {
      const { data } = this.state;
      const columns = data.columns;
      return (
        <div>
          <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", alignItems: "center", paddingBottom: "0.5rem"}}>
              <CheckMark width="25px" height="25px" style={{paddingRight: "0.5rem"}} /><span style={{fontSize: "12px"}}>Adequate information indicating the regulator's active participation and substantial progress made to incorporate ESG issues in insurance sector supervision (10)</span>
            </div>
            <div style={{display: "flex", alignItems: "center", paddingBottom: "0.5rem"}}>
              <YellowCircle width="25px" height="25px" style={{paddingRight: "0.5rem"}} /><span style={{fontSize: "12px"}}>Sufficient information indicating the regulator's intention in the incorporation of ESG issues in insurance industry supervision (5)</span>
            </div>
            <div style={{display: "flex", alignItems: "center", paddingBottom: "0.5rem"}}>
              <XMark width="25px" height="25px" style={{paddingRight: "0.5rem"}} /><span style={{fontSize: "12px"}}>No/insufficient information about regulators’ push for sustainable insurance (0)</span>
            </div>
          </div>
          <ReactTable
            data={this.state.data}
            minRows={0}
            className="-striped"
            showPagination={false}
            columns={columns
              .filter(val => val !== "lat" && val !== "lon")
              .map((val) => {
                return {
                  Header: val,
                  accessor: val,
                  minWidth: val === "Regulators" ? 400 : 200,
                  headerClassName: val === "Regulators" ? "-sticky" : null,
                  className: val === "Regulators" ? "-sticky -centered" : "-centered",
                  Cell: row => {
                    if (val === "Does the regulator hold multi-stakeholder consultations (e.g. private sector, civil society) around ESG risks?") {
                      row.value = row.original[val]
                    }
                    if (val === "Does the regulator promote sustainable investment management practices (e.g. GreenFinance)?") {
                      row.value = row.original[val]
                    }
                    return row.value === "10" && val !== "Ranking" ? (
                      <CheckMark width="15px" height="15px"/>
                    ) : row.value === "0" && val !== "Ranking" ? (
                      <XMark width="15px" height="15px"/>
                    ) : row.value === "5" && val !== "Ranking" ? (
                      <YellowCircle width="15px" height="15px"/>
                    ) : (
                      row.value
                    );
                  },
                  sortMethod: (a, b) => {
                    if (val.length > 15) return +a > +b ? 1 : -1;
                    a = a === null || a === undefined ? -Infinity : a;
                    b = b === null || b === undefined ? -Infinity : b;
                    // force any string values to lowercase
                    a = typeof a === "string" ? a.toLowerCase() : a;
                    b = typeof b === "string" ? b.toLowerCase() : b;
                    // Return either 1 or -1 to indicate a sort priority
                    if (a > b) {
                      return 1;
                    }
                    if (a < b) {
                      return -1;
                    }
                    // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
                    return 0;
                  }
                };
              })}
            />
        </div>
      );
    }
  }

  ReactDOM.render(<DataTable />, el);
}

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
      title="Insurance Regulators Map"
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

  var meta = d3.select(el)
    .append("div")
    .classed("chart__meta-container", true)

  var title = meta
    .append("h3")
    .text("Global Regulators on Sustainable Insurance Ranking (GRSIR)")
    .classed("chart__title", true)

  var container = d3.select(el)
    .append("div")
    .classed("overflow-auto", true)

  var table = container
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
