function wrapAsync(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  };
}

// //custom 500 page

module.exports = wrapAsync;