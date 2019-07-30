let getTotal = (data) => {

    let total = 0
    for (let r of data) {
        total += r.amount
    }

    return total
}
let getTotalAmount = (collection) => {
    return collection.aggregate([{
        $group: {
            total: { $sum: "$amount" },
            _id: "total"
        }
    }]).toArray()
}

module.exports = {
    get_total: getTotalAmount
}

