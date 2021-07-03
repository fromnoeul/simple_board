const express = require('express');
const router = express.Router({ strict: true });


//  creating user
router.get('/signup', (req, res) => {
    res.render('user_signup');
})
router.post('/signup', (req, res) => {

});

module.exports = router;