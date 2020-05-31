import React, { useEffect, useState } from "react";
import { WebviewService } from "../WebviewService";

export const Main = () => {
    const test = () => service.send({cmd: 'test', text: 'This is a test'})
    const testLog = () => service.send({cmd: 'testLog', number: 3})

    const [response, setResponse] = useState(0)

    const responseHandler = (detail: any) => {
        // TODO: Probably gonna use a reducer style of handling reponse details. Have some state changes instead :)
        setResponse(detail)
    }

    const service = new WebviewService(responseHandler)

    useEffect(() => {

        return () => {
            // Gotta drop the service when the component unmounts to remove the listener. Automate this somehow, maybe with refs or a custom hook?
            service.drop()
        }
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