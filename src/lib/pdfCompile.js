import { jsPDF } from "jspdf";
import { isPdfDocumentUrl, proxiedImage, sanitizeDownloadFileName } from "./vault.js";

function loadImageAsDataUrl(pageUrl, pageNumber) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("The browser couldn't prepare the image.");
        context.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      } catch (error) {
        reject(new Error(`Couldn't prepare image page ${pageNumber}: ${error.message}`));
      }
    };
    img.onerror = () => reject(new Error(`Couldn't load image page ${pageNumber}. Check that the GitHub file is public and accessible.`));
    img.src = proxiedImage(pageUrl, { quality: 80 });
  });
}

export async function compilePagesToPdf(pages, fileName) {
  if (!Array.isArray(pages) || pages.length === 0) {
    throw new Error("There are no pages to compile.");
  }
  if (pages.some(isPdfDocumentUrl)) {
    throw new Error("PDF compilation supports image pages only. This paper already contains a PDF; open the original PDF instead.");
  }

  const pdf = new jsPDF("p", "mm", "a4");

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage();
    const imgData = await loadImageAsDataUrl(pages[i], i + 1);
    const calcImg = new Image();
    await new Promise((resolve, reject) => {
      calcImg.onload = resolve;
      calcImg.onerror = () => reject(new Error(`Couldn't read image page ${i + 1}.`));
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

  const outputName = sanitizeDownloadFileName(fileName, "paper")
    .replace(/\.pdf$/i, "") || "paper";
  pdf.save(`${outputName}.pdf`);
}
