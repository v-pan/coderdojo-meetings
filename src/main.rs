extern crate web_view;
extern crate types;
use web_view::*;
use types::Request;

fn main() {
    let html_content = include_str!("../dist/bundle.html");
    let mut rt = tokio::runtime::Runtime::new().unwrap();

    rt.block_on(async {
        web_view::builder()
        .title("My Project")
        .content(Content::Html(html_content))
        .size(320, 480)
        .resizable(false)
        .debug(true)
        .user_data(())
        .invoke_handler(|webview: &mut WebView<()>, arg| {
            handle_message(webview.handle(), arg,
                |inner: Request| {
                match inner {
                    Request::Init => {
                        None
                    }
                    Request::Log { text } => {
                        println!("{}", text);
                        None
                    }
                    Request::Increment { number } => {
                        std::thread::sleep(std::time::Duration::from_millis(1000));
                        Some(number + 1)
                    }
                    Request::Test => {
                        None
                    }
                }
            });
            Ok(())
        })
        .run()
        .unwrap();
    });
}

extern crate serde_json;
extern crate serde_derive;
use serde_derive::*;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Message<T> {
    subscription_id: String,
    inner: T
}

fn handle_message<
    'a, T: 'static,
    OUT: Deserialize<'a> + Serialize + Send + 'static,
    H: Fn(Request) -> std::option::Option<OUT> + Send + 'static
>(handle: Handle<T>, arg: &str, handler: H) {
    let recieved: Message<Request> = serde_json::from_str(arg).unwrap();

    // TODO: Queue up recieved messages and loop over them in the thread
    tokio::spawn(
        async move {
            let output = handler(recieved.inner);
        
            if let Some(response) = output {
                let sending = Message {
                    subscription_id: recieved.subscription_id,
                    inner: response
                };
        
                let message = sending;
        
                handle.dispatch(move | webview | {
                    let eval_script = format!(
                        r#"document.dispatchEvent(
                            new CustomEvent("{event_name}", {{ detail: {content:?} }})
                        );"#,
                        event_name = message.subscription_id,
                        content = serde_json::to_string(&message.inner).unwrap()
                    );
                
                    webview
                        .eval(&eval_script)
                }).expect("Failed to send response");
            }
        }
    );
}