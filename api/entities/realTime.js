export async function realTimeEvent({ eventId = "", updateRealTime = () => {} }) {
    JelouApiV1.get(`real-time-events/${eventId}`)
        .then((data) => {
            updateRealTime();
        })
        .catch((err) => {
            console.log(err);
        });
}
