import {v4 as generateUUID} from "uuid"
import { useEffect } from "react";

export class WebviewMessage {
    subscription_id: string;
    inner: any;

    constructor(subscription_id: string, inner: any) {
        this.subscription_id = subscription_id;
        this.inner = inner;
    }
}

export class WebviewService {
    private subscription_id = generateUUID();
    private event_listener: EventListener;

    private invoke = (arg: WebviewMessage) => (window as any).external.invoke(JSON.stringify(arg));
    send = (messageContent: any) => {
        // Wrap and send to rust invokehandler
        this.invoke(new WebviewMessage(this.subscription_id, messageContent));
    }

    drop = () => {
        document.removeEventListener(this.subscription_id, this.event_listener)
    }

    constructor(handler: (detail: any) => void) {
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