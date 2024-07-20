use loco_rs::socketioxide::{
    extract::{AckSender, Bin, Data, SocketRef,State},
    SocketIo,
};
use super::state;
use tracing::info;
use serde_json::Value;
use crate::services::langchain::{AiService, init_openai_client};

pub async fn on_connect(socket: SocketRef) {
    info!("Socket.IO connected: {:?} {:?}", socket.ns(), socket.id);

    let mut ai_service:AiService = init_openai_client().await.unwrap().unwrap();

    socket.on(
        "message",
        move |Data::<String>(data), ack: AckSender, Bin(bin)| {
            info!("Received event: {:?} {:?}", data, bin);
            let clone = data.clone();
            ack.bin(bin).send(data).ok();


            let ai_service_clone = ai_service.clone();
            tokio::spawn(async move {
                match ai_service_clone.send_message(clone).await {
                    Ok(response) => println!("{:?}", response),
                    Err(e) => eprintln!("Error sending message: {:?}", e),
                }
            });
        },
    );
}