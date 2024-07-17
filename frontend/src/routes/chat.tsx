import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import { For } from "solid-js";
import { SocketService, MessageType } from "~/services/SocketService";


export default function Chat() {
    const [socketService] = createSignal(new SocketService("http://localhost:8000"));
    const [messageInput, setMessageInput] = createSignal("");

    const handleInput = (e: Event) => {
        e.preventDefault();
        const message = messageInput();
        socketService().sendMessage(messageInput());
        setMessageInput("");
    };

    return (
        <div class="p-5 max-w-md mx-auto">
            <h1 class="text-2xl font-bold mb-4 text-center">Chat Room</h1>
            <div id="message-container" class="border border-gray-300 p-3 mb-4 h-72 overflow-y-scroll">
                <For each={socketService().getMessages()()}>
                    {(message) => (
                        <div
                            class={`mb-2 p-2 rounded-md max-w-[75%] ${message.type === MessageType.User ? 'bg-blue-200 text-right ml-auto' : 'bg-gray-200 text-left mr-auto'}`}
                        >
                            {message.text}
                        </div>
                    )}
                </For>
            </div>
            <div>
                <form id="send-container" onSubmit={handleInput}>
                    <input
                        class="flex-grow border border-gray-300 p-2 rounded mr-2"
                        type="text"
                        name="message"
                        placeholder="Type a message"
                        value={messageInput()}
                        onChange={(e) => setMessageInput(e.target.value)}
                        id="message-input"
                    />
                    <button type="submit" id="send-button">Send</button>
                </form>
            </div>
        </div>
    );

}
