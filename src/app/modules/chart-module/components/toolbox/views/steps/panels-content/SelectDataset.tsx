import React from "react";
import get from "lodash/get";
import find from "lodash/find";
import CloseIcon from "@material-ui/icons/Close";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
import { DatasetListItemAPIModel } from "app/modules/data-themes-module/sub-modules/list";
import { IconButton } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loadedDatasetsAtom } from "app/state/recoil/atoms";

const DEFAULT_DATASETS = [
  {
    name: "Pledges & Contributions",
    id: "pledges-contributions",
  },
  {
    name: "Eligibility",
    id: "eligibility",
  },
  {
    name: "Allocations",
    id: "allocations",
  },
  {
    name: "Grants",
    id: "grants",
  },
  {
    name: "Investment - Signed",
    id: "investment-signed",
  },
  {
    name: "Investment - Committed",
    id: "investment-committed",
  },
  {
    name: "Investment - Disbursed",
    id: "investment-disbursed",
  },
  {
    name: "Budgets",
    id: "budgets",
  },
];

interface ChartToolBoxSelectDatasetProps {
  expanded: boolean;
  loadDataset: (endpoint: string) => Promise<boolean>;
}

export function ChartToolBoxSelectDataset(
  props: ChartToolBoxSelectDatasetProps
) {
  const history = useHistory();
  const dataset = useStoreState((state) => state.charts.dataset.value);
  const setDataset = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );
  const [loadedDatasets, setLoadedDatasets] =
    useRecoilState(loadedDatasetsAtom);
  const datasets =
    process.env.REACT_APP_USE_DEFAULT_DATASETS === "true"
      ? DEFAULT_DATASETS
      : useStoreState(
          (state) =>
            get(
              state,
              "dataThemes.DatasetGetList.crudData",
              DEFAULT_DATASETS
            ) as DatasetListItemAPIModel[]
        );

  const deSelectDataset = () => {
    setDataset(null);
    history.push(`/chart/new/data`);
  };

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 351px;
        height: 89px;
        border-radius: 11px;
        background: #dfe3e5;
        font-family: "Gotham Narrow", sans-serif;

        > p {
          margin-bottom: 4px;
          margin-top: -8px;
          color: #231d2c;
          font-weight: bold;
          font-size: 14px;
        }

        > label {
          margin: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;

          > span {
            font-size: 14px;
          }
        }
      `}
    >
      <p>Please select data from Dx</p>
      <button
        css={`
          width: 100%;
          font-size: 14px;
          border-radius: 24px;
          text-transform: capitalize;
          display: flex;
          justify-content: ${dataset ? "space-between" : "center"};
          align-items: center;
          border-radius: 25px;
          background: #231d2c;
          outline: none;
          border: none;
          color: #fff;
          ${dataset === null &&
          "border: 0.722px dashed #231D2C;background: #DFE3E5; color:#868E96"};
          width: 313px;
          height: 31px;
          padding: 0 16px;
          svg {
            margin-left: 10px;
            > path {
              fill: #fff;
            }
          }
          span {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          }
        `}
      >
        <span>
          {get(
            find(loadedDatasets, { id: dataset }),
            "name",
            "Select data from the list"
          )}
        </span>
        <IconButton
          onClick={deSelectDataset}
          css={`
            padding: 0px;
            :hover {
              cursor: pointer;
              background: transparent;
            }
            display: ${dataset ? "block" : "none"};
          `}
        >
          <CloseIcon />
        </IconButton>
      </button>
    </div>
  );
}

export const ConnectData = () => {
  const history = useHistory();

  return (
    <>
      <div
        css={`
          width: 351px;
          height: 97px;
          border-radius: 11px;
          background: #dfe3e5;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: "Gotham Narrow", sans-serif;
          button {
            display: flex;
            padding: 12px 27px;
            align-items: flex-start;
            gap: 10px;
            border-radius: 30px;
            background: var(--primary-dark, #231d2c);
            font-family: "Inter", sans-serif;
            font-size: 14px;
            font-weight: 500;
            text-transform: uppercase;
            color: #fff;
            border: none;
            outline: none;
            cursor: pointer;
          }
          p {
            margin-bottom: 4px;
            margin-top: -8px;

            font-weight: bold;
            font-size: 14px;
          }
        `}
      >
        <p>Or connect new data</p>
        <button onClick={() => history.push("/dataset/new/upload")}>
          add new dataset
        </button>
      </div>
    </>
  );
};
