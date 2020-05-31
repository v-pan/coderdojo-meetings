import { render, Component } from "preact";
import Header from './component/Header'

class HelloMessage extends Component {
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

render(<HelloMessage name="Preact" />, document.body);
