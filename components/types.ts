export interface DataField {
  id: string;
  itemDataCell: string;
  itemQRCell: string;
  itemDataLabel?: string;
  itemQRLabel?: string;
}

export interface SystemConfig {
  id: string;
  name: string;
  fields: { label: string; cell: string }[];
  dataRows: DataField[];
  isVisible?: boolean;
}

export interface LabelConfig {
  itemDataLabel: string;
  itemQRLabel: string;
  lotDataLabel: string;
  lotQRLabel: string;
  qtyDataLabel: string;
  qtyQRLabel: string;
}
