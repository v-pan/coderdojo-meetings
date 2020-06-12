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
        .invoke_handler(|webview: &mut WebView<()>, arg: &str| {
            handle_message(webview.handle(), arg.to_string());
            Ok(())
        })
        .run()
        .unwrap();
    });
}

extern crate serde_json;
extern crate serde_derive;
use serde_derive::*;
// use serde::Serialize;
// use serde::de::DeserializeOwned;

#[derive(Serialize, Deserialize)]
pub struct Message<T> {
    subscription_id: String,
    inner: T
}

fn handle_message<
    // OUT: DeserializeOwned + Serialize + Send,
    // H: Fn(Request) -> std::option::Option<OUT> + Send
>(handle: Handle<()>, arg: String, /* handler: H */) {
    // TODO: Queue up recieved messages and loop over them in the thread
    tokio::spawn(
        async move {
            let recieved: Message<Request> = serde_json::from_str(&arg).unwrap();

            // TODO: Get this to be passed into the function without needing a static lifetime
            // let output = handler(received.inner)

            let output = {
                match recieved.inner {
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
            };

            if let Some(response) = output {
                let sub_id = recieved.subscription_id;
                let sending_inner = serde_json::to_string(&response).unwrap();
                let sending_content = serde_json::to_string(&response).unwrap();

                handle.dispatch(move | webview | {
                    let sending = Message {
                        subscription_id: sub_id,
                        inner: sending_content
                    };

                    let eval_script = format!(
                        r#"document.dispatchEvent(
                            new CustomEvent("{event_name}", {{ detail: {content:?} }})
                        );"#,
                        event_name = sending.subscription_id,
                        content = sending_inner
                    );

                    webview.eval(&eval_script)
                }).expect("Failed to send response");
            }
        }
    );
}