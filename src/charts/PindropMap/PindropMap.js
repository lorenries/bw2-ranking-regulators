import * as d3 from "d3";
import * as topojson from "topojson";
import Tooltip from "../../components/Tooltip/Tooltip";

export default class PindropMap {
  constructor(el, data) {
    this.element = el;
    this.data = data;
    this.width = el.offsetWidth;
    this.height = (2 * el.offsetWidth) / 5;
  }

  loadGeometry(geometry) {
    if (geometry === "world") {
      fetch(
        "https://s3-us-west-2.amazonaws.com/na-data-projects/geography/world.json"
      )
        .then(response => response.json())
        .then(world => {
          this.features = topojson.feature(
            world,
            world.objects.countries
          ).features;
          this.projection = d3
            .geoEquirectangular()
            .fitSize(
              [this.width, this.height],
              topojson.feature(world, world.objects.countries)
            );
          this.path = d3.geoPath().projection(this.projection);
          this.draw();
        });
    } else if (geometry === "us") {
      fetch(
        "https://s3-us-west-2.amazonaws.com/na-data-projects/geography/us.json"
      )
        .then(response => response.json())
        .then(us => {
          this.features = topojson.feature(us, us.objects.states).features;
          this.projection = d3
            .geoAlbersUsa()
            .fitSize([this.width, this.height], feature);
          this.path = d3.geoPath().projection(this.projection);
          this.draw();
        });
    }
    return this;
  }

  draw() {
    this.element.innerHTML = "";
    this.svg = d3
      .select(this.element)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
    this.g = this.svg.append("g");
    this.g
      .selectAll("path")
      .data(this.features)
      .enter()
      .append("path")
      .attr("d", d => this.path(d))
      .attr("fill", "#CBCBCD")
      .attr("stroke", "white");

    this.pins = this.g
      .selectAll("circle")
      .data(this.data)
      .enter()
      .append("circle")
      .attr("cx", d => this.projection([d.lon, d.lat])[0])
      .attr("cy", d => this.projection([d.lon, d.lat])[1])
      .attr("r", 5)
      .attr("fill", "#2ebcb3")
      .attr("stroke", "white")
      .attr("stroke-width", "1px")
      .on("mouseover", function(d) {
        d3.select(this).attr("stroke-width", 2);
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("stroke-width", 1);
      });
    return this;
  }

  tooltip(tooltipTemplate) {
    const tip = new Tooltip();

    this.pins
      .on("mouseover", function(d) {
        // d3.select(this).attr("stroke-width", 2);
        console.log("mouseover");
        tip.show(d3.event).html(tooltipTemplate(d));
      })
      .on("mouseout", function(d) {
        // d3.select(this).attr("stroke-width", 1);
        tip.hide();
      });

    return this;
  }

  zoomable(bool) {
    if (bool) {
      this.zoom = d3.zoom().on("zoom", () => {
        this.g.attr("transform", d3.event.transform);
        this.g
          .selectAll("circle")
          .attr("d", this.path.projection(this.projection));
        this.g
          .selectAll("path")
          .attr("d", this.path.projection(this.projection));
      });
      this.svg.call(this.zoom);
    }
    return this;
  }
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
