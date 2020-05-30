extern crate serde_json;
extern crate serde_derive;
extern crate web_view;

use web_view::*;
use serde_derive::*;

fn main() {
    let html_content = include_str!("../dist/bundle.html");

    web_view::builder()
        .title("My Project")
        .content(Content::Html(html_content))
        .size(320, 480)
        .resizable(false)
        .debug(true)
        .user_data(())
        .invoke_handler(|_webview, arg| {
            use Cmd::*;

            match serde_json::from_str(arg).unwrap() {
                Init => (),
                Test {text} => println!("{}", text)
            }

            Ok(())
        })
        .run()
        .unwrap();
}

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
    Init,
    Test {text: String}
}
