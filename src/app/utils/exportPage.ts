// @ts-ignore
import domtoimage from "dom-to-image";
// @ts-ignore
import { jsPDF } from "jspdf";

export function exportPage(type: string, bgcolor: string, filename: string) {
  let node = document.getElementById("export-container");
  if (!node) {
    node = document.getElementById("common-chart-render-container");
  }

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
        //TODO: handle error
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
        //TODO: handle error
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
        const imgProps = pdf.getImageProperties(dataUrl);

        const pdfWidth = pdf.internal.pageSize.width;
        const pdfHeight = pdf.internal.pageSize.height;

        const widthRatio = pdfWidth / imgProps.width;
        const heightRatio = pdfHeight / imgProps.height;
        const ratio = Math.min(widthRatio, heightRatio);

        const w = imgProps.width * ratio;
        const h = imgProps.height * ratio;

        const x = (pdf.internal.pageSize.width - w) / 2;

        pdf.addImage(dataUrl, "PNG", x, 0, w, h);
        pdf.save(`${filename}.pdf`);
      })
      .catch((error: any) => {
        //TODO: handle error
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
        //TODO: handle error
      });
  }
}
