import React from "react";

export const Main = () => {
    let rust = {
        invoke: (arg: any) => { (window as any).external.invoke(JSON.stringify(arg)) },
        test: () => { rust.invoke({cmd: 'test', text: 'This is a test'}) }
    }

    return (
        <div>
            <div className="container">
                <h1>Hello World!</h1>
                <button onClick={() => { rust.test() }}>Click me to print from Rust!</button>
            </div>
        </div>
    )
}