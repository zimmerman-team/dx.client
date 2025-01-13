import React from "react";
import TourStart from "app/components/Dialogs/TourGuide/tourStart";
import RowFrameIntro from "app/components/Dialogs/TourGuide/rowFrameIntro";
import SelectStructure from "./selectStructure";
import TourEnd from "./tourEnd";
import { useRecoilState } from "recoil";
import { storyCreationTourStepAtom } from "app/state/recoil/atoms";
import useCookie from "@devhammed/use-cookie";

export default function TourGuide(props: {
  storyType: "basic" | "advanced" | "ai";
  toolBoxOpen: boolean;
  handleClose: () => void;
  open: boolean;
}) {
  const [storyCreationTourStep, setStoryCreationTourStep] = useRecoilState(
    storyCreationTourStepAtom
  );

  const displayBasicStoryTourStep = () => {
    switch (storyCreationTourStep) {
      case 0:
        return (
          <TourStart
            setStep={setStoryCreationTourStep}
            open={props.open}
            handleClose={props.handleClose}
          />
        );
      case 1:
        return (
          <RowFrameIntro
            setStep={setStoryCreationTourStep}
            handleClose={props.handleClose}
            open={props.open}
            toolBoxOpen={props.toolBoxOpen}
            storyType={props.storyType}
          />
        );
      case 2:
        return (
          <SelectStructure
            handleClose={props.handleClose}
            open={props.open}
            toolBoxOpen={props.toolBoxOpen}
          />
        );
      case 3:
        return (
          <TourEnd
            handleClose={props.handleClose}
            open={props.open}
            storyType={props.storyType}
            toolBoxOpen={props.toolBoxOpen}
          />
        );
      default:
        return;
    }
  };
  const displayAdvancedStoryTourStep = () => {
    switch (storyCreationTourStep) {
      case 0:
        return (
          <TourStart
            setStep={setStoryCreationTourStep}
            open={props.open}
            handleClose={props.handleClose}
          />
        );
      case 1:
        return (
          <RowFrameIntro
            setStep={setStoryCreationTourStep}
            handleClose={props.handleClose}
            open={props.open}
            toolBoxOpen={props.toolBoxOpen}
            storyType={props.storyType}
          />
        );
      case 2:
        return (
          <TourEnd
            handleClose={props.handleClose}
            open={props.open}
            storyType={props.storyType}
            toolBoxOpen={props.toolBoxOpen}
          />
        );
      case 3:
      default:
        return;
    }
  };

  return (
    <>
      {props.storyType === "basic" && displayBasicStoryTourStep()}
      {props.storyType === "advanced" && displayAdvancedStoryTourStep()}
    </>
  );
}
