export default function throttle(
  fn: (...args: any[]) => void,
  time: number,
  context?: Record<string, any>,
): () => void {
  let lock: boolean;
  let args: any;

  function later() {
    // reset lock and call if queued
    lock = false;
    if (args) {
      wrapperFn.apply(context, args);
      args = false;
    }
  }

  function wrapperFn() {
    if (lock) {
      // called too soon, queue to call later
      args = arguments;
    } else {
      // call and lock until later
      //@ts-ignore
      fn.apply(context, arguments);
      setTimeout(later, time);
      lock = true;
    }
  }

  return wrapperFn;
}
