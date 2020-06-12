import { h } from "preact";
import { useState } from "preact/hooks";
import { useWebviewService, useBoxedState } from "../WebviewService";
import { ServiceConsumer } from "./ServiceConsumer";
import { useEffect } from "preact/hooks";
import { Return } from "../../types/pkg/types";

export const Main = () => {
    // No longer needed with stronger typing
    // // TODO: Automate service.send() calls
    // // Maybe one big object that defines these, passed to the hook, in the style of angular's form builder?

    const [count, setCount] = useState(0)
    const [test, setTest] = useBoxedState(0)

    const log = () => service.send({tag: 'log', fields: { text: 'This is a test' } })

    const [text, setText] = useBoxedState("")

    const toUpperCase = () => service.queue(async () => {
        let result = await service.send({tag: 'convertUpperCase', fields: { text: text.value }})
        setText(result)
    })

    const delayedIncrement = () => service.queue(async () => {
        console.log("Clicked!", count)
        let result = await service.send({tag: 'delayedIncrement', fields: { number: test.value }})
        console.log("Recieved", result)
        setTest(result)
    })

    const unboxedDelayedIncrement = () => service.queue(async () => {
        console.log("Clicked!", count)
        let result = await service.send({tag: 'delayedIncrement', fields: { number: count }})
        console.log("Recieved", result)
        setCount(result)
    })

    const service = useWebviewService((detail: Return) => {
        if(detail.tag === 'delayedIncrement' || detail.tag === 'increment') {
            return detail.fields.number
        } else if (detail.tag === 'convertUpperCase') {
            return detail.fields.text
        }
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