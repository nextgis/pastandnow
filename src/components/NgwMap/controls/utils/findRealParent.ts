export default (firstVueParent) => {
  let found = false;
  while (!found) {
    if (firstVueParent.webMap === undefined) {
      firstVueParent = firstVueParent.$parent;
    } else {
      found = true;
    }
  }
  return firstVueParent;
};
