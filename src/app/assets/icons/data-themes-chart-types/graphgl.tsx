import React from "react";

interface Props {
  big?: boolean;
  pathFill?: string;
}
export default function Icon(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.big ? "74" : "48"}
      height={props.big ? "74" : "48"}
      viewBox="0 0 48 48"
      fill="none"
    >
      <circle
        cx="28.1897"
        cy="13.9397"
        r="5.62503"
        transform="rotate(-48.5555 28.1897 13.9397)"
        fill="#262C34"
      />
      <circle
        cx="32.7503"
        cy="34.7514"
        r="6.25004"
        transform="rotate(90 32.7503 34.7514)"
        fill="#262C34"
      />
      <circle
        cx="17.492"
        cy="27.0391"
        r="6.25004"
        transform="rotate(-120 17.492 27.0391)"
        fill="#262C34"
      />
      <circle
        cx="32.1609"
        cy="22.9115"
        r="3.12502"
        transform="rotate(-48.5555 32.1609 22.9115)"
        fill="#262C34"
      />
      <circle
        cx="17.4109"
        cy="15.4105"
        r="3.12502"
        transform="rotate(-48.5555 17.4109 15.4105)"
        fill="#262C34"
      />
      <circle
        cx="38.4109"
        cy="14.1616"
        r="3.12502"
        transform="rotate(-48.5555 38.4109 14.1616)"
        fill="#262C34"
      />
      <circle
        cx="40.2503"
        cy="28.5005"
        r="2.50002"
        transform="rotate(90 40.2503 28.5005)"
        fill="#262C34"
      />
      <circle
        cx="14.1228"
        cy="36.2009"
        r="2.50002"
        transform="rotate(-120 14.1228 36.2009)"
        fill="#262C34"
      />
      <circle
        cx="41.5"
        cy="39.7517"
        r="2.50002"
        transform="rotate(90 41.5 39.7517)"
        fill="#262C34"
      />
      <circle
        cx="7.41507"
        cy="27.083"
        r="2.50002"
        transform="rotate(-120 7.41507 27.083)"
        fill="#262C34"
      />
      <circle
        cx="11.4151"
        cy="18.415"
        r="2.50002"
        transform="rotate(-120 11.4151 18.415)"
        fill="#262C34"
      />
      <circle
        cx="11.4151"
        cy="10.4151"
        r="2.50002"
        transform="rotate(-120 11.4151 10.4151)"
        fill="#262C34"
      />
    </svg>
  );
}
