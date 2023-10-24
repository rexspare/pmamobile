import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { getRoom } from "../entities/rooms";

export function useRoomInfo({ roomId = "", userId = "", shouldPaginate = false, addConversations = "", read = "" }) {
    return useQuery(["rooms", roomId], ({ signal }) => getRoom({ roomId, userId, shouldPaginate, addConversations, read, signal }), {
        enabled: !isEmpty(roomId),
    });
}
