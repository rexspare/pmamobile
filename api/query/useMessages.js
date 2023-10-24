import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { getRoomMessages } from "../entities/rooms";
import { getUserHistory } from "../entities/bots";

export function useMessages({ roomId, limit, events, direction, _id, limitUp, limitBottom }) {
    return useQuery(["messages", roomId], ({ signal }) => getRoomMessages({ roomId, limit, events, direction, _id, limitUp, limitBottom, signal }), {
        enabled: !isEmpty(roomId),
    });
}

export function useArchivedMessages({ botId, userId, limit, events, direction, _id, includeEvents }) {
    return useQuery(
        ["archivedMessages", botId, userId],
        ({ signal }) => getUserHistory({ botId, userId, limit, events, direction, _id, includeEvents, signal }),
        {
            // enabled: !isEmpty(botId) && !isEmpty(userId),
            enabled: false,
        }
    );
}
