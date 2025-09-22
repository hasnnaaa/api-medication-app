import { supabase } from "../config/supabaseClient.js";

export const MedicationModel = {
  async getAll(searchName, page = 1, limit = 10) {
    
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const from = (pageInt -1) * limitInt;
    const to = from + limitInt - 1;

    let query = supabase.from("medications").select(
        "id, sku, name, description, price, quantity, category_id, supplier_id",
        { count: "exact" }
    );

    if (searchName) {
      query = query.ilike("name", `%${searchName}%`);
    }

    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limitInt),
      currentPage: pageInt,
      limit: limitInt,
      data: data,
    };
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("medications")
      .select(
        `
        id, sku, name, description, price, quantity,
        categories ( id, name ),
        suppliers ( id, name, email, phone ),
      `
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { quantity, price } = payload;
    if (quantity < 0 || price < 0) {
      const error = new Error("Quantity and price must not be less than 0");
      error.statusCose = 400;
      throw error;
    }

    const { data, error } = await supabase
      .from("medications")
      .insert([payload])
      .select();
    if (error) throw error;
    return data[0];
  },

  async update(id, payload) {
    const { quantity, price } = payload;
    if ((quantity !== undefined && quantity < 0) || (price !== undefined && price < 0)) {
      const error = new Error("Quantity and price must not be less than 0");
      error.statusCode = 400;
      throw error;
    }

    const { data, error } = await supabase
      .from("medications")
      .update(payload)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async remove(id) {
    const { error } = await supabase.from("medications").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  },
};