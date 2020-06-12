import {v4 as generateUUID} from "uuid"
import { useEffect } from "preact/hooks";
import { Request } from "../types/pkg/types";

class WebviewMessage<T> {
    subscription_id: string;
    message_id: string;
    inner: T;

    constructor(subscription_id: string, inner: T) {
        this.subscription_id = subscription_id;
        this.message_id = generateUUID();
        this.inner = inner;
    }
}

class WebviewService<T> {
    private subscription_id = generateUUID();
    private handler: (content: any) => any;
    private unwrapper: (content: any) => any;
    private sent_messages: { [messageId: string]: { event_listener: EventListener } } = {};

    private invoke = <T>(arg: WebviewMessage<T>) => {
        (window as any).external.invoke(JSON.stringify(arg));
    }

    /**
     * Sends a request to the backend
     */
    send = (request: Request) => {
        let message = new WebviewMessage(this.subscription_id, request)

        const promise = new Promise((resolve, _) => {
            let event_listener = ((response: CustomEvent) => {
                if(response.detail.messageId == message.message_id) {
                    document.removeEventListener(this.subscription_id, this.sent_messages[message.message_id].event_listener)
                    delete this.sent_messages[message.message_id]

                    console.log("Cleaned up this listener")
                    resolve(this.handler(this.unwrapper(response)))
                }
            }) as EventListener

            this.sent_messages[message.message_id] = { event_listener: event_listener }

            document.addEventListener(this.subscription_id, event_listener)
        });

        this.invoke(message);
        return promise
    }

    /**
     * Removes the event listener added by the constructor. This should be called whenever a component unrenders.
     * You should not need to call this if you are using the `useWebviewService` hook
     */
    drop = () => {
        // TODO: Implement this
        // document.removeEventListener(this.subscription_id, this.event_listener)
    }

    constructor(handler: (content: T) => any, unwrapper: (event: CustomEvent) => T) {
        this.handler = handler;
        this.unwrapper = unwrapper;
    }
}

/**
 * Returns a WebviewService instance
 * @param handler A function, given the `content` returned from `unwrapper`, to handle responses from the backend. If no unwrapper is specified, `content` will be the raw data returned by the backend.
 * @param unwrapper Optional function to expose the CustomEvent received from the backend. Should return the value that is passed to `handler` as `content`
 */

export const useWebviewService = <T>(handler: (content: T) => any, unwrapper?: (event: CustomEvent) => T): WebviewService<T> => {
    const defaultUnwrapper = (event: CustomEvent) => {
        return event.detail.inner
    }

    const service = new WebviewService(handler, unwrapper ? unwrapper : defaultUnwrapper)
    useEffect(() => {

        return () => {
            service.drop()
        }
    }, [])
    return service
}