// utils/fetchPackingRecords.ts
import { supabase } from "@/lib/supabase";
import { PackingRecord } from "@/types/PackingRecord";
import { PostgrestError } from "@supabase/supabase-js";

async function fetchPackingRecords(): Promise<PackingRecord[]> {
  try {
    // First, let's check if we can connect to Supabase
    const { data: healthCheck, error: healthError } = await supabase
      .from("packing_records")
      .select("count");

    if (healthError && healthCheck) {
      console.error("Supabase connection error:", healthError);
      throw new Error(
        `Failed to connect to Supabase: ${
          (healthError as PostgrestError).message
        }`
      );
    }

    // Now fetch the actual data
    const { data, error } = await supabase
      .from("packing_records")
      .select(
        `
        id,
        timestamp,
        berat_kotor,
        qty_pack_a,
        qty_pack_b,
        qty_pack_c,
        reject_kg,
        pic (
          id,
          name
        )
      `
      )
      .order("timestamp", { ascending: true });

    if (error) {
      console.error("Error fetching data:", error);
      throw new Error(`Failed to fetch data: ${error.message}`);
    }

    if (!data) {
      console.error("No data returned from Supabase");
      throw new Error("No data returned from Supabase");
    }

    console.log("Fetched records:", data); // Debug log
    return data as unknown as PackingRecord[];
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
}

export default fetchPackingRecords;
