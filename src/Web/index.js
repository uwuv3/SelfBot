import express, { urlencoded } from "express";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import { Strategy } from "passport-local";
import { Database } from "nukleon";
import { readFileSync } from "fs";
import { renderFile } from "ejs";
import * as expressLayouts from "express-ejs-layouts";

const users = new Database("./src/Web/Database/users.json");
const config = new Database("./.settings.json");
const db = new Database("./database.json");
const app = express();
const port = process.env.PORT || config.get("webserver").defaultPORT || 1234;
const secret = generatePassword();



app.use(express.static("src/Web/Public"));
app.set("view engine", "ejs");
app.set("views", "src/Web/Views");
app.use(urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET || secret,
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 604800000 },
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(
    new Strategy({ usernameField: "username" }, (username, passport, done) => {
        const user = users.get(username)
        if (!user) {
            return done(null, false, { message: "User not found or Incorrect password" });
        }
        if (passport === user) {
            logger.log(`WebServer => Anyone Logged in as ${username}`);
            return done(null, { username: username, password: user });
        } else {
            return done(null, false, { message: "User not found or Incorrect password" });
        }
    })
)
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
app.use(flash());
app.use(async function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg") ?? req.query.success_msg;
    res.locals.error_msg = req.flash("error_msg") ?? req.query.error_msg;
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    res.locals.user_client = await clientManager()
    next();
});
app.post("/login", async (req, res, next) => {
    logger.log(`WebServer => ${req.ip} Trying to login`)
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/",
        failureFlash: true,
    })(req, res, next);
});
app.get("/logout", async (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error_msg", "You are not authenticated");
        return res.redirect("/")
    }
    const user = req.user
    await req.logout({ keepSessionInfo: false }, async (error) => {
        if (error) {
            req.flash("error", error);
            res.redirect("/");
        } else {
            req.flash("success_msg", "Successfully logged out");
            logger.log(`Webserver => ${req.ip} Logged out as ${user.username}`)

            res.redirect("/");
        }
    });

    return;
})
//Website

app.get("/", (req, res, next) => {
    if (!req.isAuthenticated()) res.render("index.ejs");
    else res.redirect("/dashboard");
})
app.get("/dashboard", (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error_msg", "You are not authenticated");
        return res.redirect("/")
    }
    res.render("dashboard")
})

const listenner = app.listen(port, function () {
    logger.log(`WebServer => Secret is ${secret}`)
    logger.log(`WebServer => Listening on ${listenner.address().address} ${listenner.address().port}`);
})




/*
web.get("*", async (req, res, next) => {
    if (!req.isAuthenticated()) res.render("index.html");
    else {
        if (req.query.q === "log" || req.query.log == "")
            return res.render("log.html", {
                file: await readFileSync("./database/logging.txt", {
                    encoding: "utf8",
                }),
            });



        if (req.query.q === "logout" || req.query.logout == "") {
            const user = req.user
            await req.logout({ keepSessionInfo: false }, async (error) => {
                if (error) {
                    req.flash("error", error);
                    res.redirect(200, "/");
                } else {
                    req.flash("success_msg", "Successfully logged out");
                    logging(`Logged out as ${user.username}/${req.ip}`)

                    res.redirect(200, "/");
                }
            });

            return;
        }
        res.render("dashboard.html");
    }
});

web.post("/login", async (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/",
        failureFlash: true,
    })(req, res, next);
});

*/
async function clientManager() {
    let w = true
    let i = 0
    const ping = db.get("wsPing");
    if (config.get("client").enabled === false) return { avatarURL: "/img/null.png", tag: "Client is not enabled", ping: await ping }
    while (w) {
        i++
        if (await db.get("clientReady") === "true") {
            w = false
            const res = {
                avatarURL: client.user.avatarURL(), tag: client.user.tag, ping: await ping
            }
            return res
        } else {
            if (i >= 1000) {
                const res = {
                    avatarURL: "/img/null.png", tag: "undefined#0000", ping: await ping
                }
                return res
            } else {
                continue
            }
        }
    }
}
function generatePassword(length = 8) {
    let charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}
