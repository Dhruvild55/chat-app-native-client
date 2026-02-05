import { getSocket } from "./socket";

export const testSocket = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log(" socket is not connected ");
        return;
    }
    if (off) {
        socket.off("testSocket", payload);
    } else if (typeof payload == "function") {
        socket.on("testSocket", payload);
    } else {
        socket.emit("testSocket", payload)
    }
};

export const updateProfile = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log(" socket is not connected ");
        return;
    }
    if (off) {
        socket.off("updateProfile", payload);
    } else if (typeof payload == "function") {
        socket.on("updateProfile", payload);
    } else {
        socket.emit("updateProfile", payload)
    }
};