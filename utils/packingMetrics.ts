import { PackingRecord } from "@/types/PackingRecord";

export function calculateQtyPerPicPerHour(records: PackingRecord[]) {
  // Create a map to store quantities for each hour and PIC
  const hourMap = new Map();

  // Process each record
  records.forEach((record) => {
    const hour = new Date(record.timestamp).getHours().toString();
    const totalQty = record.qty_pack_a + record.qty_pack_b + record.qty_pack_c;

    if (!hourMap.has(hour)) {
      hourMap.set(hour, {
        name: hour,
        Andri: 0,
        Indra: 0,
        Indri: 0,
      });
    }

    const hourData = hourMap.get(hour);
    hourData[record.pic.name] += totalQty;
  });

  // Convert map to array and sort by hour
  return Array.from(hourMap.values()).sort(
    (a, b) => parseInt(a.name) - parseInt(b.name)
  );
}

export function calculateQtyPerPackPerHour(records: PackingRecord[]) {
  const result: { name: string; hour: string; qty: number }[] = [];
  const packTypes = ["Pack A", "Pack B", "Pack C"];

  for (const record of records) {
    const hour = new Date(record.timestamp).getHours().toString();
    const quantities = [
      record.qty_pack_a,
      record.qty_pack_b,
      record.qty_pack_c,
    ];

    for (let i = 0; i < packTypes.length; i++) {
      const packType = packTypes[i];
      const qty = quantities[i];

      const existingEntry = result.find(
        (entry) => entry.name === packType && entry.hour === hour
      );
      if (existingEntry) {
        existingEntry.qty += qty;
      } else {
        result.push({ name: packType, hour, qty });
      }
    }
  }
  return result;
}

export function calculateProductivityPerPic(records: PackingRecord[]) {
  const result: {
    pic: string;
    productivityPerHour: number;
    productivityPerDay: number;
  }[] = [];

  for (const record of records) {
    const pic = record.pic.name;
    const totalQty = record.qty_pack_a + record.qty_pack_b + record.qty_pack_c;

    const existingEntry = result.find((entry) => entry.pic === pic);
    if (existingEntry) {
      existingEntry.productivityPerHour += totalQty / 60;
      existingEntry.productivityPerDay += totalQty / 600;
    } else {
      result.push({
        pic,
        productivityPerHour: totalQty / 60,
        productivityPerDay: totalQty / 600,
      });
    }
  }

  return result.map((entry) => ({
    ...entry,
    productivityPerHour: parseFloat(entry.productivityPerHour.toFixed(2)),
    productivityPerDay: parseFloat(entry.productivityPerDay.toFixed(2)),
  }));
}

export function calculateRejectRatio(records: PackingRecord[]): number {
  const totalBeratKotor = records.reduce(
    (sum, record) => sum + record.berat_kotor,
    0
  );
  const totalReject = records.reduce(
    (sum, record) => sum + record.reject_kg,
    0
  );

  return totalBeratKotor > 0
    ? parseFloat(((totalReject / totalBeratKotor) * 100).toFixed(2))
    : 0;
}

export function calculatePackRatios(records: PackingRecord[]) {
  const totals = records.reduce(
    (acc, record) => {
      acc.a += record.qty_pack_a;
      acc.b += record.qty_pack_b;
      acc.c += record.qty_pack_c;
      return acc;
    },
    { a: 0, b: 0, c: 0 }
  );

  const totalQty = totals.a + totals.b + totals.c;

  return [
    {
      name: "Pack A",
      value:
        totalQty > 0 ? parseFloat(((totals.a / totalQty) * 100).toFixed(2)) : 0,
    },
    {
      name: "Pack B",
      value:
        totalQty > 0 ? parseFloat(((totals.b / totalQty) * 100).toFixed(2)) : 0,
    },
    {
      name: "Pack C",
      value:
        totalQty > 0 ? parseFloat(((totals.c / totalQty) * 100).toFixed(2)) : 0,
    },
  ];
}
