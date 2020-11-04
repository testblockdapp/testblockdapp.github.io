// user transfer
function userTransfer() {
    let toAddress = $('.user-transfer-to-add')[0].value
    let amount = $('.user-transfer-amount')[0].value

    if (!amount || !mainContract) return

    $('.btn-usertransfer-load')[0].style.display = "block"
    $('.btn-usertransfer-txt')[0].innerHTML = ""

    mainContract.methods.transfer(toAddress, parseInt(parseFloat(amount) * DESI)).send({
        from: user.address,
        shouldPollResponse: false
    }).then(res => {
        setTimeout(() => {
            getUserBalance()
        }, 7 * 1000)
    }).catch(err => {
        console.error(err, "er")
    }).finally(res => {
        $('.btn-usertransfer-load')[0].style.display = "none"
        $('.btn-usertransfer-txt')[0].innerHTML = "Transfer T2X"
    })
}

window.addEventListener('load', function () {
    setInterval(() => {
        if (user.address) $('.ins-23')[0].value = user.address
    }, 1000)
})

let itemsiCount = 8

function loadMoreItt() {
    itemsiCount += 5
    refreshMyTransfers()
}

function refreshMyTransfers() {
    if (!user.address) return

    let httpReq_a = new XMLHttpRequest()
    httpReq_a.open("POST", "/get_my_transfers", true)
    httpReq_a.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    httpReq_a.send('address=' + user.address)

    httpReq_a.onreadystatechange = (e) => {
        if (httpReq_a.readyState !== 4 || httpReq_a.status !== 200) return
        if (httpReq_a.responseText.length < 1) return

        renderTransfers(JSON.parse(httpReq_a.responseText))
    }


    function renderTransfers(data) {
        console.log(data)
        let itms = [],
            counter = 0

        for (var i = data.length - 1; i >= 0; i--) {
            let barCol = "tb-active-row"
            if (counter % 2 == 0) barCol = "tb-nactive-row"
            counter++

            let itmHTML = `
            <div class="intro-y">
                <div class="inbox__item ${barCol} inline-block sm:block text-gray-700 bg-gray-100 border-b border-gray-200" style="border: 0px;">
                    <div class="flex px-5 py-3" style="padding-left: .5rem;">

                        <div class="w-64 sm:w-auto truncate"
                            style="width: 20vw; text-align:center; font-weight: 900;">
                            <span class="inbox__item--highlight">${counter}</span>
                        </div>

                        <div class="w-64 sm:w-auto truncate"
                            style="width: 60vw; text-align:center; font-weight: 900;">
                            <span class="inbox__item--highlight">${data[i].amount}</span>
                        </div>

                        <div class="w-64 sm:w-auto truncate"
                            style="width: 90vw; text-align:center; padding-left: 10px;">
                            <span
                                class="inbox__item--highlight">${data[i].from_address}</span>
                        </div>

                        <div class="w-64 sm:w-auto truncate"
                            style="width: 90vw; text-align:center; padding-left: 10px;">
                            <span
                                class="inbox__item--highlight">${data[i].to_address}</span>
                        </div>

                        <div class="w-64 sm:w-auto truncate"
                            style="width: 80vw; text-align:center; font-weight: 900;">
                            <span class="inbox__item--highlight">${getTimeUTC(parseInt(data[i].date), true)}</span>
                        </div>

                    </div>
                </div>
            </div>
            `

            itms.push(itmHTML)
        }


        $('.recent-transfers-body')[0].innerHTML = ""
        itms = itms.splice(0, itemsiCount)

        itms.forEach(itm => {
            $('.recent-transfers-body')[0].innerHTML += itm
        })
    }
}

window.addEventListener('load', function () {
    setTimeout(() => {
        refreshMyTransfers()
    }, 1500)
})

function getTimeUTC(_d, returnDay) {
    let d = new Date(parseInt(_d))

    let c1 = (d.getHours()).toString()
    let c2 = (d.getMinutes()).toString()
    let c22 = (d.getSeconds()).toString()
    let c3 = (d.getMonth()).toString()
    let c4 = (d.getDate() + 1).toString()
    let c5 = (d.getFullYear()).toString()

    if (c1.length == 1) c1 = "0" + c1
    if (c22.length == 1) c22 = "0" + c22
    if (c2.length == 1) c2 = "0" + c2
    if (c3.length == 1) c3 = "0" + c3
    if (c4.length == 1) c4 = "0" + c4

    if (returnDay) {
        return c1 + ":" + c2 + "  " + c3 + "/" + c4
    } else {
        return c1 + ":" + c2 + ":" + c22
    }

}