import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { getStoredParams } from "../entities/bots";

export function useStoredParams({ botId, userId }) {
    return useQuery(["storedParams", botId, userId], ({ signal }) => getStoredParams({ botId, userId, signal }), {
        enabled: !isEmpty(userId) && !isEmpty(botId),
    });
}
