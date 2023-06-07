import React from "react";
import _ from "lodash";
import ReactMarkdown from 'react-markdown'


import axios from "axios";
// yarn link "@rawgraphs/rawgraphs-charts"

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

export function Chat() {
    const [topic, setTopic] = React.useState('I want to create a report about malaria');
    const [datasetMetadata, setDatasetMetadata] = React.useState<DatasetObject>({});
    const [datasetUrl, setDatasetUrl] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    async function handleClick() {
        setLoading(true);
        await axios.post(`http://localhost:4004/report-ai/search/${encodeURIComponent(topic)}`)
            .then((response) => {
                console.log(response)
                setDatasetMetadata(response.data)
            })
            .catch((error) => console.log(error));
        setLoading(false)
    }
    
    async function handleDatasetSelect(datasetKey: string) {
        console.log("Dataset selected: ", datasetKey);
        setDatasetMetadata({});
        setDatasetUrl("Loading");
        await axios.post(`http://localhost:4004/report-ai/create-report/${encodeURIComponent(datasetKey)}`)
            .then((response) => {
                console.log(response);
                setDatasetUrl(response.data.url);
            })
            .catch((error) => console.log(error));
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Enter topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style= {{ width: '50%' }}
            />
            <button onClick={handleClick} disabled={loading}>Submit Topic</button>
            { Object.keys(datasetMetadata).map((datasetKey) => {
                const metadata = datasetMetadata[datasetKey];
                if (metadata.result) return <div style={{ whiteSpace: 'pre-wrap' }} key={datasetKey}>{metadata.result}</div>
                return (
                    <div style={{ whiteSpace: 'pre-wrap', background: '#fff' }} key={datasetKey}>
                        <h5>dataset: {_.get(metadata, 'title', '')}</h5>
                        <h6>{_.get(metadata, 'subtitle', '')}</h6>
                        <ReactMarkdown>{_.get(metadata, 'description', '')}</ReactMarkdown>
                        <a href={_.get(metadata, 'url', '')}>Click here to view the dataset at source</a>
                        <button onClick={() => {handleDatasetSelect(datasetKey)}}>Select this dataset!</button>
                    </div>
                )
            }) }
            {(datasetUrl === "") && ( <div /> )}
            {(datasetUrl === "Loading") && ( <div style={{ whiteSpace: 'pre-wrap' }}>Creating your report!</div> )}
            {(datasetUrl !== "Loading" && datasetUrl !== "") && ( <div style={{ whiteSpace: 'pre-wrap' }}><a href={datasetUrl}>Click here to view the Report our AI Assistant has created for you!</a></div> )}
        </div>
    );
};
