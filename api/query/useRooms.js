import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { getRooms } from "../entities/rooms";

export function useRooms({ userId, shouldPaginate, addConversations, type }) {
    return useQuery(["rooms", type], ({ signal }) => getRooms({ userId, shouldPaginate, addConversations, type, signal }), {
        enabled: !isEmpty(userId),
        select: (data) => {
            let rooms = data.filter((room) => room.type !== "reply" && room.type !== "ticket" && room.kind !== "group");

            return rooms;
        },
    });
}
