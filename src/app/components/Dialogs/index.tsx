import React from "react";

import EmptyRowsDialog from "./emptyRowsDialog";
import UntitledStoryDialog from "./untitledStoryDialog";

export function AppDialogs() {
  return (
    <React.Fragment>
      <EmptyRowsDialog />
      <UntitledStoryDialog />
    </React.Fragment>
  );
}
