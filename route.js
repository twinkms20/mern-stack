const express = require("express")
const reqFilter = require("./middleware")
const route = express.Router()
const app = express()

route.use(reqFilter)
// app.use(reqFilter)

app.get("/", (req, res) => {
    res.send("welcome to HOME")
})

app.get("/about", (req, res) => {
    res.send("welcome to ABOUT")
})

route.get("/contact", (req, res) => {
    res.send("welcome to CONTACT")
})

app.use("/", route)

app.listen(9000)

