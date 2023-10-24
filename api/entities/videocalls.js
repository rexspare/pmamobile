import JelouApiV1 from "../JelouApiV1";

export async function getVideoToken({}) {
    try {
        const response = await JelouApiV1.get(`/videocalls/token?operatorId=${userSession?.operatorId}`);
        return re;
    } catch (err) {
        console.log(err);
    }
}
