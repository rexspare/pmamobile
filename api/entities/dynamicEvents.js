import { get } from "lodash";
import DashboardServer from "../DashboardServer";

export async function getMotives({ companyId = "", type = "", signal }) {
    const { data } = await DashboardServer.get(`/dynamic_events/company/${companyId}`, {
        params: {
            ...(type && { type }),
        },
        signal,
    }).catch((error) => {
        console.log(error);
    });
    const results = get(data, "data.results", []);
    return results;
}
