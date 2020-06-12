extern crate serde_derive;

pub mod webview {
    use wasm_bindgen::prelude::*;
    use wasm_typescript_definition::*;
    use serde_derive::*;

    #[derive(Deserialize, Serialize, TypescriptDefinition)]
    #[serde(tag = "tag", content = "fields", rename_all = "camelCase")]
    pub enum Request {
        Init,
        Log { text: String },
        Increment { number: isize },
        DelayedIncrement { number: isize },
        ConvertUpperCase { text: String },
        Test
    }
    
    #[derive(Deserialize, Serialize, TypescriptDefinition, std::fmt::Debug)]
    #[serde(tag = "tag", content = "fields", rename_all = "camelCase")]
    pub enum Return {
        Increment { number: isize },
        DelayedIncrement { number: isize },
        ConvertUpperCase { text: String }
    }
}