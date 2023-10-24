import { useQuery } from "@tanstack/react-query";
import { startConversation } from "../entities/conversation";

export function useConversationStart({ botId, userId, operatorId, origin, hasResumeConversations }) {
    return useQuery(
        ["start", botId, userId],
        ({ signal }) => startConversation({ botId, userId, operatorId, origin, hasResumeConversations, signal }),
        {
            enabled: false,
            cacheTime: 0,
        }
    );
}
