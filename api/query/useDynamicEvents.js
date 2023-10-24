import { useQuery } from "@tanstack/react-query";
import { isNumber } from "lodash";
import { getMotives } from "../entities/dynamicEvents";

export function useDynamicEvents({ companyId = "", type = "" }) {
    return useQuery(["motives"], ({ signal }) => getMotives({ companyId, type, signal }), {
        enabled: isNumber(companyId),
    });
}
