extern crate serde_derive;

use wasm_bindgen::prelude::*;
use wasm_typescript_definition::*;
use serde_derive::*;

#[derive(Deserialize, Serialize, TypescriptDefinition)]
#[serde(tag = "tag", content = "fields", rename_all = "camelCase")]
pub enum Request {
    Init,
    Log { text: String },
    Increment { number: isize },
    Test
}