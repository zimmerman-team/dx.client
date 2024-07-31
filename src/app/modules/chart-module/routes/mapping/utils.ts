import find from "lodash/find";
import filter from "lodash/filter";

export function getRequiredFieldsAndErrors(mapping: any, dimensions: any) {
  let updRequiredFields: { id: string; name: string }[] = [];

  dimensions.forEach((dimension: any) => {
    if (dimension.required) {
      updRequiredFields.push({
        id: dimension.id,
        name: dimension.name,
      });
    }
  });

  let updMinValuesFields: { id: string; name: string; minValues: number }[] =
    [];

  dimensions.forEach((dimension: any) => {
    if (dimension.minValues && dimension.minValues > 1) {
      const dimensionMapping = mapping[dimension.id];
      if (
        !dimensionMapping ||
        dimensionMapping.value.length < dimension.minValues
      ) {
        updMinValuesFields.push({
          id: dimension.id,
          name: dimension.name,
          minValues: dimension.minValues,
        });
      }
    }
  });

  Object.keys(mapping).forEach((dimensionId: string) => {
    const dimensionMapping = mapping[dimensionId];
    const minValue = find(dimensions, { id: dimensionId })?.minValues ?? 1;
    if (dimensionMapping.value.length >= minValue) {
      updRequiredFields = filter(
        updRequiredFields,
        (f: { id: string; name: string }) => f.id !== dimensionId
      );
    }
  });

  return { updRequiredFields, updMinValuesFields };
}
