import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";

const columnHelper = createColumnHelper<Project>();

type Project = {
  name: string;
  project_key: string;
  description: string;
  project_id: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  role_id: number;
};

interface Props {
  data: Project[];
}

const ProjectTable: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Project Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("project_key", {
        header: "Key",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("created_by", {
        header: "Created By",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("created_at", {
        header: "Created At",
        cell: (info) =>
          new Date(info.getValue()).toLocaleString("en-AU", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      {/* <h2 className="text-center text-xl font-semibold mb-6 text-[#1868DB]">
        Your Projects
      </h2> */}
      <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left font-semibold"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() =>
                  navigate({
                    to: "/project/$projectId",
                    params: { projectId: row.original.project_id.toString() },
                  })
                }
                className="hover:bg-blue-50 cursor-pointer transition"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;
