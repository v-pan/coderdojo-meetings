import React, { useEffect, useState } from "react";
import { WebviewService, useWebviewService } from "../WebviewService";

export const Main = () => {
    const test = () => service.send({cmd: 'test', text: 'This is a test'})
    const testLog = () => service.send({cmd: 'testLog', number: 3})

    const [response, setResponse] = useState(0)

    const service = useWebviewService((detail) => {
        // TODO: Probably gonna use a reducer style of handling reponse details. Have some state changes instead :)
        setResponse(detail)
    })

    return (
        <div>
            <div className="container">
                <h1>Hello World!</h1>
                <p>Last response: {response}</p>
                <button onClick={() => { test() }}>Click me to print from Rust!</button>
                <br/>
                <button onClick={() => { testLog() }}>Test Log</button>
            </div>
        </div>
    )
}