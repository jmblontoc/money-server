const moment = require('moment')
const fetch = require('node-fetch')

let dailyExpenseReport = async () => {

    let records = await fetch('https://money-server-api.herokuapp.com/v1/records')
    let data = await records.json()

    let items = data.records
    let formatter = "LLLL"
    let comparatorFormat = "MMDDYYYY"
    let now = moment().format(comparatorFormat)

    let recordsToday = items.filter(item => {
        let formattedDate = moment(item.date, formatter).add(8, 'h').format(comparatorFormat)
        return formattedDate === now
    })

    recordsToday.map(item => {
        item.date = moment(item.date, formatter).add(8, 'h').format("LT")
        item.description = item.description.trim() === '' ? '-- No description specified --' : item.description
        return item
    })

    let dailyTotal = recordsToday.reduce((accumulator, item) => accumulator + item.amount, 0)

    return {
        dailyTotal,
        recordsToday
    }
}


// ------------------------ EXPORTS BELOW ----------------------------------
module.exports = {
    dailyExpenseReport
}