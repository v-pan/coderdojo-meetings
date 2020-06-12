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

class WebviewService {
    private subscription_id = generateUUID();
    private event_listener: EventListener;

    private invoke = <M>(arg: WebviewMessage<M>) => {
        (window as any).external.invoke(JSON.stringify(arg));
    }

    /**
     * Sends `messageContent` to the backend, to be processed by the handler passed to `handle_message`
     */
    send = (request: Request) => {
        this.invoke(new WebviewMessage(this.subscription_id, request));
    }

    /**
     * Removes the event listener added by the constructor. This should be called whenever a component unrenders.
     * You should not need to call this if you are using the `useWebviewService` hook
     */
    drop = () => {
        document.removeEventListener(this.subscription_id, this.event_listener)
    }

    constructor(handler: (content: any) => void, unwrapper: (event: CustomEvent) => any) {
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
 * @param handler A function to handle responses from the backend.
 */
export function useWebviewService(handler: (content: string) => void): WebviewService;

/**
 * Returns a WebviewService instance
 * @param handler A function to handle responses from the backend.
 * @param unwrapper Optional function to expose the CustomEvent received from the backend. Should return the value that is passed to `handler` as `content`
 */
export function useWebviewService<T>(handler: (content: T) => void, unwrapper: (event: CustomEvent) => T): WebviewService;

export function useWebviewService<T>(handler: (content: T) => void, unwrapper?: (event: CustomEvent) => T): WebviewService {
    const defaultUnwrapper = (event: CustomEvent) => {
        return event.detail
    }

    const service = new WebviewService(handler, unwrapper ? unwrapper : defaultUnwrapper)
    useEffect(() => {

        return () => {
            service.drop()
        }
    }, [])
    return service
}
