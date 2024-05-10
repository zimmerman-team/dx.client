// @ts-ignore
import domtoimage from "dom-to-image";
// @ts-ignore
import html2pdf from "html2pdf.js";

export function exportPage(type: string, bgcolor: string, filename: string) {
  let node = document.getElementById("export-container");
  if (!node) {
    node = document.getElementById("common-chart-render-container");
  }
  // const filter = (n: any) => n.id !== "app-bar" && n.id !== "subheader-toolbar";
  if (type === "png") {
    domtoimage
      .toPng(node, {
        bgcolor,
        filename,
      })
      .then((dataUrl: any) => {
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error: any) => {
        console.error("oops, something went wrong!", error);
      });
  } else if (type === "svg") {
    domtoimage
      .toSvg(node, { bgcolor })
      .then((dataUrl: any) => {
        const link = document.createElement("a");
        link.download = `${filename}.svg`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error: any) => {
        console.error("oops, something went wrong!", error);
      });
  } else if ((type = "pdf")) {
    const WIDTH = 1133;

    const rect = node?.getBoundingClientRect();

    console.log(rect?.height);
    html2pdf()
      .from(node)
      .set({
        image: { type: "jpeg", quality: 1 },
        jsPDF: {
          unit: "px",
          format: [WIDTH, rect?.height],
          orientation: "landscape",
        },
      })
      .save(`${filename}.pdf`);
  } else {
    domtoimage
      .toJpeg(node, { bgcolor })
      .then((dataUrl: any) => {
        const link = document.createElement("a");
        link.download = `${filename}.jpg`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error: any) => {
        console.error("oops, something went wrong!", error);
      });
  }
}
