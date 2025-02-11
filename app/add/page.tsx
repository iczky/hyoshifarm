// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";

// export default function AddRecord() {
//   const router = useRouter();
//   const [pics, setPics] = useState<{ id: number; name: string }[]>([]);
//   const [form, setForm] = useState({
//     timestamp: new Date().toISOString(),
//     pic_id: "",
//     qty_pack_a: "",
//     qty_pack_b: "",
//     qty_pack_c: "",
//     reject_kg: "",
//   });

//   // Fetch PIC list
//   useEffect(() => {
//     async function fetchPICs() {
//       const { data, error } = await supabase.from("pic").select("id, name");
//       if (error) console.error("Error fetching PICs:", error);
//       else setPics(data || []);
//     }
//     fetchPICs();
//   }, []);

//   // Handle form change
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Handle form submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Parse numeric values from the form
//     const qtyPackA = parseFloat(form.qty_pack_a) || 0;
//     const qtyPackB = parseFloat(form.qty_pack_b) || 0;
//     const qtyPackC = parseFloat(form.qty_pack_c) || 0;
//     const rejectKg = parseFloat(form.reject_kg) || 0;

//     // Validate inputs
//     if (
//       isNaN(qtyPackA) ||
//       isNaN(qtyPackB) ||
//       isNaN(qtyPackC) ||
//       isNaN(rejectKg)
//     ) {
//       alert("Please enter valid numbers for all fields.");
//       return;
//     }

//     // Calculate Berat Kotor
//     const beratKotor =
//       qtyPackA * 0.2 + // Pack A
//       qtyPackB * 0.3 + // Pack B
//       qtyPackC * 0.4 + // Pack C
//       rejectKg; // Reject

//     // Prepare the record to insert
//     const record = {
//       timestamp: form.timestamp,
//       pic_id: form.pic_id,
//       berat_kotor: beratKotor.toFixed(2), // Round to 2 decimal places
//       qty_pack_a: qtyPackA,
//       qty_pack_b: qtyPackB,
//       qty_pack_c: qtyPackC,
//       reject_kg: rejectKg,
//     };

//     // Insert the record into the database
//     const { error } = await supabase.from("packing_records").insert([record]);
//     if (error) {
//       console.error("Error inserting data:", error);
//     } else {
//       router.push("/"); // Redirect to home after submission
//     }
//   };

//   return (
//     <div className="p-4 max-w-lg mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Add Packing Record</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* PIC Dropdown */}
//         <div>
//           <label className="block mb-2">PIC:</label>
//           <Select
//             name="pic_id"
//             value={form.pic_id}
//             onValueChange={(value) => setForm({ ...form, pic_id: value })}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select PIC" />
//             </SelectTrigger>
//             <SelectContent>
//               {pics.map((pic) => (
//                 <SelectItem key={pic.id} value={pic.id.toString()}>
//                   {pic.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Input Fields */}
//         {[
//           { label: "Qty Pack A", name: "qty_pack_a" },
//           { label: "Qty Pack B", name: "qty_pack_b" },
//           { label: "Qty Pack C", name: "qty_pack_c" },
//           { label: "Reject (kg)", name: "reject_kg" },
//         ].map(({ label, name }) => (
//           <div key={name}>
//             <label className="block mb-2">{label}:</label>
//             <Input
//               type="number"
//               name={name}
//               value={form[name as keyof typeof form]}
//               onChange={handleChange}
//             />
//           </div>
//         ))}

//         {/* Submit Button */}
//         <Button type="submit" className="w-full">
//           Submit
//         </Button>
//       </form>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { PackingRecord } from "@/types/PackingRecord";

type FormInputs = Omit<PackingRecord, "id" | "pic"> & {
  pic_id: string;
};

export default function AddRecord() {
  const router = useRouter();
  const [pics, setPics] = useState<{ id: number; name: string }[]>([]);
  console.log("pics", pics);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      timestamp: new Date().toISOString().split("T")[0],
      pic_id: "",
      qty_pack_a: 0,
      qty_pack_b: 0,
      qty_pack_c: 0,
      reject_kg: 0,
      berat_kotor: 0,
    },
  });

  useEffect(() => {
    async function fetchPICs() {
      const { data, error } = await supabase.from("pic").select("id, name");
      if (error) {
        console.error("Error fetching PICs:", error);
        return;
      }
      setPics(data || []);
    }
    fetchPICs();
  }, []);

  const calculateBeratKotor = (data: Partial<FormInputs>) => {
    return (
      (data.qty_pack_a || 0) * 0.2 +
      (data.qty_pack_b || 0) * 0.3 +
      (data.qty_pack_c || 0) * 0.4 +
      (data.reject_kg || 0)
    );
  };

  const onSubmit = async (data: FormInputs) => {
    const berat_kotor = calculateBeratKotor(data);

    const record = {
      timestamp: data.timestamp,
      pic_id: data.pic_id,
      berat_kotor,
      qty_pack_a: data.qty_pack_a,
      qty_pack_b: data.qty_pack_b,
      qty_pack_c: data.qty_pack_c,
      reject_kg: data.reject_kg,
    };

    const { error } = await supabase.from("packing_records").insert([record]);

    if (error) {
      console.error("Error inserting record:", error);
      return;
    }

    router.push("/");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Packing Record</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-2">Date:</label>
          <Input
            type="datetime-local"
            {...register("timestamp", { required: "Date is required" })}
          />
          {errors.timestamp && (
            <p className="text-red-500 text-sm">{errors.timestamp.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">PIC:</label>
          <Select onValueChange={(value) => setValue("pic_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select PIC" />
            </SelectTrigger>
            <SelectContent>
              {pics.map((pic) => (
                <SelectItem key={pic.id} value={pic.id.toString()}>
                  {pic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.pic_id && (
            <p className="text-red-500 text-sm">{errors.pic_id.message}</p>
          )}
        </div>

        {[
          { label: "Qty Pack A", name: "qty_pack_a" },
          { label: "Qty Pack B", name: "qty_pack_b" },
          { label: "Qty Pack C", name: "qty_pack_c" },
          { label: "Reject (kg)", name: "reject_kg" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block mb-2">{label}:</label>
            <Input
              type="number"
              step="0.01"
              {...register(name as keyof FormInputs, {
                required: `${label} is required`,
                min: { value: 0, message: "Value must be positive" },
                valueAsNumber: true,
              })}
            />
            {errors[name as keyof FormInputs] && (
              <p className="text-red-500 text-sm">
                {errors[name as keyof FormInputs]?.message}
              </p>
            )}
          </div>
        ))}

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
