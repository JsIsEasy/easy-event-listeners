# easy-events

`easy-events` is a small TypeScript-first helper for DOM event listeners.

It solves the repetitive cleanup work around native `addEventListener`. In real UI code you often need to find an element, guard against a missing selector, keep the exact callback reference, remember the matching listener options, and remove the listener later. This package keeps that lifecycle close to the code that attaches the listener.

## Install

```bash
npm install easy-events
```

## The Problem

Native `addEventListener` is powerful, but cleanup depends on passing the same callback reference back to `removeEventListener`.

```ts
const button = document.querySelector<HTMLButtonElement>("#save");

if (button) {
  const onClick = (event: MouseEvent) => {
    console.log("Saved", event.clientX);
  };

  button.addEventListener("click", onClick);

  // Later, you must still have the same callback reference.
  button.removeEventListener("click", onClick);
}
```

That is fine for one listener. It gets noisier when listeners are attached inside setup functions, conditionally mounted UI, examples, demos, or small widgets that need simple teardown.

## The Same Flow With easy-events

```ts
import { easyEventListener } from "easy-events";

const cleanup = easyEventListener("#save", "click", function (event) {
  // `this` is the button, and `event` is a MouseEvent.
  console.log(this, event.clientX);
});

// Later, keep teardown close to setup.
cleanup?.();
```

You can also remove the managed listener by selector and event type:

```ts
easyEventListener.remove("#save", "click");
```

## Why Use This Instead Of Native addEventListener?

- It accepts either a CSS selector or an existing element.
- It returns a cleanup function immediately.
- It remembers the callback reference internally for `easyEventListener.remove`.
- It replaces the previous managed listener for the same `element + event type`, which helps avoid accidental duplicate handlers.
- It returns `null` instead of throwing when a selector cannot be resolved.
- It includes TypeScript types for common DOM events, so `"click"` handlers get a `MouseEvent`, `"keydown"` handlers get a `KeyboardEvent`, and so on.

## API

```ts
const cleanup = easyEventListener(target, eventType, handler, options);
```

`target` can be a CSS selector or an `Element`. The return value is `null` when the target cannot be resolved. Otherwise it is a cleanup function. Calling cleanup more than once is safe, and it returns `true` only when it actually removes a listener.

Browser listener options are supported as the fourth argument:

```ts
easyEventListener(button, "click", onClick, { passive: true });
```

The relevant `capture` value is stored with the listener, so cleanup uses the same capture behavior that was used during registration.

## Browser Example

Build the package first, then open `example/index.html` in a browser:

```bash
npm run build
```

The example compares native listener management with `easy-events` side by side.
