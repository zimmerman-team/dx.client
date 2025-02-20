import { ReactComponent as AITemplateImg } from "app/modules/story-module/asset/aiTemplate-img.svg";
import { ReactComponent as BlankTemplateImg } from "app/modules/story-module/asset/blankTemplate-img.svg";
import { ReactComponent as AdvancedTemplateImg } from "app/modules/story-module/asset/advancedTemplate-img.svg";
import { PrimaryButton } from "app/components/Styled/button";

export interface StoryInitialViewProps {
  resetStory: () => void;
  handleSetButtonActive: (type: "basic" | "advanced" | "ai") => void;
}

export interface StoryTemplateModel {
  name: string;
  description: string;
  templateImg: React.ReactNode;
  value: "basic" | "advanced" | "ai";
  available?: boolean;
}

export const templates: StoryTemplateModel[] = [
  {
    name: "Blank template story",
    description: "A basic template to create your story",
    value: "basic",
    templateImg: <BlankTemplateImg />,
    available: true,
  },
  {
    name: "Advanced template story",
    description: "An advanced template to create your story",
    value: "advanced",
    templateImg: <AdvancedTemplateImg />,
    available: true,
  },
  {
    name: "AI-powered template",
    description: "Use AI to create your story",
    value: "ai",
    templateImg: <AITemplateImg />,
    available: false,
  },
];

export const TemplateItem = ({
  name,
  value,
  description,
  handleClick,
  templateImg,
  available,
}: StoryTemplateModel & {
  handleClick: () => void;
}) => {
  return (
    <div
      css={`
        height: 125px;
        width: 296px;
        position: relative;
        padding: 12px 16px;
        background: #f2f7fd;
        &:hover {
          cursor: pointer;

          button {
            cursor: pointer;
            background: #6061e5;
          }
        }
        @media (min-width: 1266px) {
          @media (max-width: 1325px) {
            width: 275px;
          }
        }
        @media (max-width: 1265px) {
          width: 100%;
        }
      `}
      onClick={handleClick}
      data-cy="story-template-card"
    >
      <div>
        <div
          css={`
            font-size: 14px;
            font-weight: bold;
          `}
        >
          <p
            css={`
              margin: 0px;
              font-size: 14px;
              color: #262c34;
            `}
          >
            <b>{name}</b>
          </p>
          <p
            css={`
              font-size: 10px;
              margin-top: -3px;
              font-weight: normal;
              color: #495057;
            `}
          >
            {description}
          </p>
        </div>

        <div />
        <div>{templateImg}</div>
      </div>
      <div>
        {!available && (
          <div
            css={`
              top: 16px;
              right: 14px;
              position: absolute;
              font-size: 12px;
              padding: 1px 6px;
              line-height: 14px;
              border-radius: 10px;
              border: 1px solid #000;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            `}
          >
            Sneak Preview
          </div>
        )}
        <PrimaryButton
          size="xs"
          bg="dark"
          data-cy="use-story-template-button"
          css={`
            bottom: 16px;
            right: 14px;
            position: absolute;
          `}
        >
          {value === "ai" ? "Want to try it?" : " Use template"}
        </PrimaryButton>
      </div>
    </div>
  );
};
