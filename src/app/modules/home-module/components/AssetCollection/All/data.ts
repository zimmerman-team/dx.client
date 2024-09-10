export const getColumns = (assetType: "chart" | "report" | "dataset") => {
  switch (assetType) {
    case "chart":
      return [
        {
          key: "name",
          label: "Name",
        },
        {
          key: "type",
          label: "Type",
        },
        {
          key: "description",
          label: "Description",
        },
        {
          key: "createdDate",
          label: "Created Date",
        },
      ];
    case "dataset":
      return [
        {
          key: "name",
          label: "Name",
        },

        {
          key: "description",
          label: "Description",
        },
        {
          key: "createdDate",
          label: "Created Date",
        },
      ];
    case "report":
      return [
        {
          key: "name",
          label: "Name",
        },

        {
          key: "description",
          label: "Description",
        },
        {
          key: "createdDate",
          label: "Created Date",
        },
      ];
  }
};
