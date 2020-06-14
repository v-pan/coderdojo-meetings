import { h } from "preact";
import { useState } from "preact/hooks";
import { useWebviewService, useBoxedState } from "../WebviewService";
import { ServiceConsumer } from "./ServiceConsumer";

export const Main = () => {
    const [count, setCount] = useState(0)
    const [test, setTest] = useBoxedState(0)
    const [text, setText] = useBoxedState("")
    const service = useWebviewService()

    const log = () => service.send(() => { return {tag: 'log', fields: { text: 'This is a test' }} })
    const toUpperCase = () => service.send(() => { return {tag: 'toUpperCase', fields: { text: text.value }} }).then(result => setText(result))

    const delayedIncrement = () => service.send(() => { return {tag: 'delayedIncrement', fields: { number: test.value }} })
        .then(result =>setTest(result))

    const unboxedDelayedIncrement = () => service.send(() => {
        console.log("Clicked!", count)
        return {tag: 'delayedIncrement', fields: { number: count }}
    }).then(result => {
        console.log("Recieved", result)
        setCount(result)
    })

    return (
        <div>
            <div className="container">
                <h1>Hello World!</h1>
                <p>Last response: unboxed: {count} | boxed: {test.value}</p>
                <button onClick={() => { log() }}>Click me to print from Rust!</button>
                <p>Input value: {text.value}</p>
                <form>
                    <input value={text.value} onInput={event => {setText((event.target as HTMLInputElement)?.value); toUpperCase()}} />
                </form>
                <br/>
                <button onClick={unboxedDelayedIncrement}>Unboxed increment</button>
                <button onClick={delayedIncrement}>Boxed increment</button>
                {/* Testing having many services */}
                <br />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <br />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <br />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <ServiceConsumer />
                <br />
            </div>
        </div>
    )
}