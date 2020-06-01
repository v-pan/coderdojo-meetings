import React, { useEffect, useState } from "react";
import { useWebviewService } from "../WebviewService";
import { ServiceConsumer } from "./ServiceConsumer";

export const Main = () => {
    // TODO: Automate service.send() calls
    // Maybe one big object that defines these, passed to the hook, in the style of angular's form builder?
    const log = () => service.send({cmd: 'log', text: 'This is a test' })
    const increment = () => service.send({cmd: 'increment', number: count })

    const [count, setCount] = useState(0)

    const service = useWebviewService((detail: string) => {
        // TODO: Probably gonna use a reducer style of handling reponse details. Have some state changes instead :)
        setCount(parseInt(detail))
    })

    return (
        <div>
            <div className="container">
                <h1>Hello World!</h1>
                <p>Last response: {count}</p>
                <button onClick={() => { log() }}>Click me to print from Rust!</button>
                <br/>
                <button onClick={() => { increment() }}>Test Log</button>
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