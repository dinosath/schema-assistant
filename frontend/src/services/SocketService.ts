// src/socketService.ts
import { io, Socket } from "socket.io-client";
import { createSignal, onCleanup, onMount } from "solid-js";

type Message = {
    id: number;
    text: string;
};

let socket: Socket;

const [messages, setMessages] = createSignal<Message[]>([]);
const [inputValue, setInputValue] = createSignal("");

const connectSocket = (url: string) => {
    socket = io(url);

    socket.on("message", (message: Message) => {
        setMessages((prev) => [...prev, message]);
    });
};

const sendMessage = (message: Message) => {
    if (socket) {
        socket.emit("message", message);
        setMessages((prev) => [...prev, message]);
    }
};

const getMessages = () => messages;

const setupSocket = (url: string) => {
    onMount(() => {
        connectSocket(url);

        onCleanup(() => {
            if (socket) {
                socket.disconnect();
            }
        });
    });
};

const handleSendMessage = () => {
    if (inputValue().trim() !== "") {
        const message: Message = { id: messages().length, text: inputValue() };
        sendMessage(message);
        setInputValue("");
    }
};

const getInputValue = () => inputValue;
const setInputValueState = (value: string) => setInputValue(value);

export { setupSocket, handleSendMessage, getMessages, getInputValue, setInputValueState };
