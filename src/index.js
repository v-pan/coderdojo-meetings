import React from "react";
import ReactDOM from "react-dom";
import Header from './component/Header'

class HelloMessage extends React.Component {
    render() {
        return <div>
            <Header/>
            <div className="container">
                <h1>Hello {this.props.name}</h1>
                <button onClick={() => { rust.test() }}>Click me to print from Rust!</button>
            </div>
        </div>
    }
}

let rust = {
    invoke: (arg) => { window.external.invoke(JSON.stringify(arg)) },
    test: () => { rust.invoke({cmd: 'test', text: 'This is a test'}) }
}

let App = document.getElementById("app");

ReactDOM.render(<HelloMessage name="React" />, App);
