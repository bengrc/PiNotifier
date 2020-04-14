var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PiNotifier', home: true, user: res.locals.user, params: res.params, microsoft: null});
});

// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   let params = {
//     active: { home: true }
//   };

//   res.render('index', params);
// });

// module.exports = router;

module.exports = router;
