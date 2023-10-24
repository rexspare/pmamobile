import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { addQueues } from "../../reducers/queues";

import { getTickets } from "../entities/company";

export function useTickets({ companyId = "", shoulPaginate = false, state = "in_queue", type = "" }) {
    const dispatch = useDispatch();
    return useQuery(["tickets"], ({ signal }) => getTickets({ companyId, shoulPaginate, state, type }), {
        enabled: Boolean(companyId),
        onSuccess: (data) => {
            dispatch(addQueues(data));
            return data;
        },
        onError: (error) => {
            console.log("error from useTickets", error);
        },
    });
}
