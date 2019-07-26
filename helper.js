let getTotal = (data) => {

    let total = 0
    for (let r of data) {
        total += r.amount
    }

    return total
}

module.exports = {
    get_total: getTotal
}