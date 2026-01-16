export interface TemplateConfig {
  id: string;
  name: string;
  uploadedAt: string;
  workbook: any;
  labels: LabelConfig;
  globalRows: GlobalDataRow[];
  itemDataCell: string;
  itemQRCell: string;
  lotDataCell: string;
  lotQRCell: string;
  qtyDataCell: string;
  qtyQRCell: string;
  systems: SystemConfig[];
}

export interface TemplateOption {
  id: string;
  name: string;
}

export interface LabelConfig {
  itemDataLabel: string;
  itemQRLabel: string;
  lotDataLabel: string;
  lotQRLabel: string;
  qtyDataLabel: string;
  qtyQRLabel: string;
}

export interface GlobalDataRow {
  id: string;
  itemDataLabel?: string;
  itemDataCell?: string;
  itemQRCell?: string;
}

export interface SystemConfig {
  id: string;
  name: string;
  fields: { label: string; cell: string }[];
  dataRows: DataField[];
  isVisible?: boolean;
}

export interface DataField {
  id: string;
  itemDataCell: string;
  itemQRCell: string;
  itemDataLabel?: string;
  itemQRLabel?: string;
  type?: "BAG" | "BOX" | "MATCHING";
}

export interface DataRow {
  id: string;
  orderNo: string;
  itemCode: string;
  externalLot: string;
  materialCode: string;
  internalLot: string;
  qty: string;
}
