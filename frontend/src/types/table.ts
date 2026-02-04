import type { ReactNode } from "react";

export type TableColumn =
  | {
      header: string;
      accessor: string;
    }
  | {
      header: string;
      render: (row: Record<string, any>) => ReactNode;
    };

