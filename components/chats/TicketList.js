import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import get from "lodash/get";
import includes from "lodash/includes";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import first from "lodash/first";
import colors from "../../constants/colors";
import DownIcon from "../icons/DownIcon";
import { useTickets } from "../../api/query/useTickets";
import { useTakeTicket } from "../../api/query/useTakeTicket";
import TicketModal from "../modals/TicketModal";
import ToastQueue from ".././common/ToastQueue";

const TicketList = () => {
    const queues = useSelector((state) => state.queues);
    const company = useSelector((state) => state.company);
    const userSession = useSelector((state) => state.userSession);
    const teams = useSelector((state) => state.teams);
    const bottomSheetTicketModalRef = useRef(null);
    const [teamsList, setTeamsList] = useState([]);
    const [userTeams, setUserTeams] = useState([]);
    const [selectedQueue, setSelectedQueue] = useState({});
    const [teamIdSelecetedQueue, setTeamIdSelecetedQueue] = useState("");

    const [currentQueueByTeam, setCurrentQueueByTeam] = useState([]);
    const companyId = get(company, "id", "");
    const [isToastVisible, setIsToastVisible] = useState(false);

    const { refetch: takeFromQueue } = useTakeTicket({ companyId, teamId: teamIdSelecetedQueue });
    useTickets({ companyId });

    const handleAtenderClick = () => {
        takeFromQueue();
        setIsToastVisible(true);
        setTimeout(() => {
            setIsToastVisible(false);
        }, 3000);
    };
    useEffect(() => {
        if (isEmpty(queues)) return;
        const chatQueues = queues.filter((queue) => queue.type !== "reply");
        const currentQueueByTeam = chatQueues.filter((item) => item?.team?.id === teamIdSelecetedQueue);
        setCurrentQueueByTeam(currentQueueByTeam);
    }, [queues, teamIdSelecetedQueue]);

    useEffect(() => {
        if (!isEmpty(teams) && !isEmpty(userSession)) {
            setUserTeams(teams.filter((item) => includes(userSession.teams, item.id)));
        }
    }, [teams, userSession]);

    useEffect(() => {
        if (!isEmpty(userTeams)) {
            const _selectedQueue = first(userTeams.filter((item) => item.name === selectedQueue?.value));
            setTeamIdSelecetedQueue(_selectedQueue?.id);
        }
    }, [userTeams, selectedQueue]);

    function getTotal(name) {
        const chatQueues = queues.filter((queue) => queue.type !== "reply");
        const total = chatQueues.filter((ticket) => ticket.queue === name);
        return total.length || 0;
    }

    useEffect(() => {
        if (!isEmpty(userTeams)) {
            const teamsList = userTeams.map((item) => ({
                label: `${item.name} - ${getTotal(item.name)}`,
                total: getTotal(item.name),
                value: item.name,
            }));
            setTeamsList(teamsList);
        }
    }, [userTeams, queues]);

    return (
        <View style={styles.container}>
            <Pressable style={styles.containerSelector} onPress={() => bottomSheetTicketModalRef.current?.present()}>
                <DownIcon style={styles.downIcon} />
                <Text style={styles.ticketText}>{get(selectedQueue, "value", "General")}</Text>
                <View style={{ flexDirection: "row", backgroundColor: colors.primary[500], borderRadius: 25 }}>
                    <Text style={styles.text}>{getTotal(get(selectedQueue, "value", "General"))}</Text>
                </View>
            </Pressable>
            {!isEmpty(currentQueueByTeam) && (
                <Pressable
                    style={styles.attendButton}
                    onPress={handleAtenderClick}>
                    <Text style={styles.attendText}>Atender</Text>
                </Pressable>
            )}
            <TicketModal bottomSheetModalRef={bottomSheetTicketModalRef} teamsList={teamsList} setSelectedQueue={setSelectedQueue} />
            
            {isToastVisible && (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    {currentQueueByTeam.map((queueItem) => (
                        <ToastQueue key={queueItem._id} itemName={queueItem.user.names} />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        color: colors.primary[500],
        marginVertical: 10,
        backgroundColor: colors.primary[100],
        paddingHorizontal: 10,
        paddingVertical: 6,
        alignItems: "center",
        justifyContent: "space-between",
    },
    containerSelector: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    downIcon: {
        width: 26,
        height: 26,
    },
    text: { color: colors.white, fontSize: 16, fontWeight: "500", paddingHorizontal: 4 },
    attendButton: {
        backgroundColor: colors.primary[500],
        color: colors.white,
        alignSelf: "flex-end",
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 50,
    },
    attendText: { color: colors.white, fontSize: 16, fontWeight: "500" },
    ticketText: {
        fontSize: 20,
        fontWeight: "500",
        color: colors.primary[500],
        paddingHorizontal: 8,
    },
});

export default TicketList;
