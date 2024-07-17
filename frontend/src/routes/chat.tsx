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
        <div class="bg-gray-100 h-screen flex items-center justify-center">
            <div class="bg-white rounded-lg shadow-lg p-6 w-full w-11/12 h-5/6 mx-auto">
                <h1 class="text-2xl font-bold mb-4 text-center">Chat Room</h1>
                <div id="message-container" class="border border-gray-300 p-3 mb-4 h-full overflow-y-scroll">
                    <div class="mb-2">
                        <div class="flex items-start">
                            <div class="bg-blue-500 text-white p-2 rounded-lg rounded-tl-none max-w-xs">
                                <p>Hello! How can I help you today?</p>
                            </div>
                        </div>
                    </div>
                    <div class="mb-2">
                        <div class="flex items-end justify-end">
                            <div class="bg-gray-200 text-gray-800 p-2 rounded-lg rounded-tr-none max-w-xs">
                                <p>I have a question about my order.</p>
                            </div>
                        </div>
                    </div>
                    <For each={socketService().getMessages()()}>
                        {(message) => (
                            <div
                                class={`mb-2 p-2 rounded-md w-max ${message.type === MessageType.User ? 'bg-blue-200 text-right ml-auto' : 'bg-gray-200 text-left mr-auto'}`}
                            >
                                {message.text}
                            </div>
                        )}
                    </For>
                </div>

                    <form id="send-container" class="flex" onSubmit={handleInput}>
                        <input
                            class="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            name="message"
                            placeholder="Type a message"
                            value={messageInput()}
                            onChange={(e) => setMessageInput(e.target.value)}
                            id="message-input"
                        />
                        <button type="submit" id="send-button" class="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Send</button>
                </form>
        </div>
        </div>
    );

}
