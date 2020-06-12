import { v4 as generateUUID } from "uuid"
import { useEffect, useState } from "preact/hooks";
import { Request, Return } from "../types/pkg/types";

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

class WebviewService {
    private subscription_id = generateUUID();

    private handler: (content: any) => any;
    private unwrapper: (content: any) => any;

    private sent_messages: { [messageId: string]: { event_listener: EventListener } } = {};

    queue: (fn: () => any) => Promise<any>;

    private invoke = <M>(arg: WebviewMessage<M>) => {
        (window as any).external.invoke(JSON.stringify(arg));
    }

    /**
     * Sends a request to the backend
     */
    send = (request: Request) => {
        let message = new WebviewMessage(this.subscription_id, request)

        if(narrowReturnType(request as Return) !== null) {
            const promise: Promise<any> = new Promise((resolve, _) => {
                let event_listener = ((response: CustomEvent) => {
                    if(response.detail.messageId == message.message_id) {
                        document.removeEventListener(this.subscription_id, this.sent_messages[message.message_id].event_listener)
                        delete this.sent_messages[message.message_id]
    
                        // console.log("Cleaned up this listener")
                        resolve(this.handler(this.unwrapper(response)))
                    }
                }) as EventListener
    
                this.sent_messages[message.message_id] = { event_listener: event_listener }
    
                document.addEventListener(this.subscription_id, event_listener)
            });
    
            this.invoke(message);
            return promise;
        } else {
            this.invoke(message);
        }
    }

    private createPromiseQueue = (/*stopOnError: boolean*/) => {
        let p: Promise<any> = Promise.resolve()
        return function(fn: (request: Request) => any) {
            p = p
            // .then(null, function() { if(!stopOnError) return Promise.resolve() })
            .then(fn);
            return p
        }
    }

    /**
     * Removes the event listener added by the constructor. This should be called whenever a component unrenders.
     * You should not need to call this if you are using the `useWebviewService` hook
     */
    drop = () => {
        for(var key of Object.keys(this.sent_messages)) {
            document.removeEventListener(this.subscription_id, this.sent_messages[key].event_listener)
            delete this.sent_messages[key]
        }
    }
  
    constructor(handler: (content: any) => void, unwrapper: (event: CustomEvent) => any) {
        this.handler = handler;
        this.unwrapper = unwrapper;
        this.queue = this.createPromiseQueue();
    }
}

export const narrowReturnType = (detail: Partial<Return>) => {
    if(detail.tag === 'delayedIncrement' || detail.tag === 'increment') {
        return detail?.fields?.number ? detail.fields.number : undefined
    } else if (detail.tag === 'toUpperCase') {
        return detail?.fields?.text ? detail.fields.text : undefined
    } else {
        return null
    }
}

/**
 * Returns a WebviewService instance
 * @param handler A function to handle responses from the backend.
 */
export function useWebviewService(handler: (content: Return) => any): WebviewService;

/**
 * Returns a WebviewService instance
 * @param handler A function to handle responses from the backend.
 * @param unwrapper Optional function to expose the CustomEvent received from the backend. Should return the value that is passed to `handler` as `content`
 */
export function useWebviewService<T>(handler: (content: T) => void, unwrapper: (event: CustomEvent) => T): WebviewService;

export const useWebviewService = (handler?: (content: Return) => any, unwrapper?: (event: CustomEvent) => Return): WebviewService => {
    const defaultUnwrapper = (event: CustomEvent) => {
        return event.detail.inner as Return
    }

    unwrapper = unwrapper ? unwrapper : defaultUnwrapper

    const service = new WebviewService(narrowReturnType, unwrapper)
    useEffect(() => {

        return () => {
            service.drop()
        }
    }, [])
    return service
}
  
export function useBoxedState<S>(initialState: S | (() => S)): [{value: S}, (value: S | ((prevState: S) => S)) => void] {
    const [internalState, setInternalState] = useState(initialState)
    const box = { value: internalState }

    function setExternalState (value: S | ((prevState: S) => S)) {
        if(value instanceof Function) {
            box.value = value(box.value);
        } else {
            box.value = value
        }
        setInternalState(value)
    }

    return [box, setExternalState]
}
