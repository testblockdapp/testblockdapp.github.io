// state = 1: == open to enter || state = 2: ready to collect || state = 3: == ended
let lobbies = []

function run_Auction() {
    getTodayLobby()
    getPastLobbies()
}

setInterval(() => {
    getTodayLobby()
}, 1000 * 20)

function getTodayLobby() {
    $('.fi-1')[0].innerHTML = "#" + currentDay

    $('.fi-2')[0].innerHTML = abbreviate_number(calcDaysLobbyPayout(currentDay) / DESI, 2)

    let daysTotalUsersEntry = 0
    mainContract.methods.xfLobby(currentDay).call({
        shouldPollResponse: true,
    }).then(res => {
        daysTotalUsersEntry = parseFloat(res)
        $('.fi-4')[0].innerHTML = ((calcDaysLobbyPayout(currentDay)) / (daysTotalUsersEntry / 10e9)).toFixed(2)
                          
    })

    let totalUserEntryETH = 0
    // how many times entered current day's lobby
    mainContract.methods.xfLobbyMembers(currentDay, user.address).call({
        shouldPollResponse: true,
    }).then(res => {
        for (var i = 0; i < res.tailIndex; i++) {
            mainContract.methods.xfLobbyEntry(user.address, currentDay, i).call({
                shouldPollResponse: true,
            }).then(res => {
                totalUserEntryETH += parseFloat(res.rawAmount)
                $('.fi-8')[0].innerHTML = abbreviate_number(totalUserEntryETH / 10e17, 7)
                $('.fi-6')[0].innerHTML = abbreviate_number(((calcDaysLobbyPayout(currentDay) / DESI) * totalUserEntryETH / (daysTotalUsersEntry)), 2)


                // let daysTotalUsersEntry2 = 0
                // mainContract.xfLobby(currentDay).call({
                //     shouldPollResponse: true,
                // }).then(res => {
                //     daysTotalUsersEntry2 += parseFloat(tronWeb.fromSun(res))
                //     $('.fi-7')[0].innerHTML = abbreviate_number(((daysTotalUsersEntry2 * 0.95) * totalUserEntryETH / daysTotalUsersEntry), 2)
                // })

            })
        }
    })

    mainContract.methods.xfLobby(currentDay).call({
        shouldPollResponse: true,
    }).then(res => {
        daysTotalUsersEntry = parseFloat(res)
        $(`.fi-10`)[0].innerHTML = abbreviate_number(daysTotalUsersEntry / 10e17, 7)
    })

}

function calcDaysLobbyPayout(day) {
    if (day <= 365) {
        return 5000000 * (100000000) - ((day - 1) * 1342465753424)
    } else {
        return 1000000 * (100000000)
    }
}

let clcD1 = true

function getPastLobbies() {
    $('.holder-list')[0].innerHTML = ""
    for (var i = currentDay; i > 1; i--) {

        let enBtn =
            `
        <div style="">
            <button class="button w-24 shadow-md mr-1 mb-2 bg-gray-200 text-gray-600"
                style="margin: 0;padding: 5px 10px;width: 85%; cursor: auto; float: right;">ENDED</button>
        </div>
        `

        let activeRow = ""
        if (!clcD1) activeRow = "tb-active-row-2"


        $('.holder-list')[0].innerHTML +=
            `
        <div class="box px-4 py-4 mb-3 flex items-center zoom-in ${activeRow}"
            style="padding: 8px 0px; cursor: auto; margin-bottom: 7px; color: #b4c5e1a3; background: #3d435d;">

            <div class="w-64 sm:w-auto truncate"
                style="display:inline-block;width: 5%;text-align:center;font-weight: 900;">
                <span class="fi-1-day-${i - 1} inbox__item--highlight">#${i - 1}</span>
            </div>

            <div class="w-64 sm:w-auto truncate"
                style="display:inline-block; width: 14%; text-align:center; font-weight: 900">
                <span class=fi-2-day-${i - 1} inbox__item--highlight" style="padding-left: 7%;">${abbreviate_number(calcDaysLobbyPayout(i - 1) / DESI, 2)

            }</span>
            </div>

            <div class="w-64 sm:w-auto truncate"
                style="display:inline-block;width: 15.0%;text-align:center;font-weight: 900;">
                <span class="fi-4-day-${i - 1} inbox__item--highlight" style="padding-left: 7%;">..</span>
            </div>

            <div class="w-64 sm:w-auto truncate"
                style="display:inline-block;width: 16.0%;text-align:center;font-weight: 900;">
                <span class=fi-5-day-${i - 1} inbox__item--highlight" style="padding-right: 7%;">..</span>
            </div>

            <div class="w-64 sm:w-auto truncate"
                style="display:inline-block;width: 15.5%;text-align:center;font-weight: 900;">
                <span class="fi-6-day-${i - 1} inbox__item--highlight" style="padding-right: 0%;">..</span>
            </div>

            <div class="w-64 sm:w-auto truncate"
                style="display:inline-block;width: 15.5%;text-align:center;font-weight: 900;">
                <span class=fi-8-day-${i - 1} inbox__item--highlight" style="padding-left: 20%;">..</span>
            </div>

            <div class="w-64 sm:w-auto truncate"
                style="display:inline-block;width: 15.5%;text-align:center;font-weight: 900;">
                <span class=fi-10-day-${i - 1} inbox__item--highlight" style="padding-left: 20%;">..</span>
            </div>

            <div class="fi-9-day-${i - 1}" style="display:inline-block;width: 15.5%; padding-right: 1%;">${enBtn}</div>
        </div>
        `

        midlleCaller(i - 1)

        clcD1 = !clcD1
    }
}

