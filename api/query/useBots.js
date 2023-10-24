import { useQuery } from "@tanstack/react-query";
import { isNumber } from "lodash";
import { getBots } from "../entities/company";

export function useBots({ companyId }) {
    return useQuery(["bots"], ({ signal }) => getBots({ companyId, signal }), {
        enabled: isNumber(companyId),
    });
}
