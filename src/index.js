/** @jsx h */

import { render, h } from "preact";
import Header from './component/Header'

const HelloMessage = () => {
    return (
        <div>
            <Header />
            <div className="container">
                <h1>Hello Preact!</h1>
                <button onClick={() => { rust.test() }}>Click me to print from Rust!</button>
            </div>
        </div>
    )
}

let rust = {
    invoke: (arg) => { window.external.invoke(JSON.stringify(arg)) },
    test: () => { rust.invoke({cmd: 'test', text: 'This is a test'}) }
}

render(<HelloMessage />, document.body);
