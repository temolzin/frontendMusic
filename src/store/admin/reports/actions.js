import { api } from "boot/axios";

export const fetchReportsEarnings = async ({ commit }, { period, from, to }) => {
    await api.get("/api/admin/reports/earnings", {
        params: { period, from: from || undefined, to: to || undefined },
    }).then((response) => {
        commit("setReportData", response.data.data);
    });
};
