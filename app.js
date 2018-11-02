const express = require("express")
const app = express()
const path = require("path")

app.use(express.static('public'))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public","html","index.html"))
})

app.use((err, req, res, next) => {
    console.error("Error!!!")
    console.error(err)
    res.status(500)
})

app.listen(3000)