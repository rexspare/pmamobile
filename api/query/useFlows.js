import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { getFlows } from "../entities/bots";

export function useFlows({ botId = "" }) {
    return useQuery(["flows", botId], ({ signal }) => getFlows({ botId, signal }), {
        enabled: !isEmpty(botId),
        select: (data) => {
            const flows = data.results.map((flow) => {
                return {
                    ...flow,
                    value: flow.id,
                    label: flow.title,
                    botId: botId,
                };
            });
            return flows;
        },
    });
}
