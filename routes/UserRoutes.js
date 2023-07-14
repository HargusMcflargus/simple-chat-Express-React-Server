const express = require('express')
const router = express.Router()

router.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(process.env.DATABASE_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Create User
router.post("/register", async ( request, response ) => {
    try{
        await client.connect()
        const db = client.db('chats')
        const newuser = await db.collection('users').insertOne({
            username: request.body.username,
            password: request.body.password
        })
        response.json(newuser)
        // {
        //     "acknowledged": true,
        //     "insertedId": 
        // }
    } catch( e ) {
        response.status(401).json(e)
    } 
})

// Auth User
router.post("/auth", async ( request, response ) => {
    try{
        await client.connect()
        const db = client.db('chats')
        await db.collection("users").find({
            username: request.body.username,
            password: request.body.password
        }).limit(1).toArray().then( document => {
            response.json(document)
        })
    } catch( e ) {
        console.log( e )
    } 
})


module.exports = router