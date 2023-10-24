import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";

import { takeTicket } from "../entities/company";

export function useTakeTicket({ companyId = "", async = "", ticketId = "", operatorId = "", type = "", teamId = "" }) {
    return useQuery(["TakeTicket", type], ({ signal }) => takeTicket({ companyId, ticketId, async, operatorId, teamId, type, signal }), {
        enabled: false,
        manual: true,
        onSuccess: (data) => {
            return data;
        },
        onError: (error) => {
            console.log("error from useTakeTicket", error);
        },
    });
}
