import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// COLORS (optional: match your chart colors if needed)
const COLORS = [
  "#4ade80", "#60a5fa", "#f59e0b", "#6366f1", "#ef4444", "#3b82f6", "#10b981", "#a78bfa"
];

const exportPDF = (data) => {
  const doc = new jsPDF();
  let finalY = 10;

  const drawTable = (title, columns, rows) => {
    doc.setFontSize(14);
    doc.text(title, 14, finalY + 6);
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: finalY + 10,
      theme: "striped",
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        finalY = data.cursor.y + 10;
      },
    });
  };

  drawTable(
    " Problemas por Dificultad",
    ["Dificultad", "Total"],
    data.problemas_por_dificultad.map(d => [d.dificultad, d.total])
  );

  drawTable(
    "Distribución de Lenguajes",
    ["Lenguaje", "Total"],
    data.problemas_por_lenguaje.map(d => [d.lenguaje, d.total])
  );

  drawTable(
    " Feedback por Día",
    ["Día", "Total"],
    data.feedback_por_dia.map(d => [d.day, d.total])
  );

  drawTable(
    " Monitorías por Modalidad",
    ["Modalidad", "Total"],
    data.monitorias_por_modalidad.map(d => [d.modalidad, d.total])
  );

  drawTable(
    "Problemas por Tema",
    ["Tema", "Total"],
    data.problemas_por_tema.map(d => [d.tema, d.total])
  );

  drawTable(
    "Top Estudiantes (Problemas Resueltos)",
    ["Estudiante", "Total"],
    data.resueltos_por_estudiante.map(d => [d.estudiante__nombre_completo, d.total])
  );

  drawTable(
    "Monitorías por Tema",
    ["Tema", "Total"],
    data.monitorias_por_tema.map(d => [d.tema, d.total])
  );

  drawTable(
    "Dificultad Predominante de Estudiantes",
    ["Dificultad", "Total"],
    data.dificultad_predominante.map(d => [d.dificultad_predominante, d.total])
  );

  doc.save("reporte_sinucode.pdf");
};

export default exportPDF;
