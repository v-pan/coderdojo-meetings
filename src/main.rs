extern crate serde_json;
extern crate serde_derive;
extern crate web_view;
extern crate types;

use web_view::*;
use serde_derive::*;
use serde::{Deserialize, Serialize};
use types::Cmd;

fn main() {
    let html_content = include_str!("../dist/bundle.html");

    web_view::builder()
        .title("My Project")
        .content(Content::Html(html_content))
        .size(320, 480)
        .resizable(false)
        .debug(true)
        .user_data(())
        .invoke_handler(|webview, arg| {
            handle_message(webview, arg, |inner: Cmd| {
                match inner {
                    Cmd::Init => {
                        None
                    }
                    Cmd::Log { text } => {
                        println!("{}", text);
                        None
                    }
                    Cmd::Increment { number } => {
                        Some(number + 1)
                    }
                    Cmd::Test => {
                        None
                    }
                }
            } );
            Ok(())
        })
        .run()
        .unwrap();
}

#[derive(Serialize, Deserialize)]
pub struct Message<T> {
    subscription_id: String,
    inner: T
}

fn send_response<T, M: Serialize>(webview: &mut WebView<T>, message: Message<M>) {
    let eval_script = format!(
        r#"document.dispatchEvent(
            new CustomEvent("{event_name}", {{ detail: {content:?} }})
        );"#,
        event_name = message.subscription_id,
        content = serde_json::to_string(&message.inner).unwrap()
    );

    webview
        .eval(&eval_script)
        .expect("Failed to dispatch event to webview");
}

fn handle_message<
    'a, T,
    M: Deserialize<'a> + Serialize,
    OUT: Deserialize<'a> + Serialize,
    H: Fn(M) -> Option<OUT>
>(webview: &mut WebView<T>, arg: &'a str, handler: H) {
    let recieved: Message<M> = serde_json::from_str(arg).unwrap();

    let output = handler(recieved.inner);
    if let Some(response) = output {
        let sending = Message {
            subscription_id: recieved.subscription_id,
            inner: response
        };

        send_response(webview, sending);
    }
}