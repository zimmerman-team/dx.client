import React from "react";
import { v4 } from "uuid";
import { useDrop } from "react-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import HeaderBlock from "app/modules/report-module/sub-module/components/headerBlock";
import { ReportOrderContainer } from "app/modules/report-module/components/order-container";
import { ReportElementsType } from "app/modules/report-module/components/right-panel-create-view";
import AddRowFrameButton from "app/modules/report-module/sub-module/rowStructure/addRowFrameButton";
import RowFrame, {
  Divider,
} from "app/modules/report-module/sub-module/rowStructure/rowFrame";
import {
  ReportCreateViewProps,
  PlaceholderProps,
} from "app/modules/report-module/views/create/data";
import {
  IRowFrameStructure,
  isDividerOrRowFrameDraggingAtom,
  unSavedReportPreviewModeAtom,
} from "app/state/recoil/atoms";
import ReactMarkdown from 'react-markdown';
import axios from "axios";
import _ from "lodash";
import { useHistory } from "react-router-dom";

interface DatasetMetadata {
  title: string;
  subtitle: string;
  description: string;
  url: string;
  result?: string;
}

interface DatasetObject {
  [key: string]: DatasetMetadata;
}

export function ReportCreateView(props: ReportCreateViewProps) {
  const history = useHistory();
  const [reportPreviewMode] = useRecoilState(unSavedReportPreviewModeAtom);
  const [rowStructureType, setRowStructuretype] =
    React.useState<IRowFrameStructure>({
      index: 0,
      rowType: "",
      disableAddRowStructureButton: false,
    });

  /** AI REPORT */
  const [topic, setTopic] = React.useState('I want to create a report about malaria');
  const [datasetMetadata, setDatasetMetadata] = React.useState<DatasetObject>({});
  const [datasetUrl, setDatasetUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [aiStage, setAiStage] = React.useState('start');
  async function handleClick() {
    setLoading(true);
    setAiStage('datasetSearch');
    await axios.post(`http://localhost:4004/report-ai/search/${encodeURIComponent(topic)}`)
      .then((response) => {
        console.log(response)
        setDatasetMetadata(response.data)
      })
      .catch((error) => console.log(error));
      setLoading(false)
      setAiStage('datasetSelect');
  }

  async function handleDatasetSelect(datasetKey: string) {
    console.log("Dataset selected: ", datasetKey);
    setDatasetMetadata({});
    setDatasetUrl("Loading");
    setLoading(true);
    setAiStage('reportCreating');
    let url = '';
    await axios.post(`http://localhost:4004/report-ai/create-report/${encodeURIComponent(datasetKey)}`)
      .then((response) => {
        console.log(response);
        setDatasetUrl(response.data.url);
        console.log(response.data.url)
        // url = the last part of the response.data.url split by /
        url = response.data.url.split('/').pop();
        console.log(url)
      })
      .catch((error) => console.log(error));
      setLoading(false)
      setAiStage('final');
      // navigate the user to response.data.url
      history.push(`/report/${url}`);
  }
  /** AI REPORT END */

  function deleteFrame(id: string) {
    props.setFramesArray((prev) => {
      let tempPrev = prev.map((item) => ({ ...item }));
      const frameId = tempPrev.findIndex((frame) => frame.id === id);
      const contentArr = tempPrev[frameId].content;

      props.setPickedCharts((prevPickedCharts) => {
        return prevPickedCharts.filter((item) => !contentArr.includes(item));
      });

      tempPrev.splice(frameId, 1);

      return [...tempPrev];
    });
  }

  React.useEffect(() => {
    if (props.reportType === "advanced") {
      const rowOne = v4();
      const rowTwo = v4();
      const rowThree = v4();
      const rowFour = v4();
      const rowFive = v4();
      props.setFramesArray([
        {
          id: rowOne,
          frame: (
            <RowFrame
              rowId={rowOne}
              rowIndex={0}
              forceSelectedType="oneByFive"
              deleteFrame={() => deleteFrame(rowOne)}
              handleRowFrameItemRemoval={props.handleRowFrameItemRemoval}
              handleRowFrameItemAddition={props.handleRowFrameItemAddition}
              handleRowFrameStructureTypeSelection={
                props.handleRowFrameStructureTypeSelection
              }
            />
          ),
          content: [null, null, null, null, null],
          contentTypes: [null, null, null, null, null],
          structure: "oneByFive",
        },
        {
          id: rowTwo,
          frame: (
            <RowFrame
              rowId={rowTwo}
              rowIndex={1}
              forceSelectedType="oneByOne"
              deleteFrame={() => deleteFrame(rowTwo)}
              handleRowFrameItemRemoval={props.handleRowFrameItemRemoval}
              handleRowFrameItemAddition={props.handleRowFrameItemAddition}
              handleRowFrameStructureTypeSelection={
                props.handleRowFrameStructureTypeSelection
              }
            />
          ),
          content: [null],
          contentTypes: [null],
          structure: "oneByOne",
        },
        {
          id: rowThree,
          frame: (
            <RowFrame
              rowId={rowThree}
              rowIndex={2}
              forceSelectedType="oneToFour"
              deleteFrame={() => deleteFrame(rowThree)}
              handleRowFrameItemRemoval={props.handleRowFrameItemRemoval}
              handleRowFrameItemAddition={props.handleRowFrameItemAddition}
              handleRowFrameStructureTypeSelection={
                props.handleRowFrameStructureTypeSelection
              }
            />
          ),
          content: [null, null],
          contentTypes: [null, null],
          structure: "oneToFour",
        },
        {
          id: rowFour,
          frame: (
            <RowFrame
              rowId={rowFour}
              rowIndex={3}
              forceSelectedType="oneByOne"
              deleteFrame={() => deleteFrame(rowFour)}
              handleRowFrameItemRemoval={props.handleRowFrameItemRemoval}
              handleRowFrameItemAddition={props.handleRowFrameItemAddition}
              handleRowFrameStructureTypeSelection={
                props.handleRowFrameStructureTypeSelection
              }
            />
          ),
          content: [null],
          contentTypes: [null],
          structure: "oneByOne",
        },
        {
          id: rowFive,
          frame: (
            <RowFrame
              rowId={rowFive}
              rowIndex={4}
              forceSelectedType="oneByThree"
              deleteFrame={() => deleteFrame(rowFive)}
              handleRowFrameItemRemoval={props.handleRowFrameItemRemoval}
              handleRowFrameItemAddition={props.handleRowFrameItemAddition}
              handleRowFrameStructureTypeSelection={
                props.handleRowFrameStructureTypeSelection
              }
            />
          ),
          content: [null, null, null],
          contentTypes: [null, null, null],
          structure: "oneByThree",
        },
      ]);
    }
  }, [props.reportType]);

  return (props.reportType === "ai") ? (
    <Container maxWidth="lg"><div css={`
      display: flex;
      flex-direction: column;
      height: 100vh;
      padding-bottom: 160px;
    `}>
      <div css={`
        background-color: #eee;
        display: flex;
        flex-direction: row;
        width: calc(100vw - ((100vw - 1280px) / 2) - 400px - 50px);
        padding-bottom: 170px;
      `}>
        { aiStage === 'datasetSearch' && (
          <div>
            <p>Searching for datasets...</p>
            <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading..." />
          </div>
        )}
        { aiStage === 'datasetSelect' && Object.keys(datasetMetadata).map((datasetKey) => {
          const metadata = datasetMetadata[datasetKey];
          if (metadata.result) return <div style={{ whiteSpace: 'pre-wrap' }} key={datasetKey}>{metadata.result}</div>
          return (
            <div style={{ whiteSpace: 'pre-wrap', background: '#fff', margin: '10px', paddingBottom: '40px', position: 'relative'}} key={datasetKey}>
              <div>
                <h5>dataset: {_.get(metadata, 'title', '')}</h5>
                <h6>{_.get(metadata, 'subtitle', '')}</h6>
                <ReactMarkdown>{_.get(metadata, 'description', '')}</ReactMarkdown>
              </div>
              
              <div css={`
                position: absolute;
                bottom: 0;
              `}>
                <hr />
                <a href={_.get(metadata, 'url', '')}>Click here to view the dataset at source</a>
                <br />
                <button onClick={() => {handleDatasetSelect(datasetKey)}}>Select this dataset!</button>
              </div>
            </div>
          )
        }) }
        { aiStage === 'reportCreating' && (
          <div>
            <p>Processing your dataset... This entails: Uploading the dataset, processing the dataset, creating charts and finally creating a Report.</p>
            <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading..." />
          </div>
        )}
      </div>
      <hr />
      <div css={`
        background-color: #ddd;
        position: fixed;
        bottom: 10px;
        height: 150px;
        width: calc(100vw - ((100vw - 1280px) / 2) - 400px - 50px);
      `}>
        { aiStage === 'start' && (
          <div>
            <p>Type your own search terms, consider something like: "I want to create a report about Malaria", or simply "Unemployment". Hit 'Search Datasets'</p>
          </div>
        )}
        { aiStage === 'datasetSelect' && (
          <div>
            <p>Choose a dataset from the list above, or search again. (Note: you might have to scroll to select the dataset with the button)</p>
          </div>
        )}
        { aiStage === 'final' && (
          <a href={datasetUrl}>Click here to view the Report our AI Assistant has created for you!</a>
        )}
        <input
          type="text"
          placeholder="Enter topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style= {{ width: '50%' }}
        />
        <button onClick={handleClick} disabled={loading}>Search Datasets</button>
      </div>
    </div></Container>
  ) : (
    <div>
      <HeaderBlock
        previewMode={reportPreviewMode}
        headerDetails={{ ...props.headerDetails, createdDate: new Date() }}
        setHeaderDetails={props.setHeaderDetails}
      />
      <Container maxWidth="lg">
        <div
          css={`
            transition: width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
            width: ${reportPreviewMode
              ? "100%"
              : props.open
              ? "calc(100vw - ((100vw - 1280px) / 2) - 400px - 50px)"
              : "100%"};

            @media (max-width: 1280px) {
              width: calc(100vw - 400px);
            }
          `}
        >
          <Box height={50} />
          <ReportOrderContainer enabled childrenData={props.framesArray}>
            {props.framesArray.map((frame) => {
              return (
                <div key={frame.id}>
                  <div>{frame.frame}</div>
                  <Box height={38} />
                  <PlaceHolder
                    rowId={frame.id}
                    index={frame.id}
                    deleteFrame={deleteFrame}
                    framesArray={props.framesArray}
                    setFramesArray={props.setFramesArray}
                    handleRowFrameItemRemoval={props.handleRowFrameItemRemoval}
                    handleRowFrameItemAddition={
                      props.handleRowFrameItemAddition
                    }
                    handleRowFrameStructureTypeSelection={
                      props.handleRowFrameStructureTypeSelection
                    }
                  />
                </div>
              );
            })}
          </ReportOrderContainer>
          {!reportPreviewMode && (
            <AddRowFrameButton
              deleteFrame={deleteFrame}
              framesArray={props.framesArray}
              rowStructureType={rowStructureType}
              setFramesArray={props.setFramesArray}
              setRowStructureType={setRowStructuretype}
              handleRowFrameItemRemoval={props.handleRowFrameItemRemoval}
              handleRowFrameItemAddition={props.handleRowFrameItemAddition}
              handleRowFrameStructureTypeSelection={
                props.handleRowFrameStructureTypeSelection
              }
            />
          )}
          <Box height={45} />
        </div>
      </Container>
    </div>
  );
}

export const PlaceHolder = (props: PlaceholderProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: [ReportElementsType.DIVIDER, ReportElementsType.ROWFRAME],
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
    }),
    drop: (item: any, monitor) => {
      if (item.type === ReportElementsType.ROWFRAME) {
        props.setFramesArray((prev) => {
          const tempIndex = prev.findIndex((frame) => frame.id === props.index);
          const id = v4();
          prev.splice(tempIndex + 1, 0, {
            id,
            frame: (
              <RowFrame
                rowId={id}
                rowIndex={tempIndex + 1}
                deleteFrame={props.deleteFrame}
                handleRowFrameItemRemoval={props.handleRowFrameItemRemoval}
                handleRowFrameItemAddition={props.handleRowFrameItemAddition}
                handleRowFrameStructureTypeSelection={
                  props.handleRowFrameStructureTypeSelection
                }
              />
            ),
            content: [],
            contentTypes: [],
            structure: null,
          });
          return [...prev];
        });
      } else {
        return props.setFramesArray((prev) => {
          const tempIndex = prev.findIndex((frame) => frame.id === props.index);
          const id = v4();
          prev.splice(tempIndex + 1, 0, {
            id,
            frame: <Divider delete={props.deleteFrame} dividerId={id} />,
            content: ["divider"],
            contentTypes: ["divider"],
            structure: null,
          });
          return [...prev];
        });
      }
    },
  }));

  const isItemDragging = useRecoilValue(isDividerOrRowFrameDraggingAtom);

  return (
    <>
      <div
        ref={drop}
        css={`
          width: 100%;
          height: 20px;
          margin: 10px 0;
          display: ${isItemDragging ? "block" : "none"};
          border: 1px ${isItemDragging ? "dashed" : "none"} #adb5bd;
          background-color: #262c34;
        `}
      />
    </>
  );
};
