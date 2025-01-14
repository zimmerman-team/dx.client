import { Container } from "@material-ui/core";
import MetaData from "app/modules/dataset-module/routes/upload-module/upload-steps/metaData";
import { allAssetsSortBy } from "app/state/recoil/atoms";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import axios from "axios";
import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useTitle } from "react-use";
import { useRecoilValue } from "recoil";
interface IDatasetDetail {
  name: string;
  description: string;
  public: boolean;
  category: string;
  source: string;
  sourceUrl: string;
  owner: string;
  createdDate: string;
  updatedDate: string;
  authId: string;
  id: string;
}

export default function EditMetaData() {
  useTitle("DX Dataxplorer - Edit Meta Data");

  const { page } = useParams<{ page: string }>();
  const token = useStoreState((state) => state.AuthToken.value);
  const sortValue = useRecoilValue(allAssetsSortBy);
  const history = useHistory();
  const fetchDataset = useStoreActions(
    (actions) => actions.dataThemes.DatasetGet.fetch
  );
  const loadDatasets = useStoreActions(
    (actions) => actions.dataThemes.DatasetGetList.fetch
  );
  const loadedDataset = useStoreState(
    (state) => state.dataThemes.DatasetGet.crudData
  ) as IDatasetDetail;

  React.useEffect(() => {
    if (token) {
      fetchDataset({ token, getId: page, storeInCrudData: true });
    }
  }, [token]);

  const [formDetails, setFormDetails] = React.useState({
    name: "",
    description: "",
    category: "",
    public: false,
    source: "",
    sourceUrl: "",
  });

  React.useEffect(() => {
    setFormDetails({
      name: loadedDataset?.name,
      description: loadedDataset?.description,
      category: loadedDataset?.category,
      public: loadedDataset?.public,
      source: loadedDataset?.source,
      sourceUrl: loadedDataset?.sourceUrl,
    });
  }, [loadedDataset]);

  const onSubmit = async () => {
    axios
      .patch(
        `${process.env.REACT_APP_API}/datasets/${page}`,
        { ...formDetails },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        loadDatasets({
          token,
          nonAuthCall: !token,
          storeInCrudData: true,
          filterString: `filter={"order":"${sortValue} ${
            sortValue === "name" ? "asc" : "desc"
          }","limit":15,"offset":0}`,
        });
        history.goBack();
      })
      .catch(() => {
        //TODO: handle error
      });
  };
  const handleBack = () => {
    history.goBack();
  };
  return (
    <>
      <Container maxWidth="lg">
        <div
          css={`
            height: 108px;
          `}
        />
        <MetaData
          formDetails={formDetails}
          handleBack={handleBack}
          onSubmit={onSubmit}
          setFormDetails={setFormDetails}
        />
      </Container>
    </>
  );
}
