const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 8181

const helper = require('./helper')

app.use(cors())
app.use(express.json())

let Datastore = require('nedb')
let db = new Datastore({
    filename: 'db.db',
    autoload: true
})

app.get('/', (req, res) => {
    res.send('hello there')
    res.end(() => {})
})

// ADD
app.post('/v1/add-record', (req, res) => {

    let record = {
        title: req.body.title,
        description: req.body.description,
        amount: req.body.amount,
        date: (new Date()).toString()
    }

    db.insert(record, (err, doc) => {

        if (err) {
            res.status(501).json({
                error: err
            })
        }

        res.status(201).json({
            message: "Success!",
            data: doc
        })
    })

})

// GET ALL WITH TOTAL
app.get('/v1/records', (req, res) => {

    db.find({}).sort({ date: -1 }).exec((err, data) => {
        if (err) {
            res.status(502).json({
                error: err
            })
        }

        else {

            res.status(200).json({
                records: data,
                total: helper.get_total(data)
            })
        }

        
    })
})

// DELETE RECORD
app.delete("/v1/delete/:id", (req, res) => {
    
    db.remove({ _id: req.params.id }, {}, (err, n) => {
        if (err) {
            res.status(503).json({
                error: err
            })
        }

        res.status(201).json({
            message: "Successfully deleted record"
        })
    })
})

// DELETE everything
app.delete("/v1/delete-all", (req, res) => {
    
    db.remove({}, { multi: true }, (err, rows) => {
        if (err) {
            res.status(505).json({
                error: err
            })
        }

        res.status(202).json({
            messsage: "Successfully deleted all records",
            count: rows
        })
    })
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