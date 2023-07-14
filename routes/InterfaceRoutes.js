const express = require("express")
const router = express.Router()
const cors = require("cors")

router.use(express.json())
router.use(cors())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const client = new MongoClient(process.env.DATABASE_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

router.get("/getChatHeads/:id", async (request, response) => {
    try {
        await client.connect()
        const db = client.db('chats')
        await db.collection('messages').find({
            $or: [
                {
                    sender: request.params.id
                },
                {
                    receiver: request.params.id
                }
            ]
        }).sort({ dateTime: -1 }).toArray().then( ( documentRef ) => {

            let thing = []
            let flags = []
            documentRef.forEach( ( document ) => {
                let uniqueID = request.params.id === document.sender ? document.receiver : document.sender
                if( !flags.includes(uniqueID) ) {
                    thing.push(document)
                    flags.push(uniqueID)
                }
            })

            response.json(thing)
        })
    } catch (e) {
        response.json(e)
    }
})

router.get("/getContacts", async (request, response) => {
    try {
        await client.connect()
        const db = client.db('chats')
        await db.collection('users').find({}).sort({ username: -1 }).toArray()
            .then( ( documentRef ) => {
                response.json(documentRef)
            })
    } catch (e) {
        response.json(e)
    }
})

router.get("/getHistory/:current/:id", async (request, response) => {
    try {
        await client.connect()
        const db = client.db('chats')
        await db.collection('messages').find({
            $or: [
                {
                    $and: [
                        {
                            sender: request.params.id
                        },
                        {
                            receiver: request.params.current
                        }
                    ]
                },
                {
                    $and: [
                        {
                            sender: request.params.current
                        },
                        {
                            receiver: request.params.id
                        }
                    ]
                }
            ]
        }).sort({ dateTime: 1 }).toArray().then( ( documentRef ) => {

            response.json(documentRef)
        })
    } catch (e) {
        response.json(e)
    }
})


router.get("/getMessages/:id", async (request, response) => {
    try {
        await client.connect()
        const db = client.db('chats')
        await db.collection('messages').find({
            $or: [
                {
                    sender: request.params.id
                },
                {
                    receiver: request.params.id
                }
            ]
        }).sort({ dateTime: 1 }).toArray().then( ( documentRef ) => {
            response.json(documentRef)
        })
    } catch (e) {
        response.json(e)
    }
})

module.exports = router