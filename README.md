# easy-events

A small TypeScript-first helper for DOM event listeners. It accepts a CSS
selector or an element and retains the callback reference needed for cleanup.

## Install

```bash
npm install easy-events
```

## Usage

```ts
import { easyEventListener } from "easy-events";

const cleanup = easyEventListener("#save", "click", function (event) {
  // `this` is the button, and `event` is a MouseEvent.
  console.log(this, event.clientX);
});

cleanup?.();
easyEventListener.remove("#save", "click");
```

`easyEventListener` returns `null` if its selector cannot be resolved.
Otherwise, it returns a cleanup function. The cleanup is safe to call more than
once and returns `true` only when it removes a registered listener.

Only one listener for a given `element + event type` pair is managed at a time.
Registering another listener for that pair replaces the earlier listener.

Browser listener options are supported as a fourth argument:

```ts
easyEventListener(button, "click", onClick, { passive: true });
```
