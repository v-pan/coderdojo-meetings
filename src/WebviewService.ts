import {v4 as generateUUID} from "uuid"
import { useEffect } from "preact/hooks";

class WebviewMessage<T> {
    subscription_id: string;
    inner: T;

    constructor(subscription_id: string, inner: T) {
        this.subscription_id = subscription_id;
        this.inner = inner;
    }
}

class WebviewService {
    private subscription_id = generateUUID();
    private event_listener: EventListener;

    private invoke = <T>(arg: WebviewMessage<T>) => {
        (window as any).external.invoke(JSON.stringify(arg));
    }

    send = <T>(messageContent: T) => {
        this.invoke(new WebviewMessage<T>(this.subscription_id, messageContent));
    }

    drop = () => {
        document.removeEventListener(this.subscription_id, this.event_listener)
    }

    constructor(handler: (detail: string) => void) {
        // Remember event listener for cleanup
        this.event_listener = ((response: CustomEvent) => {
            handler(response.detail)
        }) as EventListener

        // Listen for responses
        document.addEventListener(this.subscription_id, this.event_listener)
    }
}

export const useWebviewService = (handler: (detail: any) => void): WebviewService => {
    const service = new WebviewService(handler)
    useEffect(() => {

        return () => {
            service.drop()
        }
    })
    return service
}