// "use client";
// import { useEffect, useState } from "react";
// import { DataTable } from "@/components/ui/DataTable";
// import { columns } from "@/components/ui/columns";
// import fetchPackingRecords from "@/utils/fetchPackingRecords";
// import { PackingRecord } from "@/types/PackingRecord";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import QtyPerPicChart from "@/components/charts/QtyPerPicChart";
// import QtyPerPackChart from "@/components/charts/QtyPerpackChart";
// import ProductivityChart from "@/components/charts/ProductivityChart";
// import RejectRatioChart from "@/components/charts/RejectRatioChart";
// import PackRatioChart from "@/components/charts/PackRatioChart";

// export default function Home() {
//   const [records, setRecords] = useState<PackingRecord[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let isMounted = true;

//     async function fetchData() {
//       try {
//         setIsLoading(true);
//         setError(null);
//         const data = await fetchPackingRecords();
//         if (isMounted) {
//           console.log("Fetched data:", data);
//           setRecords(data || []);
//         }
//       } catch (err) {
//         console.error("Error:", err);
//         if (isMounted) {
//           setError(
//             err instanceof Error ? err.message : "An unexpected error occurred"
//           );
//         }
//       } finally {
//         if (isMounted) {
//           setIsLoading(false);
//         }
//       }
//     }

//     fetchData();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   if (isLoading) {
//     return <div className="p-4">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="p-4 text-red-600">
//         <h2 className="text-lg font-semibold">Error loading data:</h2>
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-6">Packing Records Dashboard</h1>
//       <Link href="/add">
//         <Button className="mb-4">Add Data</Button>
//       </Link>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//         <div className="border rounded-lg p-4">
//           <h2 className="text-lg font-semibold mb-2">
//             Qty Akumulasi per Jam per PIC
//           </h2>
//           <QtyPerPicChart records={records} />
//         </div>
//         <div className="border rounded-lg p-4">
//           <h2 className="text-lg font-semibold mb-2">
//             Qty Akumulasi per Jam per Model Pack
//           </h2>
//           <QtyPerPackChart records={records} />
//         </div>

//         <div className="border rounded-lg p-4 col-span-1 md:col-span-2 lg:col-span-3">
//           <h2 className="text-lg font-semibold mb-2">
//             Produktifitas Kerja per PIC
//           </h2>
//           <ProductivityChart records={records} />
//         </div>

//         <div className="border rounded-lg p-4">
//           <h2 className="text-lg font-semibold mb-2">
//             Ratio Masing-Masing Pack
//           </h2>
//           <PackRatioChart records={records} />
//         </div>
//         <div className="border rounded-lg p-4">
//           <h2 className="text-lg font-semibold mb-2">Ratio Reject vs Berat</h2>
//           <RejectRatioChart records={records} />
//         </div>
//       </div>

//       <DataTable columns={columns} data={records} />
//     </div>
//   );
// }
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import QtyPerPicChart from "@/components/charts/QtyPerPicChart";
import ProductivityChart from "@/components/charts/ProductivityChart";
import RejectRatioChart from "@/components/charts/RejectRatioChart";
import PackRatioChart from "@/components/charts/PackRatioChart";
import { PackingRecord } from "@/types/PackingRecord";
import fetchPackingRecords from "@/utils/fetchPackingRecords";
import CalendarNav from "@/components/CalendarNav";
import QtyPerPackChart from "@/components/charts/QtyPerpackChart";
import { DataTable } from "@/components/ui/DataTable";
import { columns } from "@/components/ui/columns";

export default function Dashboard() {
  const [records, setRecords] = useState<PackingRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filteredRecords, setFilteredRecords] = useState<PackingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPackingRecords();
        if (isMounted) {
          setRecords(data || []);
          filterRecordsByDate(data, selectedDate);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "An unexpected error occurred"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  const filterRecordsByDate = (records: PackingRecord[], date: Date) => {
    const filtered = records.filter((record) => {
      const recordDate = new Date(record.timestamp);
      return recordDate.toDateString() === date.toDateString();
    });
    setFilteredRecords(filtered);
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      filterRecordsByDate(records, date);
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Packing Records Dashboard</h1>
      <div className="flex justify-end">
        <div className="md:col-span-1">
          <CalendarNav
            records={records}
            selectedDate={selectedDate}
            onSelect={handleDateSelect}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 w-full h-[300px]">
          <h2 className="text-lg font-semibold mb-2">Qty per PIC</h2>
          <QtyPerPicChart records={filteredRecords} />
        </div>

        <div className="border rounded-lg p-4 w-full h-[300px]">
          <h2 className="text-lg font-semibold mb-2">Qty per Pack Type</h2>
          <QtyPerPackChart records={filteredRecords} />
        </div>

        <div className="border rounded-lg p-4 w-full h-[300px]">
          <h2 className="text-lg font-semibold mb-2">Productivity per PIC</h2>
          <ProductivityChart records={filteredRecords} />
        </div>

        <div className="border rounded-lg p-4 w-full h-[300px]">
          <h2 className="text-lg font-semibold mb-2">Reject Ratios</h2>
          <RejectRatioChart records={filteredRecords} />
        </div>
        <div className="border rounded-lg p-4 md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Pack Ratios</h2>
          <PackRatioChart records={filteredRecords} />
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="self-end">
          <Link href="/add">
            <Button>Add Data</Button>
          </Link>
        </div>
        <DataTable columns={columns} data={records} />
      </div>
    </div>
  );
}
