const PER_MONTH_TEMPLATE = `<p>Hello, JM! This is your per month expense report: </p>`

const createPerMonthTable = (data) => {
    let html = `<table border='1' style='border-collapse: collapse;'>
    <tr><th style='padding: 5px;'>Month</th>
    <th align='right' style='padding: 5px;'>Amount</th></tr>`

    for (let i of data) {

        html +=
            `
            <tr>
                <td>${Object.keys(i)[0]}</td>
                <td align="right">${i[Object.keys(i)[0]]}</td>
            </tr>
            `
    }

    html += '</table>'

    return html
}

module.exports = {
    PER_MONTH_TEMPLATE,
    createPerMonthTable
}