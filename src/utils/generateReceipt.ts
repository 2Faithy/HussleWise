import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export async function generateReceiptPDF(element: HTMLElement, receiptNumber: string) {
  const canvas = await html2canvas(element, {
    scale: 2, // sharper output than 1:1
    backgroundColor: '#ffffff',
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');

  const pageWidth = 148; // A5 width in mm
  const margin = 5;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = (canvas.height * contentWidth) / canvas.width;
  const pageHeight = contentHeight + margin * 2;

  const doc = new jsPDF({
    unit: 'mm',
    format: [pageWidth, pageHeight],
  });

  doc.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
  doc.save(`Receipt-${receiptNumber}.pdf`);
}