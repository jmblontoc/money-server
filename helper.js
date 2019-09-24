const fs = require('fs')
const mailer = require('nodemailer')

let getTotalAmount = (collection) => {
    return collection.aggregate([{
        $group: {
            total: { $sum: "$amount" },
            _id: "total"
        }
    }]).toArray()
}

const credentials = {
    user: process.env.BORIS_EMAIL,
    pass: process.env.BORIS_PASS
}

let setupMail = (mailer, subject, content) => {

    let transporter = mailer.createTransport({
        service: 'gmail',
        auth: credentials
    })

    let mailOptions = {
        from: process.env.BORIS_EMAIL,
        to: ['jmlontoc4@gmail.com'],
        subject: subject,
        html: content
    }

    return { transporter, mailOptions }
}

let createHTMLtable = (data) => {

    let html = `<table border='1' style='border-collapse: collapse;'>
    <tr><th style='padding: 5px;'>Item</th>
    <th style='padding: 5px;'>Description</th>
    <th style='padding: 5px;' align='right'>Time</th>
    <th align='right' style='padding: 5px;'>Amount</th></tr>`

    for (let i of data) {

        html +=
            `
            <tr>
                <td>${i.title}</td>
                <td>${i.description}</td>
                <td align="right">${i.date}</td>
                <td align="right">${i.amount}</td>
            </tr>
            `
    }

    html += '</table>'

    return html
}

const getTotalCurrentMonthHTML = `<p style="margin-top: 20px;">For the current month, 
                                    you have spent a total of 
                                    <strong> Php $CURRENT_MONTH_TOTAL 
                                    </strong></p>`

let sendDailyEmail = (data, totalCurrentMonth) => {

    fs.readFile('./email/daily-report.html', "utf8", (err, info) => {
        if (err) {
            console.log(err)
            return false
        }

        info = info.split("$DAILY_TOTAL").join(data.dailyTotal)

        let tableData = createHTMLtable(data.recordsToday)
        let currMonthHTML = getTotalCurrentMonthHTML

        currMonthHTML = currMonthHTML.split("$CURRENT_MONTH_TOTAL").join(totalCurrentMonth)

        let content = info + tableData + currMonthHTML
        let mail = setupMail(mailer, 'Daily Expense Report', content)

        mail.transporter.sendMail(mail.mailOptions, (err) => {
            if (err) {
                console.log(err)
                return false
            }

            console.log("Sent email")
        })
    })
}

module.exports = {
    get_total: getTotalAmount,
    setupMail,
    createHTMLtable,
    getTotalCurrentMonthHTML,
    sendDailyEmail
}