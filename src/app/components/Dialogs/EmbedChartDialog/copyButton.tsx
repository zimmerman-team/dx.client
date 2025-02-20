import { PrimaryButton } from "app/components/Styled/button";
import React from "react";

export default function CopyButton(props: {
  handleCopyToClipboard: () => void;
  name: string;
}) {
  return (
    <PrimaryButton size="big" bg="light" onClick={props.handleCopyToClipboard}>
      {props.name}
    </PrimaryButton>
  );
}
