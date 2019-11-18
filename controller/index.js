const express = require("express");
const router = express.Router();
const fs = require('fs');
const {Account} = require("../model/account");
const initial = require("../model/file");

router.use("/secretary", require("./secretaryController"));
router.use("/admin", require("./adminController"));
router.use("/doctor", require("./doctorController"));

router.get("/", async (req, res) => {
    //username is subject to change
    let account = await Account.getAccountByUsername("admin");
    if(account == undefined) {
        Account.addAccount(new Account({
            username: "admin",
            password: initial.input,
            accountType: "admin",
            doctorID: "",
            lastLogin: ""
        }), (value) => {
            res.redirect("/login");
        }, (err) => {
            res.send(err);
        })
    } else {
        if(req.session.username == null) {
            res.redirect("/login");
        } else {
            let account = await Account.getAccountByUsername(req.session.username);
            if(account.accountType == "secretary") {
                res.redirect("/secretary");
            } else if(account.accountType == "admin") {
                res.redirect("/admin");
            } else if(account.accountType == "doctor") {
                res.redirect("/doctor");
            } 
        }
    }
})

router.get("/login", async (req, res) => {
    req.session.username = "admin";
    if(req.session.username != null) {
        if(req.session.username == "secretary") {
            res.redirect("/secretary");
        } else if(req.session.username == "doctor") {
    
        } else if(req.session.username == "admin") {
            res.redirect("/admin");
        }
    } else {
        let acc = await Account.getAllAccounts();
        res.render("page_templates/login_view.hbs", {
            account: JSON.stringify(acc)
        })
    }   
})

router.post("/validateLogin", async (req, res) => {
    let account = await Account.getAccountByUsername(req.body.username);
    if(account == undefined) {
        res.send({message: 0});
    } else {
        if(account.password != req.body.password) {
            res.send({message: 2});
        } else {
            req.session.username = account.accountType;
            Account.updateLogin(account.id, req.body.date);
            res.send({message: 1});
        }
    }
})

router.get("/logout", (req, res) => {
    req.session.username = null;
    res.header("Cache-Control", "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0");
    res.redirect("/login");
})

module.exports = router;