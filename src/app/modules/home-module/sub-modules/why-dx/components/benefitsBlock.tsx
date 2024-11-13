import React from "react";
import {
  benefitscss,
  firstColcss,
  secondColcss,
  thirdColcss,
} from "app/modules/home-module/sub-modules/why-dx/style";

export default function BenefitsBlock() {
  return (
    <div css={benefitscss}>
      <h2>Enjoy the benefits for you and your team</h2>
      <div
        css={`
          display: flex;
          gap: 17px;
        `}
      >
        <div css={firstColcss}>
          <div>
            <h3>Simplifying complexity</h3>
            <p>
              Translate complex data into accessible and understandable visual
              information.
            </p>
          </div>
          <div>
            <h3>Powerful knowledge communication</h3>
            <p>
              Effectively communicate impactful information to drive
              understanding and knowledge geared
              <br /> towards better decision-making.
            </p>
          </div>
        </div>
        <div css={secondColcss}>
          <div>
            <h3>AI-Powered</h3>
            <p>
              Amplify data and information and develop insights through the use
              of advanced AI technologies.
            </p>
          </div>
          <div>
            <h3>Seamless data connection</h3>
            <p>
              Efficient and convenient data uploading, storage, and mapping
              capabilities.
            </p>
          </div>
          <div>
            <h3>Secure data sharing</h3>
            <p>
              Latest encryption technology ensures that your data is secure and
              protected at all times.
            </p>
          </div>
        </div>

        <div css={thirdColcss}>
          <div>
            <h3>Enhanced productivity</h3>
            <p>
              Streamlines your data communication processes, allowing your
              organization to be more productive and efficient.
            </p>
          </div>
          <div>
            <h3>Easy to use</h3>
            <p>
              Designed to be intuitive and user-friendly, so you can start using
              it right away.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
