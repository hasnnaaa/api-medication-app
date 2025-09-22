import { ReportModel } from "../models/reportModel.js";

export const ReportController = {
  async getTotalMedications(req, res) {
    try {
      const total = await ReportModel.countTotalMedications();
      res.json(total);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};