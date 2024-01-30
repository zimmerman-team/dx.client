export interface DataThemesDataTableProps {
  data: { [key: string]: number | string | null }[];
  stats: {
    name: string;
    type: "percentage" | "bar" | "unique";
    data: { name: string; value: number }[];
  }[];
}
