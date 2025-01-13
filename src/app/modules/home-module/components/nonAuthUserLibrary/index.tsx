import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { ReactComponent as AddIcon } from "app/modules/home-module/assets/add-icon.svg";
import Panel from "./panel";
import CoreFeaturesCard from "./coreFeaturesCard";
import ExtraFeaturesCard from "./extraFeaturesCard";
import AssetsList from "./assetsList";
import SignupDialog from "./signupDialog";

export default function NonAuthUserLibrary() {
  const [openedPanel, setOpenedPanel] = React.useState<
    "coreFeaturesPanel" | "extraFeaturesPanel" | null
  >(null);

  const [modalOpen, setModalOpen] = React.useState(false);
  const handleCardCollapse = () => {
    setOpenedPanel(null);
  };

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  const panelCard = React.useMemo(() => {
    if (openedPanel === "coreFeaturesPanel") {
      return <CoreFeaturesCard handleClose={handleCardCollapse} />;
    } else if (openedPanel === "extraFeaturesPanel") {
      return <ExtraFeaturesCard handleClose={handleCardCollapse} />;
    } else {
      return null;
    }
  }, [openedPanel]);

  return (
    <React.Fragment>
      <div
        css={`
          box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.1);
          padding: 72px 0;
        `}
      >
        <Container
          maxWidth="lg"
          css={`
            > div :nth-of-type(1) {
              > p {
                color: #2b3674;
                font-family: "GothamNarrow-Bold", sans-serif;
                font-size: 40px;
                line-height: 110%; /* 44px */
                margin: 0px;
              }
              > button {
                border-radius: 25px;
                background: #231d2c;
                display: flex;
                height: 40px;
                padding: 0px 24px;
                justify-content: center;
                align-items: center;
                gap: 10px;
                color: #fff;
                text-align: center;
                border: none;
                cursor: pointer;
                font-family: "GothamNarrow-Bold", sans-serif;
                font-size: 14px;
              }
            }
          `}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            marginBottom={"32px"}
          >
            <p>Discover Impactful Library Assets</p>
            <button onClick={handleModal}>
              Add an Asset <AddIcon />
            </button>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gridColumnGap={"30px"}
          >
            <Panel
              isOpen={openedPanel === "coreFeaturesPanel"}
              setIsOpen={setOpenedPanel}
              type="coreFeaturesPanel"
              tooltip="Learn How It Works"
              title="What Can You Do with DX?"
              description="DX helps you transform raw data into stunning charts and professional reports with just a few clicks—seamless, intuitive, and built for everyone."
            />
            <Panel
              isOpen={openedPanel === "extraFeaturesPanel"}
              setIsOpen={setOpenedPanel}
              type="extraFeaturesPanel"
              tooltip="Find Out Why"
              title="How DX Makes Your Life Easier"
              description="Save time, make better decisions, and impress your team with effortless data storytelling—DX puts the power of insights in your hands."
            />
          </Box>
          <Box height={"20px"} display={openedPanel ? "block" : "none"} />
          {panelCard}
          <Box height={"32px"} />

          <AssetsList />
        </Container>
      </div>
      <SignupDialog modalDisplay={modalOpen} setModalDisplay={handleModal} />
    </React.Fragment>
  );
}
