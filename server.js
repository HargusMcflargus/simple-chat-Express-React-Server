const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const port = 5000
app.use(cors())
app.use(express.json())

const UserRouter = require('./routes/UserRoutes')
app.use("/users", UserRouter)

const MessageRouter = require("./routes/MessageRoutes")
app.use("/message", MessageRouter)

const InterfaceRouter = require("./routes/InterfaceRoutes")
app.use("/interface", InterfaceRouter)

app.listen(port, ( ) => {
    console.log('API listening on ' + port)
})