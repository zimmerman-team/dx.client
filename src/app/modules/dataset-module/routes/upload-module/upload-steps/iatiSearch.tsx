import React, { useState, useEffect } from "react";

// import app/assets/iati_source.json as iatiFields
import iatiFields from "app/assets/iati_source.json";

interface IatiField {
  id: string;
  name: string;
  "iati-tag": string;
  description: string;
  default: boolean;
  category: string;
}

export default function IATISearch(
  props: Readonly<{
    handleIATISearch: (query: string, fl: string) => void;
  }>
) {
  // Cast the imported JSON data to the IatiFields type
  const fieldsData: IatiField[] = iatiFields;
  // State to hold the search query
  const [query, setQuery] = useState("");
  const [fieldsExpanded, setFieldsExpanded] = useState(false);
  const [checkedFields, setCheckedFields] = useState<string[]>([]);
  const [hoveredField, setHoveredField] = useState<string | null>("001");

  // Initialize checkedFields with fields where default is true on first render
  useEffect(() => {
    const defaultCheckedFields = fieldsData
      .filter((fieldObj) => fieldObj.default) // Filter fields where default is true
      .map((fieldObj) => fieldObj.id); // Extract the IDs of those fields
    setCheckedFields(defaultCheckedFields); // Initialize the checkedFields state
  }, [fieldsData]);

  console.log("selected fields", checkedFields);

  // Handler for the input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  // Handler for checkbox change
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fieldId = event.target.value;
    if (fieldId === "001") return;
    if (event.target.checked) {
      setCheckedFields((prev) => [...prev, fieldId]);
    } else {
      setCheckedFields((prev) => prev.filter((id) => id !== fieldId));
    }
  };

  // Handler to show the description on hover
  const handleMouseEnter = (fieldId: string) => {
    setHoveredField(fieldId);
  };

  const handleMouseLeave = () => {
    setHoveredField(null);
  };

  return (
    <div>
      <h1>IATI Search</h1>
      <h2>Semantic search</h2>
      <div>
        <label htmlFor="search-query">IATI Search query: </label>
        <input
          type="text"
          id="search-query"
          value={query}
          onChange={handleInputChange}
        />
        <button
          onClick={() => props.handleIATISearch(query, checkedFields.join(","))}
        >
          Search
        </button>
        <div>
          <button onClick={() => setFieldsExpanded(!fieldsExpanded)}>
            {fieldsExpanded
              ? "Hide field selection"
              : "Select available fields for the resulting IATI Data table"}
          </button>

          {fieldsExpanded && (
            <React.Fragment>
              <button onClick={() => setCheckedFields(["001"])}>
                Clear Selection
              </button>
              <table>
                <thead>
                  <tr>
                    <th>Selected</th>
                    <th>IATI Tag</th>
                    <th>Name (Hover for Description)</th>
                  </tr>
                </thead>
                <tbody>
                  {fieldsData.map((fieldObj, index) => {
                    // Initialize a variable to keep track of whether the category should be rendered
                    let showCategory = false;

                    // Check if the current field's category is different from the previous one
                    if (
                      index === 0 ||
                      fieldsData[index - 1].category !== fieldObj.category
                    ) {
                      showCategory = true; // We should render the category row
                    }

                    return (
                      <>
                        {/* Render the category row if showCategory is true */}
                        {showCategory && (
                          <React.Fragment>
                            <br />
                            <tr key={`category-${fieldObj.category}`}>
                              <td colSpan={3} style={{ fontWeight: "bold" }}>
                                IATI Element: {fieldObj.category}
                              </td>
                            </tr>
                          </React.Fragment>
                        )}

                        {/* Render the regular field row */}
                        <tr key={fieldObj.id}>
                          <td>
                            <input
                              type="checkbox"
                              value={fieldObj.id}
                              checked={checkedFields.includes(fieldObj.id)}
                              onChange={handleCheckboxChange}
                              disabled={fieldObj.id === "001"} // Disable checkbox if id is "001"
                            />
                          </td>
                          <td>{fieldObj["iati-tag"]}</td>
                          <td
                            onMouseEnter={() => handleMouseEnter(fieldObj.id)}
                            onMouseLeave={handleMouseLeave}
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            {fieldObj.name}
                            {hoveredField === fieldObj.id && (
                              <span
                                style={{
                                  marginLeft: "10px",
                                  fontStyle: "italic",
                                }}
                              >
                                {fieldObj.description}
                              </span>
                            )}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </React.Fragment>
          )}
        </div>
      </div>
      <h2>Manual solr query input</h2>
      <i>Not implemented, but can be a nice addition</i>
      <div>
        <label htmlFor="solr-query">Solr query: ?q=</label>
        <input type="text" id="solr-query" />
        <button disabled={true}>Search</button>
        <a href="https://solr.apache.org/guide/solr/latest/query-guide/common-query-parameters.html">
          Solr queries
        </a>
        <br />
        <a href="https://iatistandard.org/en/iati-standard/203/activity-standard/summary-table/">
          IATI Standard summary table
        </a>
      </div>
    </div>
  );
}
