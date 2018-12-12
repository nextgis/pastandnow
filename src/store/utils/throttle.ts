export default function throttle(fn, time, context?) {
  let lock;
  let args;
  let wrapperFn;
  let later;

  later = function() {
    // reset lock and call if queued
    lock = false;
    if (args) {
      wrapperFn.apply(context, args);
      args = false;
    }
  };

  wrapperFn = function() {
    if (lock) {
      // called too soon, queue to call later
      args = arguments;

    } else {
      // call and lock until later
      fn.apply(context, arguments);
      setTimeout(later, time);
      lock = true;
    }
  };

  return wrapperFn;
}
