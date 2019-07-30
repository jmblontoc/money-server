const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 8181

const helper = require('./helper')

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {

    const MongoClient = require('mongodb').MongoClient
    const password = encodeURI("B.pdQ5L@c7s!Ayp")
    const uri = `mongodb+srv://sword:${password}@jmsword-5rgwp.mongodb.net/test?retryWrites=true&w=majority`
    const client = new MongoClient(uri, { useNewUrlParser: true })


    client.connect(err => {
        if (err) {
            res.json({ err: err})
        }

        res.json({
            client: client
        })
    })
})

// ADD
app.post('/v1/add-record', (req, res) => {

    let record = {
        title: req.body.title,
        description: req.body.description,
        amount: req.body.amount,
        date: (new Date()).toString()
    }

    client.connect(err => {
        if (err) {
            res.status(518).json({ err: err})
        }

        const collection = client.db("money").collection("records")
        if (!collection) {
            res.status(510).json({ msg: "no collection found" })
        }
        
        collection.insertOne(record, (err, result) => {
            if (err) {
                res.status(511).json({ err: err })
            }

            res.status(201).json({
                msg: "Successfully inserted",
                result: result
            })
        })
    })

})

// GET ALL WITH TOTAL
app.get('/v1/records', (req, res) => {

    client.connect(err => {
        if (err) {
            res.status(518).json({ err: err})
        }

        const collection = client.db("money").collection("records")
        if (!collection) {
            res.status(510).json({ msg: "no collection found" })
        }

        collection.find().sort({ date: -1 }).toArray().then(
            (resp) => {
                res.status(200).json({
                    records: resp
                })
            },
            err => {
                res.status(512).json({
                    err: err
                })
            }
        )
        
    })
})

// DELETE RECORD
app.delete("/v1/delete/:id", (req, res) => {
    
    // this is deprecated
    // db.remove({ _id: req.params.id }, {}, (err, n) => {
    //     if (err) {
    //         res.status(503).json({
    //             error: err
    //         })
    //     }

    //     res.status(201).json({
    //         message: "Successfully deleted record"
    //     })
    // })
})

// DELETE everything
app.delete("/v1/delete-all", (req, res) => {
    
    // deprecated too

    // db.remove({}, { multi: true }, (err, rows) => {
    //     if (err) {
    //         res.status(505).json({
    //             error: err
    //         })
    //     }

    //     res.status(202).json({
    //         messsage: "Successfully deleted all records",
    //         count: rows
    //     })
    // })
})

app.post('/playground', (req, res) => {
    console.log(req.body)
    res.end(() => {
        console.log('end')
    })
})

app.listen(port, () => {
    console.log(`running on port`)
})