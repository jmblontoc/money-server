const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 8181

const helper = require('./helper')
const analytics = require('./analytics')
const moment = require('moment')
const mailer = require('nodemailer')
const fs = require('fs')

app.use(cors())
app.use(express.json())

const MongoClient = require('mongodb').MongoClient
const password = encodeURI("B.pdQ5L@c7s!Ayp")
const uri = `mongodb+srv://sword:${password}@jmsword-5rgwp.mongodb.net/test?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true })

app.get('/', (req, res) => {

    client.connect(err => {
        if (err) {
            res.json({ err: err })
        }

        res.json({
            msg: 'Hello'
        })
    })
})

// ADD
app.post('/v1/add-record', (req, res) => {

    let record = {
        title: req.body.title,
        description: req.body.description,
        amount: req.body.amount,
        date: moment().format("LLLL")
    }

    client.connect(err => {
        if (err) {
            res.status(518).json({ err: err })
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
            res.status(518).json({ err: err })
        }

        const collection = client.db("money").collection("records")
        if (!collection) {
            res.status(510).json({ msg: "no collection found" })
        }

        collection.find().sort({ date: -1 }).toArray().then(
            async (resp) => {
                let total = await helper.get_total(collection)

                resp = resp.sort((a, b) => {
                    let formatter = "LLLL"
                    let formatterComparator = "YYYYMMDDHHmmss"
                    let momentA = moment(a.date, formatter).format(formatterComparator)
                    let momentB = moment(b.date, formatter).format(formatterComparator)

                    return momentB - momentA

                })

                res.json({
                    records: resp,
                    total: total[0].total
                }).status(200)
            },
            err => {
                res.status(512).json({
                    err: err
                })
            }
        )
    })
})


// DAILY EXPENSE REPORT
app.get('/v1/email/daily', async (req, res) => {

    let data = await analytics.dailyExpenseReport()
    let totalCurrentMonth = await analytics.totalCurrentMonth()

    fs.readFile('./email/daily-report.html', "utf8", (err, info) => {
        if (err) {
            res.json({ err: err }).status(599)
        }

        info = info.split("$DAILY_TOTAL").join(data.dailyTotal)

        let tableData = helper.createHTMLtable(data.recordsToday)
        let currMonthHTML = helper.getTotalCurrentMonthHTML

        currMonthHTML = currMonthHTML.split("$CURRENT_MONTH_TOTAL").join(totalCurrentMonth)

        let content = info + tableData + currMonthHTML
        let mail = helper.setupMail(mailer, 'Daily Expense Report', content)

        mail.transporter.sendMail(mail.mailOptions, (err, info) => {
            if (err) {
                res.status(520).json({ error: err })
            }

            res.status(203).json({ info: info })
        })
    })


})

app.get('/playground', async (req, res) => {

    let averages = await analytics.loadAverages()
    let dailyTotal = await analytics.loadTotalPerDay()
    let totalCurrentMonth = await analytics.totalCurrentMonth()

    res.json({
        averages,
        dailyTotal,
        totalCurrentMonth
    })
})

app.listen(port, () => {
    console.log(`running on port`)
})