import { Resume } from "../../types/resume";

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_ ]/g, "").trim();
}

export function generatePdfFilename(resume: Resume): string {
  if (resume.company && resume.jobTitle) {
    return `${sanitizeFilename(resume.company)} - ${sanitizeFilename(resume.jobTitle)} - Resume.pdf`;
  }
  if (resume.jobTitle) {
    return `${sanitizeFilename(resume.jobTitle)} - Resume.pdf`;
  }
  if (resume.contact.fullName) {
    return `${sanitizeFilename(resume.contact.fullName)} - Resume.pdf`;
  }
  return "Resume.pdf";
}

function createExportableClone(originalElement: HTMLElement): { clone: HTMLElement; cleanup: () => void } {
  // Create an offscreen wrapper with exact A4 794px width (210mm @ 96 DPI)
  const offscreenContainer = document.createElement("div");
  offscreenContainer.style.position = "fixed";
  offscreenContainer.style.left = "-9999px";
  offscreenContainer.style.top = "0";
  offscreenContainer.style.width = "794px";
  offscreenContainer.style.background = "#FFFFFF";
  offscreenContainer.style.zIndex = "-1000";
  offscreenContainer.style.transform = "none";

  // Deep clone the resume element
  const clone = originalElement.cloneNode(true) as HTMLElement;
  clone.id = "ats-resume-document-export-clone";
  clone.classList.add("ats-pdf-exporting");
  clone.style.width = "794px";
  clone.style.maxWidth = "794px";
  clone.style.minWidth = "794px";
  clone.style.backgroundColor = "#FFFFFF";
  clone.style.transform = "none";
  // Honor the user's configured letterSpacing slider value on the clone!
  const userLetterSpacing = originalElement.style.letterSpacing || "0px";
  clone.style.letterSpacing = userLetterSpacing;
  clone.style.boxShadow = "none";
  clone.style.margin = "0";

  // Ensure all children disable ligatures and inherit the configured letter-spacing
  const allElements = clone.querySelectorAll<HTMLElement>("*");
  allElements.forEach((el) => {
    // If element doesn't have an explicit custom letterSpacing, use user configured letterSpacing
    if (!el.style.letterSpacing) {
      el.style.letterSpacing = userLetterSpacing;
    }
    (el.style as unknown as Record<string, string>)["fontVariantLigatures"] = "none";
    (el.style as unknown as Record<string, string>)["fontFeatureSettings"] = '"liga" 0, "clig" 0, "dlig" 0, "hlig" 0';
  });

  // Walk text nodes: ensure commas, pluses, slashes, and symbols have correct spacing and do not collide
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT, null);
  let currentNode = walker.nextNode();
  while (currentNode) {
    if (currentNode.nodeValue) {
      let val = currentNode.nodeValue;
      // If comma is followed by word without a standard space, or followed by standard space, ensure non-breaking clean spacing
      // Prevent numbers followed by '+' from colliding
      val = val.replace(/(\d)\+/g, "$1\u00A0+");
      // Prevent '+' followed by numbers from colliding
      val = val.replace(/\+(\d)/g, "+\u00A0$1");
      // Prevent commas from colliding with preceding lowercase/uppercase letters (e.g. "Prototyping, Design")
      // html2canvas sometimes renders comma on top of preceding glyph; adding zero-width non-joiner prevents ligature collapse
      val = val.replace(/([a-zA-Z0-9])([,;])/g, "$1\u200C$2");
      // Ensure space after comma is rendered as standard space
      val = val.replace(/([,;])(\s+)/g, "$1 ");
      // Replace en-dash / em-dash with standard hyphen-minus
      val = val.replace(/[\u2013\u2014]/g, "-");
      currentNode.nodeValue = val;
    }
    currentNode = walker.nextNode();
  }

  offscreenContainer.appendChild(clone);
  document.body.appendChild(offscreenContainer);

  return {
    clone,
    cleanup: () => {
      if (document.body.contains(offscreenContainer)) {
        document.body.removeChild(offscreenContainer);
      }
    }
  };
}

export async function exportResumeToPdf(elementId: string, filename: string): Promise<boolean> {
  // Ensure all document fonts and external web fonts are fully loaded before cloning and capturing
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore font loading error and proceed
    }
  }

  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Resume element not found for PDF export");
    return false;
  }

  const { clone, cleanup } = createExportableClone(element);

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html2pdf = (await import("html2pdf.js")).default as any;

    const opt = {
      margin: [0, 0, 0, 0],
      filename: filename,
      // Use lossless PNG to prevent JPEG compression ringing/blurriness around small text glyphs
      image: { type: "png", quality: 1.0 },
      html2canvas: {
        // High-DPI scale (3 = ~288 DPI) for razor-sharp typography
        scale: 3,
        useCORS: true,
        letterRendering: false,
        scrollY: 0,
        scrollX: 0,
        width: 794,
        windowWidth: 794,
        logging: false,
        backgroundColor: "#FFFFFF"
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true
      },
      pagebreak: {
        mode: ["css", "legacy"],
        before: ".page-break-before",
        after: ".page-break-after",
        avoid: ["article", "h2", "h3", ".avoid-break"]
      }
    };

    await html2pdf().set(opt).from(clone).save();
    return true;
  } catch (error) {
    console.error("html2pdf export failed, initiating browser print fallback", error);
    window.print();
    return true;
  } finally {
    cleanup();
  }
}

export async function exportResumeToBlob(elementId: string): Promise<Blob | null> {
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore font loading error and proceed
    }
  }

  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Resume element not found for PDF export");
    return null;
  }

  const { clone, cleanup } = createExportableClone(element);

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html2pdf = (await import("html2pdf.js")).default as any;

    const opt = {
      margin: [0, 0, 0, 0],
      // Use lossless PNG for crisp glyph rendering
      image: { type: "png", quality: 1.0 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        letterRendering: false,
        scrollY: 0,
        scrollX: 0,
        width: 794,
        windowWidth: 794,
        logging: false,
        backgroundColor: "#FFFFFF"
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true
      },
      pagebreak: {
        mode: ["css", "legacy"],
        before: ".page-break-before",
        after: ".page-break-after",
        avoid: ["article", "h2", "h3", ".avoid-break"]
      }
    };

    const pdfBlob: Blob = await html2pdf().set(opt).from(clone).outputPdf("blob");
    return pdfBlob;
  } catch (error) {
    console.error("html2pdf outputPdf failed:", error);
    return null;
  } finally {
    cleanup();
  }
}

export function printResume(): void {
  window.print();
}
