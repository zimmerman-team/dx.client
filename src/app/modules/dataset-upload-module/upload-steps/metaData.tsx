import React from "react";
import Box from "@material-ui/core/Box";
import findIndex from "lodash/findIndex";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {
  CssSelectField,
  CssTextField,
  metaDatacss,
} from "app/modules/dataset-upload-module/style";
import { useLocation } from "react-router-dom";

interface Props {
  onSubmit: (data: IFormDetails) => void;
  handleBack: () => void;
  formDetails: {
    name: string;
    description: string;
    category: string;
    public: boolean;
    source: string;
    sourceUrl: string;
  };
  setFormDetails: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      category: string;
      public: boolean;
      source: string;
      sourceUrl: string;
    }>
  >;
}

export interface IFormDetails {
  name: string;
  source: string;
  category: string;
  public: boolean;
  sourceUrl: string;
  description: string;
}

export const datasetCategories = [
  "Arts and Culture",
  "Economy",
  "Education",
  "Environment",
  "Healthcare",
  "Technology",
  "Social",
];

export const SelectCategoryField = (props: {
  setFormDetails: React.Dispatch<React.SetStateAction<IFormDetails>>;
  formDetails: IFormDetails;
  error: boolean;
  onChange: any;
}) => (
  <FormControl variant="outlined" fullWidth>
    <InputLabel id="select-label">Data category</InputLabel>
    <CssSelectField
      fullWidth
      id="select"
      value={props.formDetails.category}
      defaultValue={""}
      name="category"
      label="Data category"
      labelId="select-label"
      data-cy="dataset-metadata-category"
      onChange={props.onChange}
      inputRef={(input) => input && props.error && input.focus()}
      MenuProps={{
        PaperProps: {
          style: {
            borderRadius: "20px",
            marginTop: `${
              (findIndex(datasetCategories, props.formDetails.category) + 1) *
              60
            }px`,
          },
        },
      }}
      css={`
        fieldset {
          border-radius: 10px;
          padding-bottom: 4px;
          border-color: #231d2c !important;
        }
      `}
    >
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      {datasetCategories.map((category) => (
        <MenuItem key={category} value={category}>
          {category}
        </MenuItem>
      ))}
    </CssSelectField>
  </FormControl>
);

export default function MetaData(props: Readonly<Props>) {
  const location = useLocation();
  const view = location.pathname?.split("/")[3];

  const characterCount = props.formDetails.description?.length;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { public: isPublic, ...rest } = props.formDetails;
    //reset error state to release focus on input field before typing new value
    if (Object.values(errorState).some((value) => value === true)) {
      for (const key in rest) {
        setErrorState((prev) => ({ ...prev, [key]: false }));
      }
    }
    const { name, value } = event.target;
    props.setFormDetails({
      ...props.formDetails,
      [name]: value,
    });
  };

  const [errorState, setErrorState] = React.useState({
    name: false,
    description: false,
    category: false,
    source: false,
    sourceUrl: false,
  });

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const { public: isPublic, ...rest } = props.formDetails;
    //form validation before submitting
    for (const key in rest) {
      if (rest[key as keyof typeof rest] === "") {
        setErrorState((prev) => ({ ...prev, [key]: true }));
        return;
      } else {
        setErrorState((prev) => ({ ...prev, [key]: false }));
      }
    }
    //if every key in errorState is false, then submit form
    if (Object.values(rest).every((value) => value !== "")) {
      console.log("submitting form");
      props.onSubmit(props.formDetails);
    } else {
      console.log("form errors");
    }
  };

  return (
    <div css={metaDatacss}>
      <h1>Describe your data</h1>
      <div
        css={`
          width: 100%;
        `}
      >
        <Grid container spacing={6}>
          <Grid lg={12} xs={12} md={12} item>
            <CssTextField
              id="outlined-basic"
              label="Data title"
              variant="outlined"
              helperText="Title must be between 6 and 50 characters in length."
              onChange={handleChange}
              name="name"
              value={props.formDetails.name}
              fullWidth
              data-cy="dataset-metadata-title"
              inputRef={(input) => input && errorState.name && input.focus()}
            />
          </Grid>
          <Box height={50} />
          <Grid lg={12} xs={12} md={12} item>
            <div
              css={`
                position: relative;
              `}
            >
              <CssTextField
                id="outlined-basic"
                label="Brief description of your dataset*  "
                variant="outlined"
                fullWidth
                data-cy="dataset-metadata-description"
                multiline
                minRows={3}
                inputProps={{
                  maxLength: 150,
                  "data-testid": "description",
                }}
                onChange={handleChange}
                name="description"
                value={props.formDetails.description}
                inputRef={(input) =>
                  input && errorState.description && input.focus()
                }
              />
              <p
                css={`
                  position: absolute;
                  bottom: -12px;
                  right: 20px;
                  font-weight: 325;
                  font-size: 12px;
                  color: #231d2c;
                `}
              >
                {characterCount}/150
              </p>
            </div>
          </Grid>
          <Box height={50} />
          <Grid lg={5} xs={12} md={5} item>
            <SelectCategoryField
              onChange={handleChange}
              setFormDetails={props.setFormDetails}
              formDetails={props.formDetails}
              error={errorState.category}
            />
          </Grid>
          <Grid lg={7} xs={12} md={7} item>
            <CssTextField
              id="outlined-basic"
              label="Source of the data"
              variant="outlined"
              onChange={handleChange}
              name="source"
              fullWidth
              data-cy="dataset-metadata-source"
              inputProps={{
                "data-testid": "Source-of-the-data",
              }}
              inputRef={(input) => input && errorState.source && input.focus()}
              value={props.formDetails.source}
            />
          </Grid>
          <Grid lg={12} xs={12} md={12} item>
            <CssTextField
              id="outlined-basic"
              label="Link to data source"
              variant="outlined"
              onChange={handleChange}
              name="sourceUrl"
              fullWidth
              data-cy="dataset-metadata-link"
              inputProps={{
                "data-testid": "Link-to-data-source",
              }}
              inputRef={(input) =>
                input && errorState.sourceUrl && input.focus()
              }
              value={props.formDetails.sourceUrl}
            />
          </Grid>
        </Grid>

        <div
          css={`
            display: flex;
            justify-content: flex-end;
            margin-top: 12rem;
            gap: 1rem;
          `}
        >
          <button
            onClick={props.handleBack}
            css={`
              color: #231d2c;
              text-transform: uppercase;
              width: 125px;

              :hover {
                opacity: 0.5;
              }
            `}
          >
            {view === "edit" ? "Cancel" : "previous"}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            data-cy="dataset-metadata-submit"
            css={`
              color: #231d2c;
              text-transform: uppercase;
              width: 125px;
              background: #231d2c;
              color: #fff;
              :hover {
                opacity: 0.8;
              }
            `}
          >
            {view === "edit" ? "Save" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
