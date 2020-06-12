import { h } from "preact";
import { useState } from "preact/hooks"
import { useWebviewService } from "../WebviewService"

export const ServiceConsumer = () => {
    const [response, setResponse] = useState(0)

    const webviewService = useWebviewService((detail: string) => {
        setResponse(parseInt(detail))
        return parseInt(detail)
    })
    const testReturn = () => webviewService.send({tag: 'increment', fields: { number: response }}).then(result => console.log("Result:", result))

    return <button onClick={testReturn}>{response}</button>
}