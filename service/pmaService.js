import JelouApiV1 from "../api/JelouApiV1";
import { ROOM_TYPES } from "../constants/constants";
import { parseRoom } from "../utils/helpers";
import Channel from "./channel";
import defaults from "lodash/defaults";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { getRooms } from "../api/entities/rooms";

class PmaService {
    /**
     * Instantiate provider base on settings
     * Currently there are only two providers supported ( Talktolk, Pusher Chatkit )
     * @param {object} settings
     * @param {object} settings.credentials - Provider credentials
     * @param {string} settings.credentials.userId
     * @param {object} settings.credentials.providerId
     * @param {object} settings.companyId
     */
    constructor(settings) {
        this.settings = defaults(settings, {});

        const { credentials, companyId, companySocketId } = settings;
        const { providerId } = credentials;

        this.pusherInstance = new Channel({ companyId, providerId, companySocketId, credentials });
        this.rooms = [];
    }

    onEvent(label, callback) {
        return this.pusherInstance.on(label, callback);
    }
}

export default PmaService;
