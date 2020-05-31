import {v4 as generateUUID} from "uuid"

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

    constructor(handler: Function) {
        // Remember event listener for cleanup
        this.event_listener = ((response: CustomEvent) => {
            handler(response.detail)
        }) as EventListener

        // Listen for responses
        document.addEventListener(this.subscription_id, this.event_listener)
    }
}