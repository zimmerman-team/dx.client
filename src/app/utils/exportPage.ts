// @ts-ignore
import domtoimage from "dom-to-image";
// @ts-ignore
import { jsPDF } from "jspdf";

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
    domtoimage
      .toPng(node, {
        bgcolor,
        filename,
      })
      .then((dataUrl: any) => {
        const height = node?.getBoundingClientRect().height as number;
        const width = node?.getBoundingClientRect().width as number;
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [width, height],
        });
        pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
        pdf.save(`${filename}.pdf`);
      })
      .catch((error: any) => {
        console.error("oops, something went wrong!", error);
      });
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
