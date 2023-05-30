import React from "react";
import axios from "axios";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import useDebounce from "react-use/lib/useDebounce";
import { ReportModel } from "app/modules/report-module/data";
import ColoredReportIcon from "app/assets/icons/ColoredReportIcon";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import DeleteReportDialog from "app/components/Dialogs/deleteReportDialog";
import ReformedGridItem from "app/modules/home-module/components/Reports/reformedGridItem";

export default function ReportsGrid(props: { searchStr: string }) {
  const [cardId, setCardId] = React.useState<number>(0);
  const [modalDisplay, setModalDisplay] = React.useState<boolean>(false);
  const [enableButton, setEnableButton] = React.useState<boolean>(false);

  const reports = useStoreState(
    (state) => (state.reports.ReportGetList.crudData ?? []) as ReportModel[]
  );

  const loadReports = useStoreActions(
    (actions) => actions.reports.ReportGetList.fetch
  );

  const handleDelete = (index?: number) => {
    setModalDisplay(false);
    setEnableButton(false);
    const id = reports[index as number].id;
    if (!id) {
      return;
    }
    axios
      .delete(`${process.env.REACT_APP_API}/report/${id}`)
      .then(() => {
        loadReports({
          storeInCrudData: true,
          filterString: "filter[order]=createdDate desc",
        });
      })
      .catch((error) => console.log(error));
  };

  const handleDuplicate = (index: number) => {
    const id = reports[index].id;
    if (!id) {
      return;
    }
    axios
      .get(`${process.env.REACT_APP_API}/report/duplicate/${id}`)
      .then(() => {
        loadReports({
          storeInCrudData: true,
          filterString: "filter[order]=createdDate desc",
        });
      })
      .catch((error) => console.log(error));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "DELETE") {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  };

  const handleModal = (id: number) => {
    setCardId(id);
    setModalDisplay(true);
  };

  function loadData(searchStr: string) {
    const value =
      searchStr.length > 0
        ? `"where":{"name":{"like":"${searchStr}.*","options":"i"}},`
        : "";
    loadReports({
      storeInCrudData: true,
      filterString: `filter={${value}"order":"createdDate desc"}`,
    });
  }

  React.useEffect(() => {
    loadData(props.searchStr);
  }, []);

  const [,] = useDebounce(
    () => {
      loadData(props.searchStr);
    },
    500,
    [props.searchStr]
  );

  return (
    <>
      <Grid container spacing={2}>
        {reports.map((data, index) => (
          <Grid item key={data.id} xs={12} sm={6} md={4} lg={4}>
            <ReformedGridItem
              id={data.id}
              key={data.id}
              title={data.name}
              descr={data.title}
              date={data.createdDate}
              viz={<ColoredReportIcon />}
              color={data.backgroundColor}
              handleDelete={() => handleModal(index)}
              handleDuplicate={() => handleDuplicate(index)}
            />
            <Box height={16} />
          </Grid>
        ))}
      </Grid>
      <DeleteReportDialog
        cardId={cardId}
        modalDisplay={modalDisplay}
        enableButton={enableButton}
        handleDelete={handleDelete}
        setModalDisplay={setModalDisplay}
        handleInputChange={handleInputChange}
      />
    </>
  );
}
