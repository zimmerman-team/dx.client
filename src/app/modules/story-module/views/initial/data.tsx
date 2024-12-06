import { ReactComponent as AITemplateImg } from "app/modules/report-module/asset/aiTemplate-img.svg";
import { ReactComponent as BlankTemplateImg } from "app/modules/report-module/asset/blankTemplate-img.svg";
import { ReactComponent as AdvancedTemplateImg } from "app/modules/report-module/asset/advancedTemplate-img.svg";
import { ReactComponent as RightArrowIcon } from "app/modules/report-module/asset/rightArrow.svg";

export interface ReportInitialViewProps {
  resetReport: () => void;
  handleSetButtonActive: (type: "basic" | "advanced" | "ai") => void;
}

export interface ReportTemplateModel {
  name: string;
  description: string;
  templateImg: React.ReactNode;
  value: "basic" | "advanced" | "ai";
  available?: boolean;
}

export const templates: ReportTemplateModel[] = [
  {
    name: "Blank template report",
    description: "A basic template to create your report",
    value: "basic",
    templateImg: <BlankTemplateImg />,
    available: true,
  },
  {
    name: "Advanced template report",
    description: "An advanced template to create your report",
    value: "advanced",
    templateImg: <AdvancedTemplateImg />,
    available: true,
  },
  {
    name: "AI-powered template",
    description: "Use AI to create your report",
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
}: ReportTemplateModel & {
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
      data-cy="report-template-card"
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
            `}
          >
            Sneak Preview
          </div>
        )}
        <button
          css={`
            bottom: 16px;
            right: 14px;
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5.96px;
            outline: none;
            border: none;
            background: #231d2c;
            border-radius: 17.8756px;
            height: 24.3px;
            width: 99px;
            padding: 7.15026px 10px;
            color: #ffffff;
            span {
              font-size: 8.34197px;
              font-weight: 500;
              text-transform: uppercase;
              font-family: "Inter", sans-serif;
            }
          `}
          data-cy="use-report-template-button"
        >
          {value === "ai" ? (
            <span>Want to try it?</span>
          ) : (
            <>
              <span>Use template</span> <RightArrowIcon />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
