import { useInfiniteQuery } from "@tanstack/react-query";
import { isNumber } from "lodash";
import { getArchivedRooms } from "../entities/operators";

export function useArchivedRooms(payload) {
    return useInfiniteQuery(["archivedRooms"], ({ pageParam = 1 }) => getArchivedRooms({ payload, pageParam }), {
        enabled: isNumber(payload?.operatorId),
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.pagination?.page < lastPage.pagination?.totalPages) {
                return lastPage.pagination?.page + 1;
            }
            return false;
        },
    });
}
