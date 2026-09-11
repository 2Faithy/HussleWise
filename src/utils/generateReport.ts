import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Sale, Expense } from '../types';
import { formatNaira } from './currency';

const BRAND_PRIMARY: [number, number, number] = [28, 91, 86];   // #1c5b56
const BRAND_ACCENT: [number, number, number] = [236, 188, 148]; // #ecbc94
const BRAND_INK: [number, number, number] = [14, 27, 26];       // #0e1b1a
const BRAND_BG_TINT: [number, number, number] = [250, 244, 238];
const RED: [number, number, number] = [180, 60, 60];
const GRAY: [number, number, number] = [130, 130, 130];

async function loadImageAsDataURL(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function generateMonthlyReport(
  sales: Sale[],
  expenses: Expense[],
  monthLabel: string,
  businessName: string = 'Your Business',
  logoUrl?: string
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // ---- Header ----
  doc.setFillColor(...BRAND_PRIMARY);
  doc.rect(0, 0, pageWidth, 32, 'F');

  if (logoUrl) {
    try {
      const logoData = await loadImageAsDataURL(logoUrl);
      // Fixed height, width auto-scaled to avoid a stretched logo
      doc.addImage(logoData, 'PNG', 14, 7, 0, 18, undefined, 'FAST');
    } catch {
      // If the logo fails to load, fall back to text so the report
      // still generates instead of throwing.
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Husslewise', 14, 20);
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(businessName, pageWidth - 14, 14, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Monthly Report — ${monthLabel}`, pageWidth - 14, 21, { align: 'right' });

  // ---- Summary cards ----
  const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - totalExpenses;

  let y = 46;
  const cards: [string, string, [number, number, number]][] = [
    ['Money In', formatNaira(totalSales), BRAND_PRIMARY],
    ['Money Out', formatNaira(totalExpenses), RED],
    ['Net Profit', formatNaira(netProfit), netProfit >= 0 ? BRAND_PRIMARY : RED],
  ];

  const cardWidth = (pageWidth - 28 - 12) / 3; // 14mm margins, 6mm gaps
  let x = 14;

  cards.forEach(([label, value, color]) => {
    doc.setFillColor(...BRAND_BG_TINT);
    doc.roundedRect(x, y, cardWidth, 24, 3, 3, 'F');

    // Colored accent bar on the left edge of each card
    doc.setFillColor(...color);
    doc.roundedRect(x, y, 3, 24, 1.5, 1.5, 'F');

    doc.setFontSize(8.5);
    doc.setTextColor(...GRAY);
    doc.setFont('helvetica', 'normal');
    doc.text(label, x + 8, y + 9);

    doc.setFontSize(13);
    doc.setTextColor(...color);
    doc.setFont('helvetica', 'bold');
    doc.text(value, x + 8, y + 18);

    x += cardWidth + 6;
  });

  y += 34;

  // ---- Sales table ----
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_INK);
  doc.setFont('helvetica', 'bold');
  doc.text('Sales — Money In', 14, y);
  doc.setDrawColor(...BRAND_ACCENT);
  doc.setLineWidth(0.6);
  doc.line(14, y + 2, pageWidth - 14, y + 2);

  if (sales.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text('No sales recorded this month.', 14, y + 12);
    y += 20;
  } else {
    autoTable(doc, {
      startY: y + 6,
      head: [['Date', 'Item', 'Category', 'Payment', 'Amount']],
      body: sales.map((s) => [s.date, s.item, s.category, s.paymentMethod, formatNaira(s.amount)]),
      foot: [['', '', '', 'Total', formatNaira(totalSales)]],
      headStyles: { fillColor: BRAND_PRIMARY, textColor: 255, fontSize: 9, cellPadding: 4 },
      bodyStyles: { fontSize: 8.5, textColor: BRAND_INK as unknown as number, cellPadding: 4 },
      footStyles: { fillColor: BRAND_BG_TINT, textColor: BRAND_INK as unknown as number, fontStyle: 'bold', fontSize: 9, cellPadding: 4 },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      columnStyles: { 4: { halign: 'right' } },
      styles: { lineColor: [230, 225, 218], lineWidth: 0.1 },
      margin: { left: 14, right: 14 },
    });
    // @ts-expect-error jspdf-autotable attaches lastAutoTable to doc at runtime
    y = doc.lastAutoTable.finalY + 14;
  }

  // ---- Expenses table ----
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_INK);
  doc.setFont('helvetica', 'bold');
  doc.text('Expenses — Money Out', 14, y);
  doc.setDrawColor(...RED);
  doc.setLineWidth(0.6);
  doc.line(14, y + 2, pageWidth - 14, y + 2);

  if (expenses.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text('No expenses recorded this month.', 14, y + 12);
  } else {
    autoTable(doc, {
      startY: y + 6,
      head: [['Date', 'Type', 'Recurring', 'Amount']],
      body: expenses.map((e) => [e.date, e.type, e.recurring ? 'Yes' : 'No', formatNaira(e.amount)]),
      foot: [['', '', 'Total', formatNaira(totalExpenses)]],
      headStyles: { fillColor: RED, textColor: 255, fontSize: 9, cellPadding: 4 },
      bodyStyles: { fontSize: 8.5, textColor: BRAND_INK as unknown as number, cellPadding: 4 },
      footStyles: { fillColor: BRAND_BG_TINT, textColor: BRAND_INK as unknown as number, fontStyle: 'bold', fontSize: 9, cellPadding: 4 },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      columnStyles: { 3: { halign: 'right' } },
      styles: { lineColor: [230, 225, 218], lineWidth: 0.1 },
      margin: { left: 14, right: 14 },
    });
  }

  // ---- Footer ----
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setDrawColor(...BRAND_ACCENT);
    doc.setLineWidth(0.3);
    doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by Husslewise', 14, pageHeight - 9);
    doc.text(new Date().toLocaleDateString('en-NG'), pageWidth / 2, pageHeight - 9, { align: 'center' });
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 9, { align: 'right' });
  }

  doc.save(`Husslewise-Report-${monthLabel.replace(/\s/g, '-')}.pdf`);
}
