export type EventCleanup = () => boolean;
export type EventTargetInput<E extends Element = Element> = string | E;

type RegisteredListener = { listener: EventListener; capture: boolean };
const listenerRegistry = new WeakMap<Element, Map<string, RegisteredListener>>();

function isElement(value: unknown): value is Element {
  return typeof Element !== "undefined" && value instanceof Element;
}

function resolveElement<E extends Element>(input: EventTargetInput<E>): E | null {
  if (isElement(input)) return input as E;
  if (typeof document === "undefined") return null;
  try { return document.querySelector<E>(input); } catch { return null; }
}

function captureFrom(options?: boolean | AddEventListenerOptions): boolean {
  return typeof options === "boolean" ? options : options?.capture ?? false;
}

function removeRegisteredListener(element: Element, eventType: string): boolean {
  const listeners = listenerRegistry.get(element);
  const registered = listeners?.get(eventType);
  if (!registered) return false;
  element.removeEventListener(eventType, registered.listener, registered.capture);
  listeners?.delete(eventType);
  if (listeners?.size === 0) listenerRegistry.delete(element);
  return true;
}

export function easyEventListener<E extends Element, K extends keyof GlobalEventHandlersEventMap>(input: EventTargetInput<E>, eventType: K, handler: (this: E, event: GlobalEventHandlersEventMap[K]) => unknown, options?: boolean | AddEventListenerOptions): EventCleanup | null;
export function easyEventListener<E extends Element>(input: EventTargetInput<E>, eventType: string, handler: (this: E, event: Event) => unknown, options?: boolean | AddEventListenerOptions): EventCleanup | null;
export function easyEventListener<E extends Element>(input: EventTargetInput<E>, eventType: string, handler: (this: E, event: Event) => unknown, options?: boolean | AddEventListenerOptions): EventCleanup | null {
  const element = resolveElement(input);
  if (!element || typeof handler !== "function") return null;
  removeRegisteredListener(element, eventType);
  const listener: EventListener = function (event) { handler.call(element, event); };
  const listeners = listenerRegistry.get(element) ?? new Map<string, RegisteredListener>();
  element.addEventListener(eventType, listener, options);
  listeners.set(eventType, { listener, capture: captureFrom(options) });
  listenerRegistry.set(element, listeners);
  return () => removeRegisteredListener(element, eventType);
}

export namespace easyEventListener {
  export function remove<E extends Element>(input: EventTargetInput<E>, eventType: string): boolean {
    const element = resolveElement(input);
    return element ? removeRegisteredListener(element, eventType) : false;
  }
}
