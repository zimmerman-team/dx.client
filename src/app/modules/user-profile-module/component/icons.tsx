interface RightIconProps {
  active: boolean;
}
export const RightIcon = ({ active }: RightIconProps) => {
  return (
    <svg
      width="5"
      height="10"
      viewBox="0 0 5 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 10L5 5L0 0L0 10Z" fill={active ? "#6061E5" : "#231D2C"} />
    </svg>
  );
};

export const LogOutIcon = ({ active }: RightIconProps) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 0H2C0.89 0 0 0.89 0 2V6H2V2H16V16H2V12H0V16C0 16.5304 0.210714 17.0391 0.585786 17.4142C0.960859 17.7893 1.46957 18 2 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V2C18 0.89 17.1 0 16 0ZM7.08 12.58L8.5 14L13.5 9L8.5 4L7.08 5.41L9.67 8H0V10H9.67L7.08 12.58Z"
        fill={active ? "#6061E5" : "#231D2C"}
      />
    </svg>
  );
};

export const InfoIcon = () => {
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 5.90137H11V7.90137H9V5.90137ZM9 9.90137H11V15.9014H9V9.90137ZM10 0.901367C4.48 0.901367 0 5.38137 0 10.9014C0 16.4214 4.48 20.9014 10 20.9014C15.52 20.9014 20 16.4214 20 10.9014C20 5.38137 15.52 0.901367 10 0.901367ZM10 18.9014C5.59 18.9014 2 15.3114 2 10.9014C2 6.49137 5.59 2.90137 10 2.90137C14.41 2.90137 18 6.49137 18 10.9014C18 15.3114 14.41 18.9014 10 18.9014Z"
        fill="#231D2C"
      />
    </svg>
  );
};

export const PrintIcon = () => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_18129_16287)">
        <path
          d="M19 8.90137H18V3.90137H6V8.90137H5C3.34 8.90137 2 10.2414 2 11.9014V17.9014H6V21.9014H18V17.9014H22V11.9014C22 10.2414 20.66 8.90137 19 8.90137ZM8 5.90137H16V8.90137H8V5.90137ZM16 17.9014V19.9014H8V15.9014H16V17.9014ZM18 15.9014V13.9014H6V15.9014H4V11.9014C4 11.3514 4.45 10.9014 5 10.9014H19C19.55 10.9014 20 11.3514 20 11.9014V15.9014H18Z"
          fill="#231D2C"
        />
        <path
          d="M18 13.4014C18.5523 13.4014 19 12.9537 19 12.4014C19 11.8491 18.5523 11.4014 18 11.4014C17.4477 11.4014 17 11.8491 17 12.4014C17 12.9537 17.4477 13.4014 18 13.4014Z"
          fill="#231D2C"
        />
      </g>
      <defs>
        <clipPath id="clip0_18129_16287">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 0.901367)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
