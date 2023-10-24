import OrganicIcon from "../components/icons/OrganicIcon";
import BroadcastIcon from "../components/icons/BroadcastIcon";
import AutomaticTransferIcon from "../components/icons/AutomaticTransferIcon";
import TranferOriginIcon from "../components/icons/TranferOriginIcon";
import InducedByOperatorIcon from "../components/icons/InducedByOperatorIcon";
import TicketIcon from "../components/icons/TicketIcon";
import InducedByAdminIcon from "../components/icons/InducedByAdminIcon";
import InducedBySystemIcon from "../components/icons/InducedBySystemIcon";
import InducedIcon from "../components/icons/InducedIcon";

export const ROOM_TYPES = {
    CLIENT: "client",
    COMPANY: "company",
    REPLY: "reply",
    TICKET: "ticket",
};

export const ORIGIN_ROOM = {
    INDUCED: "induced",
    INDUCED_BY_SYSTEM: "induced_by_system",
    INDUCED_BY_ADMIN: "induced_by_admin",
    INDUCED_BY_OPERATOR: "induced_by_operator",
    CLOSED: "closed",
    TRANSFER: "transfer",
    AUTO_TRANSFER: "automatic_transfer",
    TICKET: "ticket",
    BROADCAST: "broadcast",
    ORGANIC: "organic",
};

export const unitInMB = 1024 * 1024;

export const TYPES_FILE = {
    jpeg: "image/jpeg",
    jpg: "image/jpg",
    png: "image/png",
    excel: "application/vnd.ms-excel",
    xls: "application/xls",
    xlsx: "application/xlsx",
    xlsx1: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    pdf: "application/pdf",
    word: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    docx: "application/docx",
    zip: "application/zip",
    powerPoint: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    powerPoint1: "vnd.openxmlformats-officedocument.presentationml.presentation",
    pptx: "application/pptx",
};

export const DOCUMENT_MESSAGE_TYPES = {
    image: "IMAGE",
    document: "DOCUMENT",
    video: "VIDEO",
};

export const ORIGINS_ROOMS_ICONS = {
    [ORIGIN_ROOM.INDUCED]: {
        image: <InducedIcon style={{ width: 14, height: 14 }} />,
    },
    [ORIGIN_ROOM.INDUCED_BY_SYSTEM]: {
        image: <InducedBySystemIcon style={{ width: 14, height: 14 }} />,
    },
    [ORIGIN_ROOM.INDUCED_BY_ADMIN]: {
        image: <InducedByAdminIcon style={{ width: 14, height: 14 }} />,
    },
    [ORIGIN_ROOM.INDUCED_BY_OPERATOR]: {
        image: <InducedByOperatorIcon style={{ width: 14, height: 14 }} />,
    },
    [ORIGIN_ROOM.TRANSFER]: {
        image: <TranferOriginIcon style={{ width: 14, height: 14 }} />,
    },
    [ORIGIN_ROOM.AUTO_TRANSFER]: {
        image: <AutomaticTransferIcon style={{ width: 14, height: 14 }} />,
    },
    [ORIGIN_ROOM.TICKET]: {
        image: <TicketIcon style={{ width: 14, height: 14 }} />,
    },
    [ORIGIN_ROOM.BROADCAST]: {
        image: <BroadcastIcon style={{ width: 14, height: 14 }} />,
    },
    [ORIGIN_ROOM.ORGANIC]: {
        image: <OrganicIcon style={{ width: 15, height: 15 }} />,
    },
};

export const DEFAULT_AVATAR = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg";

export const SIDEBAR_SETTINGS = {
    TEXT: "text",
    TEXTBOX: "textbox",
    SELECT: "select",
    NUMBER: "number",
    EMAIL: "email",
    DATE: "date",
};

export const QR_CONST = {
    type: "QUICKREPLY",
    isVisible: true,
    language: "ES",
};

/* USER TYPES */
export const USER_TYPES = {
    USER: "USER",
    OPERATOR: "OPERATOR",
    BOT: "BOT",
    BROADCAST: "BROADCAST",
};

export const CHANNELS_VIDEO_SUPORT = { WHATSAPP: "WHATSAPP", FACEBOOK: "FACEBOOK", WIDGET: "WIDGET" };

/* MAX_LENGTH */
export const FACEBOOK_MAX_LENGTH = 1000;
export const INSTAGRAM_MAX_LENGTH = 1000;

export const BOT_TYPES = {
    TWILIO: "TWILIO",
    WAVY: "WAVY",
    SMOOCH: "SMOOCH",
    GUPSHUP: "GUPSHUP",
    WHATSAPP: "WHATSAPP",
    VENOM: "veVENOMom",
    FACEBOOK: "FACEBOOK",
    FACEBOOK_FEED: "FACEBOOK_FEED",
    WEB: "WEB",
    APP: "WEB",
    TWITTER: "TWITTER",
    WIDGET: "WIDGET",
    INSTAGRAM: "INSTAGRAM",
};

export const OPERATOR_STATUS = {
    ONLINE: "online",
    OFFLINE: "offline",
    BUSY: "busy",
};

export const MESSAGE_STATUSES = {
    CREATED: "CREATED",
    DELIVERED_CHANNEL: "DELIVERED_CHANNEL",
    DELIVERED_USER: "DELIVERED_USER",
    FAILED: "FAILED",
};

export const TYPE_MESSAGE = {
    TEXT: "TEXT",
    IMAGE: "IMAGE",
    EVENT: "EVENT",
    VIDEO: "VIDEO",
    AUDIO: "AUDIO",
    LOCATION: "LOCATION",
    CONTACTS: "CONTACTS",
    STICKER: "STICKER",
    DOCUMENT: "DOCUMENT",
    FILE: "FILE",
    QUICK_REPLY: "QUICK_REPLY"
};

export const TYPE_SLUGS = {
    ASSIGNED: "ASSIGNED",
    TIME_END: "TIME_END",
    REMOVE_USER: "REMOVE_USER",
    SWITCH_OPERATOR_FROM: "SWITCH_OPERATOR_FROM",
};

export const FUSE_OPTIONS = {
    shouldSort: true,
    threshold: 0.25,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    includeMatches: true,
    keys: ["name", "names", "senderId", "user.id", "message.text"],
};
