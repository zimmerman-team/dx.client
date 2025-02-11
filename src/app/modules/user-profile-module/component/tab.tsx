import React from "react";
import { tabcss } from "app/modules/user-profile-module/style";

interface TabProps {
  title: string;
  active: boolean;
  handleClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  component: () => JSX.Element;
  disabled: boolean;
}

export default function Tab(props: TabProps) {
  return (
    <div
      onClick={props.handleClick}
      css={tabcss(props.active, props.disabled)}
      data-cy="profile-tab"
    >
      <p>{props.title}</p>
      <div
        css={`
          line-height: 0;
        `}
      >
        {props.component()}
      </div>
    </div>
  );
}