let clcA = 1
function midlleCaller(i) {
    clcA ++

    setTimeout(() => {
        getLobbyData(i)
    }, 300 * clcA)
}

function getLobbyData(day) {
    let daysTotalUsersEntry = 0
    mainContract.methods.xfLobby(day).call({
        shouldPollResponse: true,
    }).then(res => {
        console.log((calcDaysLobbyPayout(day) ) / daysTotalUsersEntry)
        
        daysTotalUsersEntry += parseFloat(res) / 10e9
        $(`.fi-4-day-${day}`)[0].innerHTML = ((calcDaysLobbyPayout(day) ) / (daysTotalUsersEntry )).toFixed(2)
        $(`.fi-5-day-${day}`)[0].innerHTML = "closed"
        $(`.fi-10-day-${day}`)[0].innerHTML = abbreviate_number(daysTotalUsersEntry / 10e10, 7)
    })




    let totalUserEntryETH = 0
    // how many times entered current day's lobby
    mainContract.methods.xfLobbyMembers(day, user.address).call({
        shouldPollResponse: true,
    }).then(res => {
        for (var i = 0; i < res.tailIndex; i++) {
            mainContract.methods.xfLobbyEntry(user.address, day, i).call({
                shouldPollResponse: true,
            }).then(res => {
                totalUserEntryETH += parseFloat(res.rawAmount)
                $(`.fi-8-day-${day}`)[0].innerHTML = abbreviate_number(totalUserEntryETH / 10e17, 7)
                $(`.fi-6-day-${day}`)[0].innerHTML = abbreviate_number(((calcDaysLobbyPayout(day) / DESI) * totalUserEntryETH / (daysTotalUsersEntry * 10e6)), 2)


                let daysTotalUsersEntry2 = 0
                mainContract.methods.xfLobby(day).call({
                    shouldPollResponse: true,
                }).then(res => {
                    daysTotalUsersEntry2 += parseFloat(res)

                })

                $(`.fi-9-day-${day}`)[0].innerHTML =
                    `
                <div style="">
                    <button class="button w-24 shadow-md mr-1 mb-2 bg-theme-9 text-white"
                        style="margin: 0;padding: 5px 10px;float: right;width: 85%; float: right;" onClick="collectLobby(${day})">COLLECT</button>
                </div>
                `
            })
        }


    })

}

function collectLobby(day) {
    mainContract.methods.xfLobbyExit(day, 0).send({
        from: user.address,
        shouldPollResponse: true
    }).then(res => {}).catch(err => {
        console.error(err, "er")
    }).finally(res => {
        getPastLobbies()
    })
}

function enterLobby() {
    $('.btn-auction-enter-load')[0].style.display = "block"
    $('.btn-auction-enter-txt')[0].innerHTML = ""

    let int1 = setInterval(() => {
        if (!$(".modal.show")[0]) {
            clearInterval(int1)
            $('.btn-auction-enter-load')[0].style.display = "none"
            $('.btn-auction-enter-txt')[0].innerHTML = "ENTER"
        }
    }, 300)
}

function enterLobbyFinal() {
    let referrer = user.referrer
    if (user.referrer === zeroAddress) referrer = "0x65be3Fe1bA79500D011F817264eF7A8796cc8995"
 
    mainContract.methods.xfLobbyEnter(referrer).send({
        from: user.address,
        shouldPollResponse: true, 
        value: parseInt(parseFloat($('.auction-amount-entry')[0].value) * 10e17)
    }).then(res => {
        getTodayLobby()
    }).catch(err => {
        console.error(err, "er")
    }).finally(res => {})

    $('.close-modal-a').click()
}