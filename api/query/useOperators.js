import { useQuery } from "@tanstack/react-query";
import { getOperators } from "../entities/operators";
import { isEmpty } from "lodash";
import { useSelector } from "react-redux";

export function useOperators({ active, status, byScope, teams, parseOperators = false }) {
    const userSession = useSelector((state) => state.userSession);
    return useQuery(["operators"], () => getOperators({ active, status, byScope, teams }), {
        cacheTime: 0,
        select: (data) => {
            if (parseOperators) {
                let operators = [];
                let operatorTeam = "";
                data.forEach((operator) => {
                    if (!isEmpty(operator.team)) {
                        let _team = operator.team;
                        _team = _team.replace(",", " - ");
                        operatorTeam = `${_team}`;
                    } else {
                        operatorTeam = " - ";
                    }
                    if (operator.providerId !== userSession.providerId) {
                        operators.push({
                            value: `${operator.providerId}`,
                            label: `${operator.names}`,
                            teamText: `${operatorTeam}`,
                            ...operator,
                        });
                    }
                });
                return operators;
            }
            return data;
        },
    });
}
