import React from "react";

interface Props {
  tabs: { value: string; label: string; icon?: React.ReactNode }[];
  handleSwitch: (key: any) => void;
  activeTab: string;
  setActiveTab: (key: any) => void;
}
export default function BasicSwitch(props: Props) {
  const currentIndex = props.tabs.findIndex(
    (tab) => tab.value === props.activeTab
  );
  const [activeIndex, setActiveIndex] = React.useState(currentIndex);
  const handleTabSwitch = (key: string, index: number) => {
    setActiveIndex(index);
    props.handleSwitch(key);
  };
  return (
    <div
      css={`
        display: flex;
        background: #dadaf8;
        border-radius: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        gap: 8px;
        position: relative;
        width: 100%;
        height: 100%;
        button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          text-transform: uppercase;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          border: none;
          justify-content: center;
          z-index: 1;
          cursor: pointer;
          :hover {
            opacity: 0.8;
          }
        }
      `}
    >
      {props.tabs.map((tab, index) => (
        <button
          key={tab.value}
          onClick={() => handleTabSwitch(tab.value, index)}
          data-cy={tab.value}
          css={`
            background: transparent;
            font-weight: ${props.activeTab === tab.value ? "bold" : "medium"};
            color: ${props.activeTab === tab.value ? "white" : "#231D2C"};
          `}
        >
          {tab.icon && tab.icon} {tab.label}
        </button>
      ))}

      <div
        css={`
          position: absolute;
          background: #6061e5;
          border-radius: 30px;
          height: calc(100% - 13px);
          transform-box: fill-box;
          width: calc(100% / 2 - 6.5px);
          left: 6.5px;
          top: 6.5px;
          transform: ${activeIndex === 0
            ? "translateX(0%)"
            : "translateX(100%)"};
          transition: transform 0.3s, width 0.3s;
        `}
      ></div>
    </div>
  );
}
