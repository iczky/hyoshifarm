export type PackingRecord = {
  id: number;
  timestamp: string;
  pic: {
    id: number;
    name: string;
  };
  berat_kotor: number;
  qty_pack_a: number;
  qty_pack_b: number;
  qty_pack_c: number;
  reject_kg: number;
};
