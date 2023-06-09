module.exports.setFlash = async function (req, res, next) {
  res.locals.flash = {
    success: req.flash("success"),
    error: req.flash("error"),
    signin: req.flash('signin'),
    signout: req.flash('signout')
  };
  return await next();
};
