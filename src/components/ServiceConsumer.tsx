import React, { useState } from "react"
import { useWebviewService } from "../WebviewService"

export const ServiceConsumer = () => {
    const [response, setResponse] = useState(0)
    const webviewService = useWebviewService((detail: string) => {
        setResponse(parseInt(detail))
    })
    const testReturn = () => webviewService.send({cmd: 'increment', number: response})

    return <button onClick={testReturn}>{response}</button>
}