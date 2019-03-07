export default (firstVueParent) => {
  let found = false;
  while (!found) {
    if (firstVueParent.ngwMap === undefined) {
      firstVueParent = firstVueParent.$parent;
    } else {
      found = true;
    }
  }
  return firstVueParent;
};
