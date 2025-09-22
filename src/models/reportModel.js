import { supabase } from "../config/supabaseClient.js";

export const ReportModel = {
  async countTotalMedications() {
    const { count, error } = await supabase
      .from("medications")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return { total: count };
  },
};