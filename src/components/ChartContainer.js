import React from "react";
import "../scss/ChartContainer.scss";

const Title = props => <h3 className="chart__title">{props.title}</h3>;
const Subtitle = props => <h4 className="chart__subtitle">{props.subtitle}</h4>;
const Source = props => (
  <span className="chart__source">Source: {props.source}</span>
);
const ChartContainer = props => (
  <div className="chart">
    <div className="chart__meta-container">
      {props.title ? <Title title={props.title} /> : null}
      {props.subtitle ? <Subtitle subtitle={props.subtitle} /> : null}
    </div>
    <div
      className="chart__figure"
      style={{
        height: props.heightstyle,
        width: "100%",
        maxWidth: "1200px",
        marginLeft: "auto",
        marginRight: "auto"
      }}
    >
      {props.children}
    </div>
    <div className="chart__meta-container">
      {props.source ? <Source source={props.source} /> : null}
    </div>
  </div>
);

export default ChartContainer;
