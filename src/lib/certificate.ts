import jsPDF from "jspdf";

export interface CertificateData {
  recipientName: string;
  /** "Volunteer", "Donor", "Partner Organization" — appears on the body */
  recipientRole: string;
  eventTitle?: string;
  ngoName?: string;
  description: string;
  certificateId: string;
  issuedAt: Date;
}

/**
 * Generates a formal landscape "Certificate of Recognition" PDF using jsPDF
 * (no backend required) and triggers a browser download.
 */
export function downloadCertificate(data: CertificateData) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const W = doc.internal.pageSize.getWidth();   // 842
  const H = doc.internal.pageSize.getHeight();  // 595

  // Palette — cohesive with the app's deep emerald + warm parchment theme
  const cream: [number, number, number] = [251, 248, 240];
  const ink: [number, number, number] = [27, 38, 33];
  const emerald: [number, number, number] = [37, 99, 79];
  const emeraldDeep: [number, number, number] = [21, 60, 49];
  const gold: [number, number, number] = [176, 137, 73];
  const muted: [number, number, number] = [110, 110, 105];

  // Background
  doc.setFillColor(...cream);
  doc.rect(0, 0, W, H, "F");

  // Outer double-line border
  doc.setDrawColor(...emeraldDeep);
  doc.setLineWidth(2);
  doc.rect(28, 28, W - 56, H - 56);
  doc.setLineWidth(0.6);
  doc.rect(36, 36, W - 72, H - 72);

  // Decorative corner motifs (small filled squares offset by lines)
  const corner = (x: number, y: number, dx: number, dy: number) => {
    doc.setFillColor(...gold);
    doc.rect(x, y, 6, 6, "F");
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.8);
    doc.line(x + dx * 18, y + 3, x + dx * 60, y + 3);
    doc.line(x + 3, y + dy * 18, x + 3, y + dy * 60);
  };
  corner(46, 46, 1, 1);
  corner(W - 52, 46, -1, 1);
  corner(46, H - 52, 1, -1);
  corner(W - 52, H - 52, -1, -1);

  // Top emblem mark
  doc.setFillColor(...emerald);
  doc.circle(W / 2, 92, 22, "F");
  doc.setTextColor(...cream);
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text("C", W / 2, 100, { align: "center" });

  // Brand line under emblem
  doc.setTextColor(...emeraldDeep);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("COHERE  ·  IMPACT HUB", W / 2, 132, { align: "center" });

  // Heading
  doc.setFont("times", "bold");
  doc.setTextColor(...ink);
  doc.setFontSize(40);
  doc.text("Certificate of Recognition", W / 2, 188, { align: "center" });

  // Gold underline
  doc.setDrawColor(...gold);
  doc.setLineWidth(1.2);
  doc.line(W / 2 - 130, 200, W / 2 + 130, 200);

  // "This is to certify that"
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...muted);
  doc.setFontSize(13);
  doc.text("This certificate is proudly presented to", W / 2, 232, { align: "center" });

  // Recipient name
  doc.setFont("times", "bolditalic");
  doc.setTextColor(...emeraldDeep);
  doc.setFontSize(46);
  doc.text(data.recipientName, W / 2, 290, { align: "center" });

  // Underline below name
  doc.setDrawColor(...emeraldDeep);
  doc.setLineWidth(0.6);
  doc.line(W / 2 - 200, 305, W / 2 + 200, 305);

  // "in recognition of" + role
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...ink);
  doc.setFontSize(13);
  doc.text(
    `in recognition of outstanding contribution as a ${data.recipientRole}`,
    W / 2,
    332,
    { align: "center" }
  );

  // Event title (if provided)
  if (data.eventTitle) {
    doc.setFont("times", "italic");
    doc.setFontSize(20);
    doc.setTextColor(...emerald);
    doc.text(`"${data.eventTitle}"`, W / 2, 368, { align: "center" });
  }

  // Description (wrapped)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...muted);
  const descY = data.eventTitle ? 396 : 372;
  const wrapped = doc.splitTextToSize(data.description, W - 220);
  doc.text(wrapped, W / 2, descY, { align: "center" });

  // Hosted by line
  if (data.ngoName) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...emeraldDeep);
    doc.text(`Hosted by ${data.ngoName}`, W / 2, descY + 36, { align: "center" });
  }

  // Footer signatures
  const sigY = H - 110;
  doc.setDrawColor(...ink);
  doc.setLineWidth(0.6);
  doc.line(110, sigY, 290, sigY);
  doc.line(W - 290, sigY, W - 110, sigY);

  doc.setFont("times", "italic");
  doc.setFontSize(13);
  doc.setTextColor(...emeraldDeep);
  doc.text("Cohere Verification", 200, sigY - 6, { align: "center" });
  doc.text(data.ngoName || "Cohere Platform", W - 200, sigY - 6, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text("Authorized Signatory", 200, sigY + 14, { align: "center" });
  doc.text("Issuing Organization", W - 200, sigY + 14, { align: "center" });

  // Seal — concentric circles + text
  const seal = { x: W / 2, y: sigY - 8, r: 38 };
  doc.setDrawColor(...gold);
  doc.setLineWidth(1.5);
  doc.circle(seal.x, seal.y, seal.r);
  doc.setLineWidth(0.6);
  doc.circle(seal.x, seal.y, seal.r - 5);
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...gold);
  doc.text("VERIFIED", seal.x, seal.y - 4, { align: "center" });
  doc.setFontSize(7);
  doc.setTextColor(...emeraldDeep);
  doc.text("COHERE · IMPACT", seal.x, seal.y + 8, { align: "center" });

  // Bottom meta
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text(`Certificate ID: ${data.certificateId}`, 60, H - 50);
  doc.text(`Issued: ${data.issuedAt.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}`, W - 60, H - 50, { align: "right" });

  const safeName = data.recipientName.replace(/[^a-z0-9]+/gi, "_");
  doc.save(`Cohere_Certificate_${safeName}_${data.certificateId}.pdf`);
}
