// src/socketService.ts
import { io, Socket } from "socket.io-client";
import { createSignal, onCleanup, onMount } from "solid-js";

export type Message = {
    type: MessageType;
    text: string;
};

export enum MessageType {
    User,
    System,
}

export class SocketService {
    private socket: Socket;
    private messages = createSignal<Message[]>([]);

    constructor(private url: string) {
        console.log("creating socketio in url:"+url);
        this.socket = io(this.url,{
            ackTimeout: 5000,
            retries:5,
            timeout: 5000,
            reconnectionDelay:1000,
            reconnectionAttempts: 15,
        });

        this.socket.on("message", (message: String) => {
            console.log("received message:"+message);
            this.messages[1]((prev) => [...prev, { type: MessageType.System, message }]);
        });

        this.socket.on("disconnect", (reason) => {
            console. log(`disconnected due to ${reason}`);
        });

        onMount(() => {
            onCleanup(() => {
                if (this.socket) {
                    console.log("disconnect socket");
                    this.socket.disconnect();
                }
            });
        });
    }

    public sendMessage( input: string ) {
        console.log(`sending message:${input}`);
        const text = input.trim();
        if (text !== "") {
            this.socket.emit("message", input);
            console.log(`sent message:${input}`);
            this.messages[1]((prev) => [...prev, { type: MessageType.User, text }]);
        }
    }

    public getMessages(){
        console.log("getMessages()");
        return this.messages[0];
    }
}