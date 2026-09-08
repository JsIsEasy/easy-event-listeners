// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { easyEventListener } from "./index";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("easyEventListener", () => {
  it("passes the native event and binds this to the element", () => {
    const button = document.createElement("button");
    const handler = function (this: HTMLButtonElement, event: MouseEvent) {
      expect(this).toBe(button);
      expect(event).toBeInstanceOf(MouseEvent);
    };

    easyEventListener(button, "click", handler);
    button.click();
  });

  it("accepts a CSS selector and removes the listener via its cleanup callback", () => {
    document.body.innerHTML = '<button id="save"></button>';
    const handler = vi.fn();
    const cleanup = easyEventListener("#save", "click", handler);
    const button = document.querySelector<HTMLButtonElement>("#save")!;

    button.click();
    expect(handler).toHaveBeenCalledTimes(1);
    expect(cleanup?.()).toBe(true);
    expect(cleanup?.()).toBe(false);
    button.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("replaces a managed listener with the same event type", () => {
    const button = document.createElement("button");
    const first = vi.fn();
    const second = vi.fn();

    easyEventListener(button, "click", first);
    easyEventListener(button, "click", second);
    button.click();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("removes a listener by selector and event type", () => {
    document.body.innerHTML = '<button id="remove"></button>';
    const handler = vi.fn();
    const button = document.querySelector<HTMLButtonElement>("#remove")!;

    easyEventListener(button, "click", handler);
    expect(easyEventListener.remove("#remove", "click")).toBe(true);
    expect(easyEventListener.remove("#remove", "click")).toBe(false);
    button.click();
    expect(handler).not.toHaveBeenCalled();
  });

  it("returns null for selectors that do not resolve", () => {
    expect(easyEventListener("#missing", "click", () => undefined)).toBeNull();
    expect(easyEventListener("[", "click", () => undefined)).toBeNull();
  });
});
