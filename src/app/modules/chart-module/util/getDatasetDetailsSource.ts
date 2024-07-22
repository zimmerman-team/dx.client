import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";

export const getDatasetDetailsSource = (
  datasetDetails: DatasetListItemAPIModel,
  datasetDetailsProps?: DatasetListItemAPIModel
) => {
  let sourceUrl;
  let filename;
  if (datasetDetailsProps) {
    sourceUrl =
      datasetDetailsProps.sourceUrl ||
      `${window.location.origin}/dataset/${datasetDetailsProps.id}/detail?fromHome=true`;
  } else {
    sourceUrl =
      datasetDetails.sourceUrl ||
      `${window.location.origin}/dataset/${datasetDetails.id}/detail?fromHome=true`;
  }
  if (datasetDetailsProps) {
    filename = datasetDetailsProps.sourceUrl || datasetDetailsProps.name;
  } else {
    filename = datasetDetails.sourceUrl || datasetDetails.name;
  }
  return { sourceUrl, filename };
};
