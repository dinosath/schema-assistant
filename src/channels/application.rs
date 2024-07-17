use loco_rs::socketioxide::{
    extract::{AckSender, Bin, Data, SocketRef,State},
    SocketIo,
};

use super::state;
use tracing::info;
use serde_json::Value;

#[derive(Debug, serde::Deserialize)]
pub struct MessageIn {
    id: i64,
    text: String,
}

#[derive(serde::Serialize)]
pub struct Messages {
    messages: Vec<state::Message>,
}

pub async fn on_connect(socket: SocketRef) {
    info!("Socket.IO connected: {:?} {:?}", socket.ns(), socket.id);

    socket.on(
        "message",
        |Data::<Value>(data),ack: AckSender, Bin(bin)| {
            info!("Received event: {:?} {:?}", data, bin);
            ack.bin(bin).send(data).ok();
        },
    );
}
