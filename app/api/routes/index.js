var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// db.connect((err) => {
//   if (err) {
//     console.log('error connecting: ' + err.stack);
//     return;
//   }
//   console.log('success');
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  db.query('select * from test', (err, rows) => {
    if (!err) {
      var data = {
        content: rows
      }
      res.json({ message: data.content })
    }
  });
});

module.exports = router;