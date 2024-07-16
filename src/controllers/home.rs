use axum::body::Body;
use axum::http::Response;
use loco_rs::prelude::*;

use crate::views::home::HomeResponse;

async fn current() -> Result<Json<HomeResponse>> {
    let response = HomeResponse::new("loco");
    Ok(Json(response))
}

pub fn routes() -> Routes {
    Routes::new().add("/", get(current))
}
