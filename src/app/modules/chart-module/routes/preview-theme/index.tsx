/* third-party */
import React from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import useTitle from "react-use/lib/useTitle";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useHistory, useParams } from "react-router-dom";
/* project */
import Skeleton from "@material-ui/lab/Skeleton";
import { useDataThemesEchart } from "app/hooks/useDataThemesEchart";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { ChartBuilderPreviewThemeProps } from "app/modules/chart-module/routes/preview-theme/data";
import WarningDialog from "app/modules/chart-module/components/dialog/warningDialog";
import { ReactComponent as AIIcon } from "app/modules/chart-module/assets/ai-icon.svg";
import GeomapLegend from "app/modules/chart-module/components/geomap-legend";
import ErrorComponent from "app/modules/chart-module/components/dialog/errrorComponent";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";

export function ChartBuilderPreviewTheme(props: ChartBuilderPreviewThemeProps) {
  useTitle("DX DataXplorer - Preview Chart");
  const token = useStoreState((state) => state.AuthToken.value);

  const domRef = React.useRef<HTMLDivElement>(null);

  const { page } = useParams<{ page: string; view: string }>();
  const dataset = useStoreState((state) => state.charts.dataset.value);
  const history = useHistory();
  const { render } = useDataThemesEchart();

  const { visualOptions } = props;

  const mapping = useStoreState((state) => state.charts.mapping.value);
  const selectedChartType = useStoreState(
    (state) => state.charts.chartType.value
  );

  const loadDataset = useStoreActions(
    (actions) => actions.dataThemes.DatasetGet.fetch
  );
  const datasetDetails = useStoreState(
    (state) =>
      (state.dataThemes.DatasetGet.crudData ?? {}) as DatasetListItemAPIModel
  );
  React.useEffect(() => {
    if (token) {
      loadDataset({
        token,
        getId: dataset as string,
      });
    } else {
      loadDataset({
        token,
        getId: dataset as string,
        nonAuthCall: !token,
      });
    }
  }, [token, dataset]);
  React.useEffect(() => {
    //if dataset is empty and not loading, redirect to data page
    //doing this for only new chart because existing chart will have data (gotten from page id)
    if (dataset === null && !props.loading && page === "new") {
      history.push(`/chart/${page}/data`);
    }
  }, [dataset]);

  React.useEffect(() => {
    if (
      domRef &&
      domRef.current &&
      !isEmpty(mapping) &&
      !isEmpty(visualOptions)
    ) {
      const loader = document.getElementById("chart-placeholder");

      try {
        new Promise((resolve, reject) => {
          try {
            if (loader) {
              loader.style.display = "flex";
            }
            if (props.renderedChartSsr) {
              const element = document.createElement("div");
              element.innerHTML = props.renderedChart.trim();
              if (domRef.current?.firstChild) {
                while (domRef.current.firstChild) {
                  domRef.current.removeChild(domRef.current.firstChild);
                }
              }
              // @ts-ignore
              domRef.current.appendChild(
                selectedChartType === "bigNumber"
                  ? element.children[0].children[0].children[0]
                  : element.firstChild || element
              );
            } else {
              render(
                props.renderedChartMappedData,
                // @ts-ignore
                domRef.current,
                selectedChartType || "echartsBarchart",
                visualOptions,
                mapping,
                "common-chart-render-container"
              );
            }
            resolve(1);
          } catch (e) {
            if (process.env.NODE_ENV === "development") {
              console.log("chart error", e);
            }

            if (loader) {
              loader.style.display = "none";
            }
            reject(0);
          }
        })
          .then(() => {
            if (loader) {
              loader.style.display = "none";
            }
          })
          .catch(() => {
            if (loader) {
              loader.style.display = "none";
            }
          });
      } catch (e) {
        if (loader) {
          loader.style.display = "none";
        }

        while (domRef.current.firstChild) {
          domRef.current.removeChild(domRef.current.firstChild);
        }
        if (process.env.NODE_ENV === "development") {
          console.log("chart error", e);
        }
      }
    }
  }, [
    mapping,
    visualOptions,
    props.renderedChart,
    props.renderedChartSsr,
    props.renderedChartMappedData,
  ]);

  const handleVizClick = () => {
    if (page === "new" || props.editable) {
      history.push(`/chart/${page}/customize`);
    }
  };
  React.useEffect(() => {
    props.setIsPreviewView(true);
    return () => {
      props.setIsPreviewView(false);
    };
  }, []);
  if (props.dataError || props.chartError) {
    return (
      <>
        <ErrorComponent
          chartErrorMessage={props.chartErrorMessage}
          dataError={props.dataError}
          chartError={props.chartError}
          page={page}
        />
      </>
    );
  }

  return (
    <div css={commonStyles.container}>
      {!props.loadedChart?.isMappingValid && props.view === undefined ? (
        <WarningDialog isMappingValid={props.loadedChart?.isMappingValid} />
      ) : (
        <>
          <div
            id="chart-placeholder"
            css={`
              display: flex;
              padding: 0 24px;
              margin-top: 20px;
              max-width: 1280px;
              align-items: center;
              align-self: flex-start;
              justify-content: center;
              height: ${get(visualOptions, "height", 100)}px;

              @media (max-width: 1280px) {
                width: calc(100vw - 400px);
              }

              .MuiSkeleton-wave::after {
                background: linear-gradient(
                  90deg,
                  transparent,
                  rgba(223, 227, 230, 1),
                  transparent
                );
              }

              .MuiSkeleton-root {
                background: transparent;
              }
            `}
          >
            <Skeleton
              animation="wave"
              variant="rect"
              width="100%"
              height="100%"
            />
          </div>
          <>
            {" "}
            <div
              css={`
                height: 40px;
              `}
            />
            <div>
              <div
                ref={props.containerRef}
                css={`
                  position: relative;
                  width: calc(100% - 24px);
                `}
              >
                <div
                  ref={domRef}
                  onClick={handleVizClick}
                  id="common-chart-render-container"
                  css={`
                    ${props.renderedChartSsr
                      ? `overflow-x: auto;`
                      : `height: ${get(visualOptions, "height", 500)}px;`}

                    ${selectedChartType === "bigNumber" &&
                    window.location.pathname.indexOf("/chart/") > -1 &&
                    `
           
      
                  > div {
                    width: 135px;
                  }
                `}


              * {
                      font-family: "GothamNarrow-Book", "Helvetica Neue",
                        sans-serif !important;
                    }
                  `}
                />
                <div
                  css={`
                    position: absolute;
                    right: -0.6%;
                    top: -4%;
                    display: ${!props.isAIAssistedChart || props.loading
                      ? "none"
                      : "block"};
                  `}
                >
                  <AIIcon />
                </div>
                <p
                  css={`
                    color: #70777e;
                    font-family: "GothamNarrow-Bold", sans-serif;
                    font-size: 12px;
                    a {
                      font-family: "GothamNarrow-Bold", sans-serif;

                      color: #70777e;
                      text-decoration: none;
                      border-bottom: 1px solid #70777e;
                    }
                  `}
                >
                  Source:{" "}
                  <a
                    href={datasetDetails.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {datasetDetails.source} - Data file:{" "}
                    {datasetDetails.sourceUrl}
                  </a>
                </p>
                {selectedChartType === "echartsGeomap" &&
                props.visualOptions?.showLegend ? (
                  <div
                    css={`
                      position: absolute;
                      bottom: 0;
                      right: 0;
                    `}
                  >
                    <GeomapLegend
                      data={props.renderedChartMappedData}
                      visualOptions={props.visualOptions}
                      mapping={mapping}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </>
        </>
      )}
    </div>
  );
}
