import { FilterGroupOptionModel } from "app/components/ToolBoxPanel/components/filters/data";

export const getAllOptionsCount = (options: FilterGroupOptionModel[]) => {
  let allOptionsCount = 0;
  //recursively checks the length of the options array and all of its subOptions arrays
  const checkOptionsCount = (options: FilterGroupOptionModel[]) => {
    allOptionsCount += options.length;
    options.forEach((option: FilterGroupOptionModel) => {
      if (option?.subOptions) {
        checkOptionsCount(option.subOptions);
      }
    });
  };

  checkOptionsCount(options);
  return allOptionsCount;
};

const compareArrays = (subTemp: any[], temp: any[]) => {
  //checks if temp array contains any of the values in the subTemp array
  //i.e checks if subTemp and temp have any common values
  return subTemp.some((val) => temp.includes(val));
};

export const multiCheckFilterOptions = (
  tmpOptions: any[],
  optionsValueList: string[],
  currentPosition: number,
  lastClickedPosition: number
) => {
  if (lastClickedPosition > currentPosition) {
    //get a slice of the range of options that are between the last clicked position and the current position
    const subTemp = optionsValueList.slice(
      currentPosition,
      lastClickedPosition + 1
    );
    //reverse the slice so that the options are in the correct order and push them to the tmpOptions array

    tmpOptions.push(...subTemp.reverse());
  } else if (currentPosition > lastClickedPosition) {
    //get a slice of the range of options that are between the last clicked position and the current position
    const subTemp = optionsValueList.slice(
      lastClickedPosition,
      currentPosition + 1
    );
    //push the slice to the tmpOptions array
    tmpOptions.push(...subTemp);
  }
};

export const multiUnCheckFilterOptions = (
  tmpOptions: any[],
  optionsValueList: string[],
  currentPosition: number,
  lastClickedPosition: number
) => {
  if (lastClickedPosition > currentPosition) {
    //get a slice of the range of options that are between the last clicked position and the current position
    const subTemp = optionsValueList.slice(
      currentPosition,
      lastClickedPosition + 1
    );
    //filter the tmpOptions array to remove the options that are in the slice
    const filteredTmp = tmpOptions.filter((item) => !subTemp.includes(item));

    //if the slice is in the tmpOptions array, then replace the tmpOptions array with the filteredTmp array,
    //otherwise return the tmpOptions array
    tmpOptions = compareArrays(subTemp, tmpOptions) ? filteredTmp : tmpOptions;
  } else if (currentPosition > lastClickedPosition) {
    //get a slice of the range of options that are between the last clicked position and the current position
    const subTemp = optionsValueList.slice(
      lastClickedPosition,
      currentPosition + 1
    );
    //filter the tmpOptions array to remove the options that are in the slice
    const filteredTmp = tmpOptions.filter((item) => !subTemp.includes(item));
    //if the slice is in the tmpOptions array, then replace the tmpOptions array with the filteredTmp array,
    tmpOptions = compareArrays(subTemp, tmpOptions) ? filteredTmp : tmpOptions;
  }

  return tmpOptions;
};
