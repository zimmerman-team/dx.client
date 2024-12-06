import { IHeaderDetails } from "app/modules/report-module/components/right-panel/data";
import { IFramesArray } from "app/modules/report-module/views/create/data";
import _ from "lodash";
import { EditorState } from "draft-js";

export const compareHeaderDetailsState = (
  headerDetailsProps: IHeaderDetails,
  headerDetailsState: IHeaderDetails
) => {
  // Check if the keys are the same
  const propsKeys = Object.keys(headerDetailsProps);
  const stateKeys = Object.keys(headerDetailsState);

  if (propsKeys.length !== stateKeys.length) {
    return false;
  }

  // Check if all keys in headerDetailsProps are present in headerDetailsState
  for (const key of propsKeys) {
    if (!stateKeys.includes(key)) {
      return false;
    }
  }

  // Check if all values are the same
  for (const key of propsKeys) {
    if (key === "description" || key === "heading") {
      if (
        headerDetailsProps[key].getCurrentContent().getPlainText() !==
        headerDetailsState[key].getCurrentContent().getPlainText()
      ) {
        return false;
      }
    } else {
      if (
        headerDetailsProps[key as keyof typeof headerDetailsProps] !==
        headerDetailsState[key as keyof typeof headerDetailsState]
      ) {
        return false;
      }
    }
  }

  return true;
};

export const compareFramesArrayState = (
  framesArrayProps: IFramesArray[],
  framesArrayState: IFramesArray[]
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  if (framesArrayProps.length !== framesArrayState.length) {
    return false;
  }

  for (let i = 0; i < framesArrayProps.length; i++) {
    const itemProps = _.omit(
      framesArrayProps[i],
      "id",
      "frame.rowId",
      "frame.handlePersistReportState",
      "frame.handleRowFrameItemResize",
      "frame.previewItems"
    );
    const itemState = _.omit(
      framesArrayState[i],
      "id",
      "frame.rowId",
      "frame.handlePersistReportState",
      "frame.handleRowFrameItemResize",
      "frame.previewItems"
    );

    const itemPropsKeys = Object.keys(itemProps);
    const itemStateKeys = Object.keys(itemState);

    if (itemPropsKeys.length !== itemStateKeys.length) {
      return false;
    }

    // Check if all keys in itemPropsKeys are in itemStateKeys
    for (const key of itemPropsKeys) {
      if (!itemStateKeys.includes(key)) {
        return false;
      }
    }

    // Check if all values are the same
    for (const key of itemPropsKeys) {
      if (key === "content") {
        for (let i = 0; i < itemProps.content.length; i++) {
          const itemPropsContent = itemProps.content[i];
          const itemStateContent = itemState.content[i];
          if (
            itemPropsContent instanceof EditorState &&
            itemStateContent instanceof EditorState
          ) {
            if (
              itemPropsContent.getCurrentContent().getPlainText() !==
              itemStateContent.getCurrentContent().getPlainText()
            ) {
              return false;
            }
          } else if (!_.isEqual(itemProps.content[i], itemState.content[i])) {
            return false;
          }
        }
      } else {
        if (
          !_.isEqual(
            itemProps[key as keyof typeof itemProps],
            itemState[key as keyof typeof itemState]
          )
        ) {
          return false;
        }
      }
    }
  }
  return true;
};
