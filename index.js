//1. I have to take care of this inside the function, it should be handled properly.
//2. No duplicate events can be attached of same type to a same element.
//3. Event can be removed from anywhere
//4. Function should expect query or element itself.
//5. Should be able to handle `this` properly.

function checkIsHtmlElement(suspect) {
  return suspect instanceof HTMLElement;
}

function checkIamFunction(func) {
  return typeof func === "function";
}

function wrapperFunction(fn, ...args) {
  return fn.apply(null, args);
}

function attachListeners(element, event, func) {
  const wrapper = () => func(event);

  element.addEventListener(event, wrapper);
  easyEventListener.listenerStorage.set({ element, event }, wrapper);
}

function initStorage() {
  if (!easyEventListener.listenerStorage) {
    easyEventListener.listenerStorage = new Map();
  }
}

function initRemoveEvent() {
  if (easyEventListener.remove) {
    return;
  }

  easyEventListener.remove = function (queryOrElement, ev) {
    const isHTMLElement = checkIsHtmlElement(queryOrElement);

    const elementInQuestion = isHTMLElement ? queryOrElement : document.querySelector(queryOrElement);

    if (!elementInQuestion || !elementInQuestion instanceof HTMLElement) {
      return "Cannot remove event as it can nowhere to be found.";
    }

    // Make it faster
    easyEventListener.listenerStorage.find((value, keys, v2) => {
      const { element, event } = keys;
      if (element.isSameNode(ele) && event == ev) {
        element.removeEventListener(ev, value);
      }
    });
  };
}

function easyEventListener(queryOrElement, event, func) {
  initStorage();
  initRemoveEvent();

  const isHTMLElement = checkIsHtmlElement(queryOrElement);

  const isFunction = checkIamFunction(func);

  if (!isFunction) return null;

  const elementInQuestion = isHTMLElement ? queryOrElement : document.querySelector(queryOrElement);

  if (!elementInQuestion || !elementInQuestion instanceof HTMLElement) {
    return null;
  }

  attachListeners(elementInQuestion, event, func);

  return removeEventListener;
};