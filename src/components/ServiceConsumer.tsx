import { h } from "preact";
import { useState } from "preact/hooks"
import { useWebviewService } from "../WebviewService"

export const ServiceConsumer = () => {
    const [response, setResponse] = useState(0)

    const webviewService = useWebviewService()
    const testReturn = () => webviewService.send(() => {
        return {tag: 'increment', fields: { number: response }}
    })?.then(result => setResponse(result))

    return <button onClick={testReturn}>{response}</button>
}