import { ArrowDownward } from "@material-ui/icons";
import React from "react";

const FAQ = () => {
  const [data, setData] = React.useState([
    {
      question: "How much does this app cost?",
      answer:
        "The cost of our app is $X per month/year. However, please note that the pricing may vary depending on any additional features or customizations you may require. For more accurate pricing information, we recommend visiting our website or contacting our sales team directly.",
      open: false,
    },
    {
      question: "Do you have a free plan?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      open: false,
    },
    {
      question: "What features comes on the free plan?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      open: false,
    },
    {
      question: "What happens if I cancel my plan?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      open: false,
    },
    {
      question: "What security measures do you have?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      open: false,
    },
    {
      question: "How long does my free trial last?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      open: false,
    },
    {
      question: "Do you have a special discount for students?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      open: false,
    },
    {
      question: "How do I schedule a product demo?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      open: false,
    },
  ]);

  const handleOpen = (index: number) => {
    setData((prev) =>
      prev.map((d, i) => {
        if (i === index) {
          return {
            ...d,
            open: !d.open,
          };
        }
        return d;
      })
    );
  };

  return (
    <section
      css={`
        h1,
        h2,
        h3,
        p {
          margin: 0;
          padding: 0;
        }
      `}
    >
      <h2
        css={`
          color: #252c34;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          text-align: center;
          font-size: 32px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        `}
      >
        Frequently asked questions
      </h2>
      <h3
        css={`
          color: #252c34;
          text-align: center;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 325;
          line-height: 20px; /* 142.857% */
          margin-top: 10px;
        `}
      >
        Let's be clear before start
      </h3>
      <div
        css={`
          padding-top: 30px;
          width: 1001px;
          margin: 0 auto;
        `}
      >
        {data.map((d, index) => (
          <div
            css={`
              :last-of-type {
                border-bottom: 1px solid #000000;
              }
            `}
          >
            <div
              css={`
                border-top: 1px solid #000000;
                padding: 20px;
                display: flex;
                justify-content: space-between;
              `}
              key={d.question}
            >
              <p
                css={`
                  font-size: 18px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 160%; /* 28.8px */
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                `}
              >
                {d.question}
              </p>

              <div
                css={`
                  cursor: pointer;
                  transform: rotate(${d.open ? "180" : "0"}deg);
                  transition: transform 0.3s;
                  width: 24px;
                  height: 24px;
                `}
                onClick={() => handleOpen(index)}
              >
                <ArrowDownward
                  css={`
                    color: #6061e5;
                  `}
                />
              </div>
            </div>
            <div
              css={`
                max-height: ${d.open ? "130px" : "0px"};
                overflow: hidden;
                transition: max-height 0.3s;
              `}
            >
              <div
                css={`
                  padding: 20px;
                  color: #252c34;
                  font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                  font-size: 16px;
                  font-style: normal;
                  font-weight: 325;
                  line-height: 160%; /* 25.6px */
                `}
              >
                {d.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
