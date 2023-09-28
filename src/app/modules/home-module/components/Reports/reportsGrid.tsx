import React, { useRef } from "react";
import axios from "axios";
import get from "lodash/get";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import useDebounce from "react-use/lib/useDebounce";
import { ReportModel } from "app/modules/report-module/data";
import ColoredReportIcon from "app/assets/icons/ColoredReportIcon";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { HomepageTable } from "app/modules/home-module/components/Table";
import DeleteReportDialog from "app/components/Dialogs/deleteReportDialog";
import ReformedGridItem from "app/modules/home-module/components/Reports/reformedGridItem";
import ReportAddnewCard from "./reportAddNewCard";
import { useInfinityScroll } from "app/hooks/useInfinityScroll";

interface Props {
  sortBy: string;
  searchStr: string;
  tableView: boolean;
  showMenuButton: boolean;
  addCard?: boolean;
}

export default function ReportsGrid(props: Props) {
  const observerTarget = useRef(null);
  const [cardId, setCardId] = React.useState<number>(0);
  const [modalDisplay, setModalDisplay] = React.useState<boolean>(false);
  const [enableButton, setEnableButton] = React.useState<boolean>(false);
  const [loadedReports, setLoadedReports] = React.useState<ReportModel[]>([]);
  const limit = 15;
  //used over usestate to get current offset value in the IntersectionObserver api, as it is not updated in usestate.
  const offset = useRef(0);
  const reports = useStoreState(
    (state) => (state.reports.ReportGetList.crudData ?? []) as ReportModel[]
  );
  const loadReports = useStoreActions(
    (actions) => actions.reports.ReportGetList.fetch
  );
  const reportsLoadSuccess = useStoreState(
    (state) => state.reports.ReportGetList.success
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

  function loadData(searchStr: string, sortByStr: string) {
    const value =
      searchStr.length > 0
        ? `"where":{"title":{"like":"${searchStr}.*","options":"i"}},`
        : "";
    loadReports({
      storeInCrudData: true,
      filterString: `filter={${value}"order":"${sortByStr} desc","limit":${limit},"offset":${offset.current}}`,
    });
    offset.current = offset.current + limit;
  }
  useInfinityScroll(loadData, observerTarget, props.searchStr, props.sortBy);

  React.useEffect(() => {
    if (props.searchStr.length === 0) {
      loadData(props.searchStr, props.sortBy);
    }
  }, [props.searchStr, props.sortBy]);

  React.useEffect(() => {
    if (!reportsLoadSuccess) {
      return;
    }
    //update the loaded reports
    setLoadedReports((prevReports) => {
      const f = reports?.filter(
        (report, i) => prevReports[i]?.id !== report.id
      );
      return [...prevReports, ...f];
    });
  }, [reportsLoadSuccess]);

  const [,] = useDebounce(
    () => {
      if (props.searchStr.length > 0) {
        loadData(props.searchStr, props.sortBy);
      }
    },
    500,
    [props.searchStr, props.sortBy]
  );

  return (
    <>
      {!props.tableView && (
        <Grid container spacing={2}>
          {props.addCard && <ReportAddnewCard />}
          {loadedReports.map((data, index) => (
            <Grid item key={data.id} xs={12} sm={6} md={4} lg={3}>
              <ReformedGridItem
                id={data.id}
                key={data.id}
                descr={data.name}
                date={data.createdDate}
                viz={<ColoredReportIcon />}
                color={data.backgroundColor}
                showMenuButton={props.showMenuButton}
                handleDelete={() => handleModal(index)}
                handleDuplicate={() => handleDuplicate(index)}
                title={
                  get(data, "title", "").length > 0 ? data.title : data.name
                }
              />
              <Box height={16} />
            </Grid>
          ))}
        </Grid>
      )}
      {props.tableView && (
        <HomepageTable
          data={loadedReports.map((data) => ({
            id: data.id,
            name: data.name,
            description: data.title,
            createdDate: data.createdDate,
          }))}
        />
      )}
      <Box height={100} />

      <div ref={observerTarget} />
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
