/* eslint-disable @typescript-eslint/no-explicit-any */
export default function throttle(
  fn: (...args: any[]) => void,
  time: number,
  context?: Record<string, any>,
): (...args: any[]) => void {
  let lock = false;
  let args: any[] | null = null;

  function later() {
    // reset lock and call if queued
    lock = false;
    if (args) {
      wrapperFn.apply(context, args);
      args = null;
    }
  }

  function wrapperFn(this: any, ...innerArgs: any[]) {
    if (lock) {
      // called too soon, queue to call later
      args = innerArgs;
    } else {
      // call and lock until later
      fn.apply(context || this, innerArgs);
      setTimeout(later, time);
      lock = true;
    }
  }

  return wrapperFn;
}
