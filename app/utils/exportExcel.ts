import * as XLSX from "xlsx";

type Column = {
  key: string;
  label: string;
};

type ExportToExcelProps<T extends Record<string, unknown>> = {
  data: T[];
  columns: Column[];
  filename?: string;
};

export function exportToExcel<T extends Record<string, unknown>>({
  data,
  columns,
  filename = "export.xlsx",
}: ExportToExcelProps<T>) {
  const exportData = data.map((item) => {
    const row: Record<string, unknown> = {};
    columns.forEach((col) => {
      row[col.label] = (item as Record<string, unknown>)[col.key];
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, filename);
}
