import { useQuery } from "@tanstack/react-query";
import { isNumber } from "lodash";
import { getTeams } from "../entities/company";

export function useTeams({ companyId, operatorId, limit }) {
    return useQuery(["teams"], ({ signal }) => getTeams({ companyId, operatorId, limit, signal }), {
        enabled: isNumber(companyId),
    });
}
