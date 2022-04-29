const db = require('../config/database');
const sendEmail = require('./email')
const randtoken = require('rand-token')

const reset_password_email = async function (req, res, next) {

    var email = req.body.email;

    //console.log(sendEmail(email, fullUrl));

    var sql = 'SELECT * FROM users WHERE email = ?'

    await db.all(sql, email, (err, result) => {
        if (err) {
            res.status(402).json({ "error": err.message });
            return;
        }

        var type = ''
        var msg = ''

        // console.log(result[0]);

        if (result[0].email.length > 0) {

            var token = randtoken.generate(20);

            var sent = sendEmail(email, token);

            if (sent != '0') {

                var data = {
                    token: token
                }

                var sql1 = 'UPDATE users SET email = COALESCE(?,Email) WHERE email = ?' 

                db.run( sql1, email, data, (err, result) => {
                    if (err) throw err

                })

                db.run(
                    `UPDATE users set  
                       token = COALESCE(?,token)
                       WHERE email = ?`,
                    [data.token, req.body.email],
                     (err, result) => {
                        if (err) {
                            res.status(400).json({ "error": res.message })
                            return;
                        }
                        // res.json({
                        //     message: "success",
                        //     data: data,
                        //     changes: this.changes
                        // })
                    });

                type = 'success';
                msg = 'The reset password link has been sent to your email address';

            } else {
                type = 'error';
                msg = 'Something goes to wrong. Please try again';
            }

        } else {
            console.log('2');
            type = 'error';
            msg = 'The Email is not registered with us';

        }

        // req.flash(type, msg);
        res.redirect('/');
    });
}

module.exports = reset_password_email