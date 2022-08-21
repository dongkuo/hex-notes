function exec(func) {
  if (func instanceof Function) {
    func.apply(this, Array.prototype.slice.call(arguments, 1))
  }
}

export { exec }