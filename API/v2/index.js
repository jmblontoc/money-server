const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3001

require('dotenv').config()

const moment = require('moment-timezone')
const fs = require('fs')
const fetch = require('node-fetch')

const MongoClient = require('mongodb').MongoClient
const password = encodeURI("B.pdQ5L@c7s!Ayp")
const uri = `mongodb+srv://sword:${password}@jmsword-5rgwp.mongodb.net/test?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
const ObjectId = require('mongodb').ObjectId

app.use(cors())
app.use(express.json())

/** endpoints */
app.get('/', (req, res) => {
    res.send("This is money server api v2")
})

/** RECORDS */

// Retrieve records
app.get('/v2/records', (req, res) => {
    client.connect(err => {
        if (err) {
            res.status(500).json({ err })
        }

        const collection = client.db("money").collection("records_v2")
        if (!collection) {
            res.status(500).json({ msg: "No collection found" })
        }

        collection.find().toArray().then(
            resp => {

                let total = resp.reduce((accumulator, { amount }) => accumulator + amount, 0)

                res.status(200).json({
                    records: resp.reverse(),
                    total
                })

                res.end()
            }
        ).catch(error => res.status(500).json({ error }))
    })
})

// Add a record
app.post('/v2/records', (req, res) => {
    let record = {
        title: req.body.title,
        description: req.body.description,
        amount: req.body.amount,
        date: moment().tz('Asia/Manila').format("LLLL")
    }

    client.connect(err => {
        if (err) {
            res.status(500).json({ err })
        }

        const collection = client.db("money").collection("records_v2")
        if (!collection) {
            res.status(500).json({ msg: "no collection found" })
        }

        collection.insertOne(record, (err, result) => {
            if (err) {
                res.status(500).json({ err })
            }

            res.status(200).json({
                msg: "Successfully inserted",
                result: result
            })
        })
    })
})

// Delete a record
app.delete('/v2/records', (req, res) => {

    let id = req.query.id

    client.connect(err => {
        if (err) {
            res.status(500).json({ err })
        }

        const collection = client.db("money").collection("records_v2")
        if (!collection) {
            res.status(500).json({ msg: "no collection found" })
        }

        let filter = { _id: ObjectId(id) }
        collection.deleteOne(filter, (err, result) => {
            if (err) {
                res.status(500).json({ err })
            }
            res.status(200).json({ result })
        })
    })
})

// Update a record
app.put('/v2/records', (req, res) => {
    let id = req.query.id
    let title = req.body.title
    let description = req.body.description
    let amount = req.body.amount
    let date = req.body.date

    client.connect(err => {
        if (err) {
            res.status(500).json({ err })
        }

        const collection = client.db("money").collection("records_v2")
        if (!collection) {
            res.status(500).json({ msg: "no collection found" })
        }

        let filter = { _id: ObjectId(id) }
        let updates = { title, description, amount, date }

        collection.updateOne(filter, { $set: updates }, (err, result) => {
            if (err) {
                res.status(500).json({ err })
            }
            res.status(200).json({ result })
        })
    })
})

/** listen */
app.listen(port, () => {
    console.log(`App is running on port ${port}`)
})
