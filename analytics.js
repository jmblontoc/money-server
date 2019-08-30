const moment = require('moment')
const fetch = require('node-fetch')
const formatter = "LLLL"

let dailyExpenseReport = async () => {

    let records = await fetch('https://money-server-api.herokuapp.com/v1/records')
    let data = await records.json()

    let items = data.records
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

let loadTotalPerDay = async () => {

    let records = await fetch('https://money-server-api.herokuapp.com/v1/records')
    let data = await records.json()
    let items = data.records

    items.map(item => {
        if (item.is_old) {
            item.date = moment(item.date, formatter).format("LL")
        }
        else {
            item.date = moment(item.date, formatter).add(8, 'h').format("LL")
        }
        return item
    })

    let aggregatedData = {}
    for (let item of items) {
        if (aggregatedData.hasOwnProperty(item.date)) {
            aggregatedData[item.date] += item.amount
        }
        else {
            aggregatedData[item.date] = item.amount
        }
    }

    return aggregatedData
}

let loadAverages = async () => {

    let core = {}

    let records = await fetch('https://money-server-api.herokuapp.com/v1/records')
    let data = await records.json()
    let items = data.records

    core['dailyAverage'] = data.total /items.length

    items = items.map(item => {
        item.is_old ? item.date = moment(item.date, formatter).format("dddd") : 
                    item.date = moment(item.date, formatter).add(8, 'h').format("dddd")

        return item
    })

    let perDayTotal = {}
    for (let item of items) {
        if (perDayTotal.hasOwnProperty(item.date)) {
            perDayTotal[item.date] += item.amount
        }
        else {
            perDayTotal[item.date] = item.amount
        }
    }

    core['perDayTotal'] = perDayTotal

    return core
}


// ------------------------ EXPORTS BELOW ----------------------------------
module.exports = {
    dailyExpenseReport,
    loadTotalPerDay,
    loadAverages
}