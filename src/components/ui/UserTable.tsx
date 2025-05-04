import {  useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

type User = {
  email: string;
  picture: string;
  user_id: string;
  name: string;
  last_login: string;
  date_added: string;
};

interface Props {
  data: User[];
  selectedUserIds: Set<string>;
  toggleSelectUser: (userId: string) => void;
}

const UserTable: React.FC<Props> = ({ data, selectedUserIds, toggleSelectUser }) => {
  const columnHelper = createColumnHelper<User>();

  const columns = useMemo(() => [
    columnHelper.display({
      id: "select",
      header: () => null,
      cell: (info) => {
        const userId = info.row.original.user_id;
        return (
          <input
            type="checkbox"
            checked={selectedUserIds.has(userId)}
            onChange={() => toggleSelectUser(userId)}
          />
        );
      },
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue() || "—",
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("picture", {
      header: "Picture",
      cell: (info) => (
        <img
          src={info.getValue()}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
      ),
    }),
    columnHelper.accessor("last_login", {
      header: "Last Login",
      cell: (info) =>
        new Date(info.getValue()).toLocaleDateString("en-AU", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    }),
  ], [selectedUserIds]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white">
        <table className="min-w-full text-sm text-gray-700">
          <thead style={{ backgroundColor: "#F2F7FF" }} className="text-xs uppercase text-gray-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-4 text-left font-semibold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50 transition">
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


export default UserTable;
