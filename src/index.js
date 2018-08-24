import "./index.scss";
import "./charts/Table/Table.scss";
// import HorizontalBarChart from "./charts/HorizontalBarChart";
// import PindropMap from "./charts/PindropMap";
import * as d3 from "d3";
import * as topojson from "topojson";
import data from "./data/all.csv";

import Tooltip from "./components/Tooltip/Tooltip";
import PindropMap from "./charts/PindropMap/PindropMap";

const settings = {
  bw2_ranking_regulators_column_chart: {
    init: bw2ColumnChart
  },
  bw2_ranking_regulators_pindrop_map: {
    init: bw2Map
  }
};

window.renderDataViz = function(el) {
  var id = el.getAttribute("id");
  settings[id].init(el);
};

function bw2Map(el) {
  const mapData = d3.csvParse(data).map(row => {
    return {
      Regulators: row["Regulators"],
      "Type/Country": row["Type/Country"],
      lat: row["lat"],
      lon: row["lon"],
      "Total Score": row["Total Score"],
      Ranking: row["Ranking"]
    };
  });
  const map = new PindropMap(el, mapData);

  const tooltipTemplate = d => `
        <div class="tooltip__title-container">
          <h1 class="tooltip__title">${d["Regulators"]}</h1>
        </div>
        <div class="tooltip__category">
            <div class="tooltip__category__list-item">
              <span class="tooltip__category__list-item__label">Type/Country:</span>
              <span class="tooltip__category__list-item__value">${
                d["Type/Country"]
              }</span>
            </div>
            <div class="tooltip__category__list-item">
              <span class="tooltip__category__list-item__label">Ranking:</span>
              <span class="tooltip__category__list-item__value">${
                d["Ranking"]
              }</span>
            </div>
            <div class="tooltip__category__list-item">
              <span class="tooltip__category__list-item__label">Total Score:</span>
              <span class="tooltip__category__list-item__value">${
                d["Total Score"]
              }</span>
            </div>
        </div>
      `;

  map.loadGeometry("world").then(map => map.tooltip(tooltipTemplate));
}

// function bw2Map(el) {
//   const mapData = d3.csvParse(data).map(row => {
//     return {
//       Regulators: row["Regulators"],
//       "Type/Country": row["Type/Country"],
//       lat: row["lat"],
//       lon: row["lon"],
//       "Total Score": row["Total Score"],
//       Ranking: row["Ranking"]
//     };
//   });
//   el.style.width = "100%";
//   const width = el.offsetWidth;
//   const height = (2 * el.offsetWidth) / 5;
//   const svg = d3
//     .select(el)
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height);

//   const g = svg.append("g");

//   fetch(
//     "https://s3-us-west-2.amazonaws.com/na-data-projects/geography/world.json"
//   )
//     .then(response => response.json())
//     .then(world => {
//       const projection = d3
//         .geoEquirectangular()
//         .fitSize(
//           [width, height],
//           topojson.feature(world, world.objects.countries)
//         );

//       const path = d3.geoPath().projection(projection);

//       const tip = new Tooltip();
//       const tooltipTemplate = d => `
//         <div class="tooltip__title-container">
//           <h1 class="tooltip__title">${d["Regulators"]}</h1>
//         </div>
//         <div class="tooltip__category">
//             <div class="tooltip__category__list-item">
//               <span class="tooltip__category__list-item__label">Type/Country:</span>
//               <span class="tooltip__category__list-item__value">${
//                 d["Type/Country"]
//               }</span>
//             </div>
//             <div class="tooltip__category__list-item">
//               <span class="tooltip__category__list-item__label">Ranking:</span>
//               <span class="tooltip__category__list-item__value">${
//                 d["Ranking"]
//               }</span>
//             </div>
//             <div class="tooltip__category__list-item">
//               <span class="tooltip__category__list-item__label">Total Score:</span>
//               <span class="tooltip__category__list-item__value">${
//                 d["Total Score"]
//               }</span>
//             </div>
//         </div>
//       `;

//       g.selectAll("path")
//         .data(topojson.feature(world, world.objects.countries).features)
//         .enter()
//         .append("path")
//         .attr("d", path)
//         .attr("fill", "#CBCBCD")
//         .attr("stroke", "white");

//       g.selectAll("circle")
//         .data(mapData)
//         .enter()
//         .append("circle")
//         .attr("cx", d => projection([d.lon, d.lat])[0])
//         .attr("cy", d => projection([d.lon, d.lat])[1])
//         .attr("r", 5)
//         .attr("fill", "#2ebcb3")
//         .attr("stroke", "white")
//         .attr("stroke-width", "1px")
//         .on("mouseover", function(d) {
//           d3.select(this).attr("stroke-width", 2);
//           tip.show(d3.event).html(tooltipTemplate(d));
//         })
//         .on("mouseout", function() {
//           d3.select(this).attr("stroke-width", 1);
//           tip.hide();
//         });

//       const zoom = d3.zoom().on("zoom", () => {
//         g.attr("transform", d3.event.transform);
//         g.selectAll("circle").attr("d", path.projection(projection));
//         g.selectAll("path").attr("d", path.projection(projection));
//       });

//       // svg.call(zoom);
//     });
// }

function bw2ColumnChart(el) {
  const filteredData = d3
    .csvParse(data)
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
