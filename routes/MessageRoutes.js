const express = require("express")
const router = express.Router()
const cors = require("cors")

router.use(cors())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const client = new MongoClient(process.env.DATABASE_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

router.post("/send", async ( request, response ) => {
    try{
        await client.connect()
        const db = client.db('chats')
        const newMessage = await db.collection('messages').insertOne({
            dateTime: new Date().getTime(),
            message: request.body.message,
            sender: request.body.sender,
            receiver: request.body.receiver,
            senderDisplayName: request.body.senderDisplayName,
            receiverDisplayName: request.body.receiverDisplayName
        })
        response.json(newMessage)
        // {
        //     "acknowledged": true,
        //     "insertedId": 
        // }
    } catch( e ) {
        response.json(e)
    } 
})

router.delete("/del", async ( request, response ) => {
    try{
        await client.connect()
        const db = client.db('chats')
        const operation = await db.collection("messages").deleteOne({
            _id: ObjectId( request.body._id )
        })
        response.send(operation).status(201)
    }catch( e ) {
        response.send( e ).status(401)
    }
})

module.exports = router