import { useQuery } from "@tanstack/react-query";
import { isNumber } from "lodash";
import { getMacroTemplates } from "../entities/company";

export function useMacroTemplates({ companyId = "", teams = [], bots = [], shoulPaginate = false, joinMacros = false, isVisible }) {
    return useQuery(
        ["macroTemplates", companyId],
        ({ signal }) => getMacroTemplates({ companyId, teams, bots, shoulPaginate, joinMacros, isVisible, signal }),
        {
            enabled: isNumber(companyId),
            select: (data) => {
                const { results } = data;
                return results;
            },
        }
    );
}
