import React from "react";
import { Configuration, OpenAIApi } from "openai";
import _ from "lodash";

import axios from "axios";
import { JSDOM } from "jsdom";

const searchKaggle = async (searchTerm: string) => {
    if (searchTerm === "") searchTerm = "malaria+cells";
    const url = 'https://www.kaggle.com/search?q=' + searchTerm + '+in%3Adatasets+datasetFileTypes%3Acsv';

    axios.get(url)
        .then(response => {
            const dom = new JSDOM(response.data);
            const title = dom.window.document.querySelector('h7');
            console.log(title?.textContent);
            // select all the <a> elements from the page
            // const searchResults = $('a');
            // console.log('Search results:', searchResults)

            // Loop through each search result
            // searchResults.each((index, element) => {
            //     const titleElement = $(element).find('h6 a'); // Select H6 element within the search result
            //     const title = titleElement.text(); // Extract the title text
            //     const href = titleElement.attr('href'); // Extract the href attribute

            //     console.log('Title:', title);
            //     console.log('Href:', href);
            //     console.log('---');
            // });
        })
        .catch(error => {
            console.log('Error:', error);
        });
};

export function Chat() {
    const [topic, setTopic] = React.useState("");
    const [searchTerm, setSearchTerm] = React.useState("");
   
    async function handleClick() {
        const configuration = new Configuration({
            apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        
        const topicDeterminer = "First, I will give you some context, then I will ask you a question about a given topic. The context: Your job is to convert the given topic with one search term which will lead to functional results on the Kaggle datasets page. Keep it as concise as possible. Do not include the word 'dataset' in your answer. If the best answer has multiple words, append them together with a + symbol. The Topic is: '" + topic + "'. The search term is: ";
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: topicDeterminer,
            temperature: 0.08,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        console.log(response.data);
        setSearchTerm(_.get(response, "data.choices[0].text", "No results"));
    }

    async function handleClickCheck() {
        searchKaggle(searchTerm);
    }
    
    return (
        <div>
            <input
                type="text"
                placeholder="Enter topic"
                value={topic || 'I want to create a report about malaria cells'}
                onChange={(e) => setTopic(e.target.value)}
            />
            <button onClick={handleClick}>Send</button>
            <button onClick={handleClickCheck}>Check</button>
            <div style={{ whiteSpace: 'pre-wrap' }}>{searchTerm}</div>
        </div>
    );
};
