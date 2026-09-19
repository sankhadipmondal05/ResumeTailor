import React, { useEffect, useRef, useState } from "react";
import { Resume } from "../../types/resume";

interface AtsResumeRendererProps {
  resume: Resume;
  containerId?: string;
  isPrintMode?: boolean;
}

export const AtsResumeRenderer: React.FC<AtsResumeRendererProps> = ({
  resume,
  containerId = "ats-resume-document"
}) => {
  const { settings, contact, summary, experience, projects, education, skills, certifications } = resume;

  const rawFontFamily = settings?.fontFamily || "Inter";
  // Clean, high-fidelity font stacks
  const getFontStack = (font: string) => {
    switch (font) {
      case "Inter":
        return '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      case "Aptos":
        return '"Aptos", "Segoe UI", "Calibri", Arial, sans-serif';
      case "Calibri":
        return 'Calibri, "Segoe UI", Arial, sans-serif';
      case "Georgia":
        return 'Georgia, "Times New Roman", serif';
      case "Arial":
      default:
        return 'Arial, "Helvetica Neue", Helvetica, sans-serif';
    }
  };
  const fontFamilyStack = getFontStack(rawFontFamily);

  const fontSize = settings?.fontSize || 10.5;
  const lineHeight = settings?.lineHeight || 1.15;
  const marginMm = settings?.margin || 16.5; // 0.65 inches = 16.51 mm
  const sectionSpacingPx = settings?.sectionSpacing || 12; // 12 pt before
  const letterSpacingPx = settings?.letterSpacing ?? 0;

  const contentRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(0.85);

  // Exact A4 height in CSS pixels at 96 DPI: 297mm * (96 / 25.4) = 1122.52px
  const a4HeightPx = 1122.5;

  // Measure content height and compute total A4 pages accurately
  useEffect(() => {
    const measurePages = () => {
      if (!contentRef.current) return;
      // Use getBoundingClientRect for sub-pixel accuracy
      const rect = contentRef.current.getBoundingClientRect();
      const contentH = rect.height || contentRef.current.scrollHeight;
      // Strictly 1 page if height is within 1123px
      const calculatedPages = contentH <= 1123 ? 1 : Math.ceil(contentH / a4HeightPx);
      setPageCount(calculatedPages);
    };

    measurePages();
    const resizeObserver = new ResizeObserver(measurePages);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [resume, fontSize, lineHeight, marginMm, sectionSpacingPx, letterSpacingPx, a4HeightPx]);

  // Total height of the unscaled sheets container
  const totalSheetsHeight = pageCount * a4HeightPx + Math.max(0, pageCount - 1) * 24;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px 0 60px 0",
        background: "#E2E5E9",
        minHeight: "100%",
        width: "100%"
      }}
    >
      {/* Top Toolbar: Page indicator & Zoom controls */}
      <div
        className="ats-page-indicator"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "16px",
          flexWrap: "wrap",
          justifyContent: "center"
        }}
      >
        {/* Page Count Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 14px",
            backgroundColor: "#FFFFFF",
            borderRadius: "20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: pageCount > 1 ? "#B45309" : "#4B5563"
          }}
        >
          <span>
            A4 Preview: {pageCount} {pageCount === 1 ? "Page" : "Pages"}
          </span>
          {pageCount > 1 && (
            <span
              style={{
                backgroundColor: "#FEF3C7",
                color: "#92400E",
                padding: "2px 8px",
                borderRadius: "10px",
                fontSize: "0.72rem",
                fontWeight: 700
              }}
            >
              Multi-Page (Overflows)
            </span>
          )}
        </div>

        {/* Zoom Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "3px 8px",
            backgroundColor: "#FFFFFF",
            borderRadius: "20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
          }}
        >
          <button
            type="button"
            title="Zoom Out"
            onClick={() => setZoom((prev) => Math.max(0.5, Number((prev - 0.05).toFixed(2))))}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "3px 8px",
              fontSize: "14px",
              fontWeight: 700,
              borderRadius: "4px",
              color: "#374151"
            }}
          >
            -
          </button>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              minWidth: "46px",
              textAlign: "center",
              color: "#1F2937"
            }}
          >
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            title="Zoom In"
            onClick={() => setZoom((prev) => Math.min(1.5, Number((prev + 0.05).toFixed(2))))}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "3px 8px",
              fontSize: "14px",
              fontWeight: 700,
              borderRadius: "4px",
              color: "#374151"
            }}
          >
            +
          </button>
          <div style={{ width: "1px", height: "14px", backgroundColor: "#E5E7EB", margin: "0 4px" }} />
          <button
            type="button"
            title="Fit to Preview Width (80%)"
            onClick={() => setZoom(0.8)}
            style={{
              border: "none",
              background: zoom === 0.8 ? "#EEF2FF" : "transparent",
              color: zoom === 0.8 ? "#4F46E5" : "#6B7280",
              cursor: "pointer",
              padding: "2px 7px",
              fontSize: "0.75rem",
              fontWeight: 600,
              borderRadius: "12px"
            }}
          >
            Fit
          </button>
          <button
            type="button"
            title="100% Full A4 Scale"
            onClick={() => setZoom(1.0)}
            style={{
              border: "none",
              background: zoom === 1.0 ? "#EEF2FF" : "transparent",
              color: zoom === 1.0 ? "#4F46E5" : "#6B7280",
              cursor: "pointer",
              padding: "2px 7px",
              fontSize: "0.75rem",
              fontWeight: 600,
              borderRadius: "12px"
            }}
          >
            100%
          </button>
        </div>
      </div>

      {/* Scaled Preview Wrapper to correctly allocate scroll height */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          height: `${totalSheetsHeight * zoom}px`,
          overflow: "visible"
        }}
      >
        {/* Document Sheets Container */}
        <div
          className="ats-sheets-container"
          style={{
            position: "relative",
            width: "210mm",
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out"
          }}
        >
        {/* Background Paper Sheets (Each exactly A4 height with 24px gap between pages) */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            zIndex: 0
          }}
        >
          {Array.from({ length: pageCount }).map((_, idx) => (
            <div
              key={idx}
              style={{
                width: "210mm",
                height: `${a4HeightPx}px`,
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
                borderRadius: "3px",
                marginBottom: idx < pageCount - 1 ? "24px" : "0",
                position: "relative"
              }}
            >
              {/* Page Number Label on bottom-right of sheet */}
              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "16px",
                  fontSize: "11px",
                  color: "#9CA3AF",
                  fontFamily: "sans-serif"
                }}
              >
                Page {idx + 1} of {pageCount}
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Page Break Gap Guides between pages */}
        {pageCount > 1 &&
          Array.from({ length: pageCount - 1 }).map((_, index) => {
            // Sheet height plus accumulated 24px gaps
            const boundaryTopPx = (index + 1) * a4HeightPx + index * 24;
            return (
              <div
                key={index}
                className="ats-page-break-guide"
                style={{
                  position: "absolute",
                  top: `${boundaryTopPx}px`,
                  left: "-20px",
                  right: "-20px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 5,
                  pointerEvents: "none"
                }}
              >
                <span
                  style={{
                    backgroundColor: "#475569",
                    color: "#FFFFFF",
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "2px 10px",
                    borderRadius: "12px",
                    letterSpacing: "0.04em",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.15)"
                  }}
                >
                  Page {index + 1} ⭢ Page {index + 2} Break
                </span>
              </div>
            );
          })}

        {/* Content Document */}
        <main
          id={containerId}
          ref={contentRef}
          style={{
            position: "relative",
            zIndex: 1,
            width: "210mm",
            backgroundColor: "transparent",
            color: "#000000",
            padding: `${marginMm}mm`, // default 16.5mm = 0.65" margins top/bottom and left/right
            boxSizing: "border-box",
            fontFamily: fontFamilyStack,
            fontSize: `${fontSize}pt`, // default 10.5pt body
            lineHeight: lineHeight, // default 1.15
            letterSpacing: `${letterSpacingPx}pt`, // default 0pt body
            textAlign: "left" // default Left alignment
          }}
        >
        {/* HEADER: Contact Info with 22pt Bold Full Name */}
        <header style={{ marginBottom: `${sectionSpacingPx}pt`, textAlign: "center" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "22pt",
              fontWeight: 700,
              letterSpacing: "+0.3pt",
              lineHeight: 1.15,
              color: "#000000"
            }}
          >
            {contact.fullName || "Your Full Name"}
          </h1>
          {contact.title && (
            <div
              style={{
                fontSize: "11pt",
                fontWeight: 600,
                marginTop: "3px",
                color: "#222222"
              }}
            >
              {contact.title}
            </div>
          )}
          {/* Contact Details with Hyperlinks */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "4px 8px",
              marginTop: "5px",
              fontSize: "9.5pt",
              color: "#333333"
            }}
          >
            {contact.phone && (
              <a
                href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
                style={{
                  color: "#0A66C2",
                  textDecoration: "underline",
                  textUnderlineOffset: "2px"
                }}
              >
                {contact.phone}
              </a>
            )}
            {contact.phone && (contact.email || contact.location || contact.linkedin || contact.github || contact.portfolio) && (
              <span style={{ color: "#9CA3AF" }}>•</span>
            )}

            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                style={{
                  color: "#0A66C2",
                  textDecoration: "underline",
                  textUnderlineOffset: "2px"
                }}
              >
                {contact.email}
              </a>
            )}
            {contact.email && (contact.location || contact.linkedin || contact.github || contact.portfolio) && (
              <span style={{ color: "#9CA3AF" }}>•</span>
            )}

            {contact.location && (
              <span style={{ color: "#4B5563" }}>
                {contact.location}
              </span>
            )}
            {contact.location && (contact.linkedin || contact.github || contact.portfolio) && (
              <span style={{ color: "#9CA3AF" }}>•</span>
            )}

            {contact.linkedin && (
              <a
                href={contact.linkedin.startsWith("http") ? contact.linkedin : `https://${contact.linkedin}`}
                target="_blank"
                rel="noreferrer noopener"
                style={{
                  color: "#0A66C2",
                  textDecoration: "underline",
                  textUnderlineOffset: "2px"
                }}
              >
                {contact.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "linkedin.com/in/").replace(/\/$/, "")}
              </a>
            )}
            {contact.linkedin && (contact.github || contact.portfolio) && (
              <span style={{ color: "#9CA3AF" }}>•</span>
            )}

            {contact.github && (
              <a
                href={contact.github.startsWith("http") ? contact.github : `https://${contact.github}`}
                target="_blank"
                rel="noreferrer noopener"
                style={{
                  color: "#0A66C2",
                  textDecoration: "underline",
                  textUnderlineOffset: "2px"
                }}
              >
                {contact.github.replace(/^https?:\/\/(www\.)?github\.com\//, "github.com/").replace(/\/$/, "")}
              </a>
            )}
            {contact.github && contact.portfolio && (
              <span style={{ color: "#9CA3AF" }}>•</span>
            )}

            {contact.portfolio && (
              <a
                href={contact.portfolio.startsWith("http") ? contact.portfolio : `https://${contact.portfolio}`}
                target="_blank"
                rel="noreferrer noopener"
                style={{
                  color: "#0A66C2",
                  textDecoration: "underline",
                  textUnderlineOffset: "2px"
                }}
              >
                {contact.portfolio.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            )}
          </div>
        </header>

        {/* SUMMARY */}
        {summary && summary.trim().length > 0 && (
          <section style={{ marginTop: `${sectionSpacingPx}pt`, marginBottom: "6pt" }}>
            <h2
              style={{
                margin: "0 0 5pt 0",
                fontSize: "12pt",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "+0.3pt",
                borderBottom: "1px solid #111111",
                paddingBottom: "2px"
              }}
            >
              Professional Summary
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: `${fontSize}pt`,
                lineHeight: lineHeight,
                color: "#111111",
                textAlign: "left"
              }}
            >
              {summary}
            </p>
          </section>
        )}

        {/* EXPERIENCE */}
        {experience && experience.length > 0 && (
          <section style={{ marginTop: `${sectionSpacingPx}pt`, marginBottom: "6pt" }}>
            <h2
              style={{
                margin: "0 0 5pt 0",
                fontSize: "12pt",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "+0.3pt",
                borderBottom: "1px solid #111111",
                paddingBottom: "2px"
              }}
            >
              Work Experience
            </h2>
            {experience.map((exp) => (
              <article
                key={exp.id}
                style={{
                  marginBottom: "8pt",
                  pageBreakInside: "avoid",
                  breakInside: "avoid"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline"
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "10.5pt",
                      fontWeight: 700
                    }}
                  >
                    {exp.company}
                    <span style={{ fontWeight: 600 }}> - {exp.role}</span>
                  </h3>
                  <span style={{ fontSize: "9.5pt", fontWeight: 500, whiteSpace: "nowrap" }}>
                    {exp.startDate} {exp.startDate && (exp.current ? "- Present" : exp.endDate ? `- ${exp.endDate}` : "")}
                  </span>
                </div>
                {exp.location && (
                  <div style={{ fontSize: "9pt", color: "#444444", marginBottom: "3px" }}>
                    {exp.location}
                  </div>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul
                    style={{
                      margin: "3pt 0 0 0",
                      paddingLeft: "16px",
                      listStyleType: "disc"
                    }}
                  >
                    {exp.bullets.map((b, i) => (
                      <li key={i} style={{ marginBottom: "2.5pt", lineHeight: lineHeight, textAlign: "left" }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </section>
        )}

        {/* PROJECTS */}
        {projects && projects.length > 0 && (
          <section style={{ marginTop: `${sectionSpacingPx}pt`, marginBottom: "6pt" }}>
            <h2
              style={{
                margin: "0 0 5pt 0",
                fontSize: "12pt",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "+0.3pt",
                borderBottom: "1px solid #111111",
                paddingBottom: "2px"
              }}
            >
              Projects
            </h2>
            {projects.map((proj) => (
              <article
                key={proj.id}
                style={{
                  marginBottom: "7pt",
                  pageBreakInside: "avoid",
                  breakInside: "avoid"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline"
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "10.5pt",
                      fontWeight: 700
                    }}
                  >
                    {proj.name}
                  </h3>
                  {proj.url && (
                    <a
                      href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      style={{
                        fontSize: "9pt",
                        color: "#0A66C2",
                        textDecoration: "underline",
                        textUnderlineOffset: "2px"
                      }}
                    >
                      {proj.url.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div style={{ fontSize: "9.5pt", fontStyle: "italic", marginBottom: "2px" }}>
                    Technologies: {proj.technologies.join(", ")}
                  </div>
                )}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul
                    style={{
                      margin: "3pt 0 0 0",
                      paddingLeft: "16px",
                      listStyleType: "disc"
                    }}
                  >
                    {proj.bullets.map((b, i) => (
                      <li key={i} style={{ marginBottom: "2.5pt", lineHeight: lineHeight, textAlign: "left" }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </section>
        )}

        {/* EDUCATION */}
        {education && education.length > 0 && (
          <section style={{ marginTop: `${sectionSpacingPx}pt`, marginBottom: "6pt" }}>
            <h2
              style={{
                margin: "0 0 5pt 0",
                fontSize: "12pt",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "+0.3pt",
                borderBottom: "1px solid #111111",
                paddingBottom: "2px"
              }}
            >
              Education
            </h2>
            {education.map((edu) => (
              <article
                key={edu.id}
                style={{
                  marginBottom: "6pt",
                  pageBreakInside: "avoid",
                  breakInside: "avoid"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline"
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "10.5pt",
                      fontWeight: 700
                    }}
                  >
                    {edu.institution}
                  </h3>
                  <span style={{ fontSize: "9.5pt", fontWeight: 500 }}>
                    {edu.endDate || ""}
                  </span>
                </div>
                <div style={{ fontSize: "10pt", textAlign: "left" }}>
                  {edu.degree}
                  {edu.field ? `, ${edu.field}` : ""}
                  {(edu.cgpa || edu.gpa) ? ` - CGPA: ${edu.cgpa || edu.gpa}` : ""}
                </div>
              </article>
            ))}
          </section>
        )}

        {/* SKILLS */}
        {skills && skills.length > 0 && (
          <section style={{ marginTop: `${sectionSpacingPx}pt`, marginBottom: "6pt" }}>
            <h2
              style={{
                margin: "0 0 5pt 0",
                fontSize: "12pt",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "+0.3pt",
                borderBottom: "1px solid #111111",
                paddingBottom: "2px"
              }}
            >
              Skills
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5pt", textAlign: "left" }}>
              {skills.map((cat) => (
                <div key={cat.id} style={{ fontSize: "10pt", lineHeight: lineHeight }}>
                  <strong>{cat.name}:</strong> {cat.skills.join(", ")}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certifications && certifications.length > 0 && (
          <section style={{ marginTop: `${sectionSpacingPx}pt`, marginBottom: "6pt" }}>
            <h2
              style={{
                margin: "0 0 5pt 0",
                fontSize: "12pt",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "+0.3pt",
                borderBottom: "1px solid #111111",
                paddingBottom: "2px"
              }}
            >
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div
                key={cert.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10pt",
                  marginBottom: "2.5pt",
                  lineHeight: lineHeight
                }}
              >
                <span>
                  <strong>{cert.name}</strong> - {cert.issuer}
                </span>
                {cert.date && <span>{cert.date}</span>}
              </div>
            ))}
          </section>
        )}
      </main>
        </div>
      </div>
    </div>
  );
};
