function isLoggedIn(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login')
  }
  next()
}

function isAdmin(req, res, next) {
  if (req.session.role !== 'admin') {
    return res.redirect('/products')
  }
  next()
}

function isBuyer(req, res, next) {
  if (req.session.role !== 'buyer') {
    return res.redirect('/products')
  }
  next()
}

module.exports = { isLoggedIn, isAdmin, isBuyer }
