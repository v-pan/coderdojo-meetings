# coderdojo-meetings

## Development Setup

  1. Install dependencies with `yarn install`
  2. Install `wasm-pack` from [here](https://rustwasm.github.io/wasm-pack/installer/)
  3. Run `yarn run build`. The first build may take a while, but subsequent builds will be much faster.
  
This will generate TS types from Rust types for you, and helps with [RLS](https://github.com/rust-lang/rls-vscode), as well as being able to run `cargo build` without re-packaging

## Running the application

  1. Run `yarn start`

  2. Alternatively, you can also serve the frontend only using `parcel index.html`. This can help debug issues with the frontend, as it will not be inlined

## Distribution

  - See the [WebView README](https://github.com/Boscop/web-view/blob/master/README.md) for details on platforms
  - Compiles to `target/coderdojo-meetings` on Linux, which can be distributed standalone
  - Additional steps are required for Windows and MacOS
