var express = require('express');
var router = express.Router();
var OAuth = require("./../bin/aerohive/api/oauth");
var devAccount = require("../config").devAccount;


router.get('/reg', function (req, res) {
    if (req.session) {
        if (req.query.error) {
            consoole.log(req.query.error);
        } else if (req.query.code) {
            var code = req.query.code;
            OAuth.getPermanentToken(code, devAccount, function (data) {
                console.log(data);
                console.log("===============");
                if (data.error) console.log(data.error);
                else if (data.data) {
                    for (var owner in data.data) {
                        req.session.xapi = {
                            rejectUnauthorized: true,
                            vpcUrl: data.data[owner].vpcUrl.replace("https://", ""),
                            ownerId: data.data[owner].ownerId,
                            accessToken: data.data[owner].accessToken,
                            hmngType: "public"
                        };

                    }
                    console.log(req.session.xapi);
                    res.redirect('/web-app/');
                }
            });
        } else console.log("Unknown error");
    } else res.redirect("/");    
});

module.exports = router;