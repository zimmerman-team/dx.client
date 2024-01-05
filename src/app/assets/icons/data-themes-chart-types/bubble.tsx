import React from "react";
interface Props {
  big?: boolean;
  pathFill?: string;
}
export default function Icon(props: Props) {
  return (
    <svg
      width={props.big ? "74" : "48"}
      height={props.big ? "74" : "48"}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M42 40H9.5C8.83696 40 8.20107 39.7366 7.73223 39.2678C7.26339 38.7989 7 38.163 7 37.5V5H9.5V37.5H42V40Z"
        fill="#262C34"
      />
      <circle
        cx="28.5785"
        cy="14.5484"
        r="4.06357"
        transform="rotate(-48.5555 28.5785 14.5484)"
        fill="#262C34"
      />
      <circle
        cx="31.8731"
        cy="29.5825"
        r="4.51508"
        transform="rotate(90 31.8731 29.5825)"
        fill="#262C34"
      />
      <circle
        cx="20.8504"
        cy="24.0105"
        r="4.51508"
        transform="rotate(-120 20.8504 24.0105)"
        fill="#262C34"
      />
      <circle
        cx="31.4472"
        cy="21.0295"
        r="2.25754"
        transform="rotate(-48.5555 31.4472 21.0295)"
        fill="#262C34"
      />
      <circle
        cx="35.9624"
        cy="14.7083"
        r="2.25754"
        transform="rotate(-48.5555 35.9624 14.7083)"
        fill="#262C34"
      />
      <circle
        cx="37.2911"
        cy="25.0668"
        r="1.80603"
        transform="rotate(90 37.2911 25.0668)"
        fill="#262C34"
      />
      <circle
        cx="18.4164"
        cy="30.6296"
        r="1.80603"
        transform="rotate(-120 18.4164 30.6296)"
        fill="#262C34"
      />
      <circle
        cx="38.194"
        cy="33.1947"
        r="1.80603"
        transform="rotate(90 38.194 33.1947)"
        fill="#262C34"
      />
      <circle
        cx="13.5707"
        cy="24.0427"
        r="1.80603"
        transform="rotate(-120 13.5707 24.0427)"
        fill="#262C34"
      />
    </svg>
  );
}
