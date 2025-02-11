import { ColumnDef } from "@tanstack/react-table";
import { PackingRecord } from "@/types/PackingRecord";
import { Button } from "./button";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<PackingRecord>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Timestamp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timestamp = new Date(row.original.timestamp).toLocaleString(
        "en-GB",
        { timeZone: "Asia/Jakarta", hour12: false }
      );
      return <div>{timestamp}</div>;
    },
  },
  {
    accessorKey: "pic.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          PIC
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.original.pic.name}</div>,
  },
  {
    accessorKey: "berat_kotor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Berat Kotor Kg
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("berat_kotor")}</div>,
  },
  {
    accessorKey: "qty_pack_a",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Pack A
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("qty_pack_a")}</div>,
  },
  {
    accessorKey: "qty_pack_b",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Pack B
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("qty_pack_b")}</div>,
  },
  {
    accessorKey: "qty_pack_c",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Pack C
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("qty_pack_c")}</div>,
  },
  {
    accessorKey: "reject_kg",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Reject Kg
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("reject_kg")}</div>,
  },
];
