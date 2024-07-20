use langchain_rust::llm::OpenAIConfig;
use langchain_rust::{language_models::llm::LLM, llm::openai::OpenAI};
use std::env;
use serde::__private::de::IdentifierDeserializer;
use tokio::sync::RwLock;
use crate::channels::state::RoomStore;
use langchain_rust::language_models::LLMError;

#[derive(Clone)]
pub struct AiService {
    open_ai: OpenAI<OpenAIConfig>,
}

impl AiService{
    pub fn new(openai_api_key:String,openai_api_base_url:String) -> Self {
        Self {
            open_ai: OpenAI::default().with_config(
                OpenAIConfig::default()
                .with_api_base(openai_api_base_url)
                .with_api_key(openai_api_key)
            )
        }
    }

    pub async fn send_message(&self,msg:String) -> Result<String, LLMError> {
        self.open_ai.invoke(&msg).await
    }
}

impl Default for AiService {
    fn default() -> Self {
        Self::new("".to_string(),"https://api.openai.com/v1".to_string())
    }
}

pub async fn init_openai_client() -> Result<Option<AiService>, ()> {
    let openai_api_key = env::var("OPENAI_API_KEY").unwrap_or_else(|_| "".to_string());
    let openai_api_base_url = env::var("OPENAI_API_BASE_URL").unwrap_or_else(|_| "https://api.openai.com/v1".to_string());
    let openai_enabled: bool = env::var("OPENAI_ENABLED").unwrap_or_else(|_| "false".to_string()).parse().unwrap();

    if openai_enabled {
        let ai_service = AiService::new(openai_api_key,openai_api_base_url);
        Ok(Some(ai_service))
    }
    else {
        Ok(None)
    }
}