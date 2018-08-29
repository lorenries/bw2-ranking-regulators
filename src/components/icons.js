  import React from "react";
  
  const CheckMark = (props) => (
    <svg
      className="passfailcheck"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 17.33 13.75"
      style={{
        ...props.style,
        fill: "none",
        stroke: "#2dbbb3",
        strokeLinecap: "square",
        strokeWidth: "4px",
        width: props.width,
        height: props.height
      }}
    >
      <title>check-mark</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <polyline
            className="check-mark"
            points="3.53 6.9 7.07 10.26 13.79 3.54"
          />
        </g>
      </g>
    </svg>
  );
  const XMark = (props) => (
    <svg
      className="passfailcheck"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 13.32 13.32"
      style={{
        ...props.style,
        fill: "none",
        stroke: "#e65c64",
        strokeLinecap: "square",
        strokeWidth: "3px",
        width: props.width,
        height: props.height
      }}
    >
      <title>x-mark</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <line className="x-mark" x1="3.54" y1="3.54" x2="9.78" y2="9.78" />
          <line className="x-mark" x1="9.78" y1="3.54" x2="3.54" y2="9.78" />
        </g>
      </g>
    </svg>
  );
  const YellowTriangle = (props) => (<svg style={{...props.style, width: props.width, height: props.height}} viewBox="0 0 101 90" xmlns="http://www.w3.org/2000/svg"><path d="M99.746 78.559L57.208 3.932c-2.985-5.243-10.672-5.243-13.663 0L1.007 78.559c-2.918 5.118.853 11.435 6.834 11.435h85.07c5.982 0 9.753-6.317 6.835-11.435z" fill="#F1D638" fillRule="nonzero" /></svg>)
  const YellowCircle = (props) => (<svg style={{...props.style, width: props.width, height: props.height}} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="4" fill="#F1D638" /></svg>)

  export {CheckMark, XMark, YellowTriangle, YellowCircle}