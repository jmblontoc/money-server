let getTotalAmount = (collection) => {
    return collection.aggregate([{
        $group: {
            total: { $sum: "$amount" },
            _id: "total"
        }
    }]).toArray()
}

const credentials = {
    user: 'mrboristhecat@gmail.com',
    pass: 'googlehelper'
}

let setupMail = (mailer, subject, content) => {

    let transporter = mailer.createTransport({
        service: 'gmail',
        auth: credentials
    })

    let mailOptions = {
        from: 'dev.jmlontoc@gmail.com',
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
                                    you have spent a total of <strong> Php $CURRENT_MONTH_TOTAL </strong></p>`

module.exports = {
    get_total: getTotalAmount,
    setupMail,
    createHTMLtable,
    getTotalCurrentMonthHTML
}

