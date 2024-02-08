import React from "react";
import Box from "@material-ui/core/Box";
import findIndex from "lodash/findIndex";
import Grid from "@material-ui/core/Grid";
import { Control, Controller, UseFormRegister, useForm } from "react-hook-form";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {
  CssSelectField,
  CssTextField,
  metaDatacss,
} from "app/modules/dataset-upload-module/style";
import { useStoreState } from "app/state/store/hooks";
import { IDatasetDetail } from "app/modules/dataset-module/routes/edit";
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
  value: string;
  register: UseFormRegister<IFormDetails>;
  control: Control<IFormDetails, any>;
  setFormDetails: React.Dispatch<React.SetStateAction<IFormDetails>>;
  formDetails: IFormDetails;
}) => (
  <FormControl variant="outlined" fullWidth>
    <InputLabel id="select-label">Data category</InputLabel>
    <Controller
      render={({ field }) => {
        React.useEffect(() => {
          // component is being updated by react-hook-form controller
          // update formDetails state with category value when field.value changes
          props.setFormDetails({
            ...props.formDetails,
            category: field.value,
          });
        }, [field.value]);
        return (
          <CssSelectField
            {...field}
            fullWidth
            id="select"
            value={field.value}
            label="Data category"
            labelId="select-label"
            onChange={field.onChange}
            MenuProps={{
              PaperProps: {
                style: {
                  borderRadius: "20px",
                  marginTop: `${
                    (findIndex(datasetCategories, props.value) + 1) * 60
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
        );
      }}
      control={props.control}
      rules={{ required: true }}
      name="category"
      defaultValue={props.value}
    />
  </FormControl>
);

export default function MetaData(props: Readonly<Props>) {
  const location = useLocation();
  const view = location.pathname.split("/")[3];
  const loadedDataset = useStoreState(
    (state) => state.dataThemes.DatasetGet.crudData
  ) as IDatasetDetail;
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<IFormDetails>({
    defaultValues: props.formDetails,
  });
  const [characterCount, setCharacterCount] = React.useState(0);

  React.useEffect(() => {
    //reset form state to formDetails state when dataset is loaded
    reset({
      ...props.formDetails,
    });
  }, [loadedDataset]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    props.setFormDetails({
      ...props.formDetails,
      [name]: value,
    });
  };

  React.useEffect(() => {
    //get character count from description length
    setCharacterCount(props.formDetails.description?.length);
  }, [props.formDetails.description]);

  return (
    <div css={metaDatacss}>
      <h1>Describe your data</h1>
      <div
        css={`
          width: 100%;
        `}
      >
        <form onSubmit={handleSubmit(props.onSubmit)}>
          <Grid container spacing={6}>
            <Grid lg={12} xs={12} md={12} item>
              <CssTextField
                id="outlined-basic"
                label="Data title "
                variant="outlined"
                {...register("name", { required: true })}
                helperText="Title must be between 6 and 50 characters in length."
                onChange={handleChange}
                value={props.formDetails.name}
                fullWidth
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
                  {...register("description", { required: true })}
                  fullWidth
                  multiline
                  minRows={3}
                  inputProps={{
                    maxLength: 150,
                    "data-testid": "description",
                  }}
                  onChange={handleChange}
                  value={props.formDetails.description}
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
                value={props.formDetails.category}
                register={register}
                control={control}
                setFormDetails={props.setFormDetails}
                formDetails={props.formDetails}
              />
            </Grid>
            <Grid lg={7} xs={12} md={7} item>
              <CssTextField
                id="outlined-basic"
                label="Source of the data"
                variant="outlined"
                {...register("source", { required: true })}
                onChange={handleChange}
                fullWidth
                inputProps={{
                  "data-testid": "Source-of-the-data",
                }}
                value={props.formDetails.source}
              />
            </Grid>
            <Grid lg={12} xs={12} md={12} item>
              <CssTextField
                id="outlined-basic"
                label="Link to data source"
                variant="outlined"
                {...register("sourceUrl", { required: true })}
                onChange={handleChange}
                fullWidth
                inputProps={{
                  "data-testid": "Link-to-data-source",
                }}
                value={props.formDetails.sourceUrl}
              />
            </Grid>
          </Grid>
          <div data-testid="errors-container">
            {errors.name && <p data-testid="error">{errors.name.message}</p>}
            {errors.description && (
              <p data-testid="error">{errors.description.message}</p>
            )}
            {errors.category && (
              <p data-testid="error">{errors.category.message}</p>
            )}
            {errors.source && (
              <p data-testid="error">{errors.source.message}</p>
            )}
            {errors.sourceUrl && (
              <p data-testid="error">{errors.sourceUrl.message}</p>
            )}
          </div>

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
              type="submit"
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
        </form>
      </div>
    </div>
  );
}
