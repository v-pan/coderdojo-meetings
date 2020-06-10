import {v4 as generateUUID} from "uuid"
import { useEffect } from "preact/hooks";
import { Request } from "../types/pkg/types";

class WebviewMessage<T> {
    subscription_id: string;
    inner: T;

    constructor(subscription_id: string, inner: T) {
        this.subscription_id = subscription_id;
        this.inner = inner;
    }
}

class WebviewService<T> {
    private subscription_id = generateUUID();
    private event_listener: EventListener;

    private invoke = <T>(arg: WebviewMessage<T>) => {
        (window as any).external.invoke(JSON.stringify(arg));
    }

    /**
     * Sends `messageContent` to the backend, to be processed by the handler passed to `handle_message`
     */
    send = (messageContent: Request) => {
        this.invoke(new WebviewMessage(this.subscription_id, messageContent));
    }

    /**
     * Removes the event listener added by the constructor. This should be called whenever a component unrenders.
     * You should not need to call this if you are using the `useWebviewService` hook
     */
    drop = () => {
        document.removeEventListener(this.subscription_id, this.event_listener)
    }

    constructor(handler: (detail: T) => void, unwrapper: (message: CustomEvent) => T) {
        // Remember event listener for cleanup
        this.event_listener = ((response: CustomEvent) => {
            handler(
                unwrapper(response)
                )
        }) as EventListener

        // Listen for responses
        document.addEventListener(this.subscription_id, this.event_listener)
    }
}

/**
 * Returns a WebviewService instance
 * @param handler A function, given the `content` returned from `unwrapper`, to handle responses from the backend. If no unwrapper is specified, `content` will be the raw data returned by the backend.
 * @param unwrapper Optional function to expose the CustomEvent received from the backend. Should return the value that is passed to `handler` as `content`
 */

export const useWebviewService = <T>(handler: (content: T) => void, unwrapper?: (message: CustomEvent) => T): WebviewService<T> => {
    const defaultUnwrapper = (message: CustomEvent) => {
        return message.detail
    }

    const service = new WebviewService(handler, unwrapper ? unwrapper : defaultUnwrapper)
    useEffect(() => {

        return () => {
            service.drop()
        }
    }, [])
    return service
}