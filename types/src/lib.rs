extern crate serde_derive;

use wasm_bindgen::prelude::*;
use wasm_typescript_definition::*;
use serde_derive::*;

#[derive(Deserialize, Serialize, TypescriptDefinition)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
    Init,
    Log { text: String },
    Increment { number: isize },
    Test
}