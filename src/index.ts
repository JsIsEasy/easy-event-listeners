type SuspectElement<E extends HTMLElement> = string | E;

function checkIsHtmlElement<SuspectElement>(suspect: SuspectElement) {
  return suspect instanceof HTMLElement;
}

function checkIamFunction(func: Function) {
  return typeof func === "function";
}

function wrapperFunction(fn, ...args) {
  return fn.apply(null, args);
}

function attachListeners<E extends HTMLElement>(
  element: E,
  event: string, // Todo: Narrow down results
  func: Function
) {
  const wrapper = () => func(event);

  element.addEventListener(event, wrapper);
  easyEventListener.listenerStorage.set({ element, event }, wrapper);
}

export function easyEventListener<E extends HTMLElement>(
  queryOrElement: SuspectElement<E>,
  evt: string,
  func: Function
) {
  const isHTMLElement = checkIsHtmlElement<SuspectElement<E>>(queryOrElement);

  const isFunction = checkIamFunction(func);

  if (!isFunction) return null;

  const elementInQuestion = isHTMLElement ? queryOrElement : <E>document.querySelector(queryOrElement);

  if (!elementInQuestion) {
    return null;
  }

  attachListeners(elementInQuestion, evt, func);

  return removeEventListener;
}

export namespace easyEventListener {
  export const listenerStorage: Map<HTMLElement, string> = new Map();
  export const remove = function <E extends HTMLElement>(
    queryOrElement: SuspectElement<E>,
    evt: string
  ) {
    const isHTMLElement = checkIsHtmlElement(queryOrElement);

    const elementInQuestion = isHTMLElement ? queryOrElement : <E>document.querySelector(queryOrElement);

    if (!elementInQuestion) {
      return "Cannot remove event as it can nowhere to be found.";
    }

    // Make it faster
    for (let [element, value] of easyEventListener.listenerStorage.entries()) {
      if (elementInQuestion.isSameNode(element) && value == evt) {
        element.removeEventListener(evt, value);
        break;
      }
    }
  };
}
