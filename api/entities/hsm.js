import JelouApiV1 from "../JelouApiV1";

export async function sendHsm({ formdata, header }) {
    try {
        const response = await JelouApiV1.post(`/hsm/file`, formdata, header);
        return response;
    } catch (error) {
        console.log(error);
    }
}
