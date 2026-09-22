import { jsPDF } from "jspdf";
import { proxiedImage } from "./vault";

function loadImageAsDataUrl(pageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = proxiedImage(pageUrl, { quality: 80 });
  });
}

export async function compilePagesToPdf(pages, fileName) {
  const pdf = new jsPDF("p", "mm", "a4");

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage();
    const imgData = await loadImageAsDataUrl(pages[i]);
    const calcImg = new Image();
    await new Promise((res) => {
      calcImg.onload = res;
      calcImg.src = imgData;
    });
    let renderWidth = pdf.internal.pageSize.getWidth();
    let renderHeight = (calcImg.height * renderWidth) / calcImg.width;
    if (renderHeight > pdf.internal.pageSize.getHeight()) {
      renderHeight = pdf.internal.pageSize.getHeight();
      renderWidth = (calcImg.width * renderHeight) / calcImg.height;
    }
    pdf.addImage(
      imgData,
      "JPEG",
      (pdf.internal.pageSize.getWidth() - renderWidth) / 2,
      (pdf.internal.pageSize.getHeight() - renderHeight) / 2,
      renderWidth,
      renderHeight
    );
  }

  pdf.save(`${fileName.trim().replace(/\s+/g, "_")}.pdf`);
}
