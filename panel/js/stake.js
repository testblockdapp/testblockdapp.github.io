
let stakeData = {
    entered_amount: 0,
    entered_days: 0,
    currentDay: void 0,
    stakingShare: void 0,
    clc_1: 0,
    clc_2: 0,
    shareRate: 0
}

const DESI_2 = 100000000

const LPB = 1820
const LPB_MAX_DAYS = 3640

const BPB_MAX_HEARTS = ((7 * 1000000) * (100000000))
const BPB = BPB_MAX_HEARTS * 100 / 10

let holder, clcD1 = true,
    clcD2 = true


function refreshMyStakes() {
    getMyStakes()
}

function refreshMyEndedStakes() {
    getMyEndedStakes()
}

function run_Stake(nIrstRn) {
    mainContract.methods.globalInfo().call({
        shouldPollResponse: true
    }).then(res => {
        stakeData.stakingShare = res[2]
        $('.st-val-1')[0].innerHTML = currentDay + 1

        stakeData.shareRate = (100000 / stakeData.stakingShare) * 100000000
        $('.st-val-12')[0].innerHTML = abbreviate_number(stakeData.shareRate, 2) + "/E2X"
    })

    mainContract.methods.xfLobby(currentDay).call({
        shouldPollResponse: true
    }).then(res => {
        $('.st-val-8')[0].innerHTML = abbreviate_number(res / 10e17, 2) + " ETH"
    })

    if (nIrstRn) return

    getMyEndedStakes()
    getDaysData()
    estimateNextDay()
}

let DaysData = []

function getDaysData() {
    let xmlhttp_gu = new XMLHttpRequest();
    xmlhttp_gu.open("POST", "/get-days-data", true);
    xmlhttp_gu.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp_gu.send();

    xmlhttp_gu.onreadystatechange = (e) => {
        if (xmlhttp_gu.readyState !== 4 || xmlhttp_gu.status !== 200) return;
        if (xmlhttp_gu.responseText.length < 1) return;

        DaysData = JSON.parse(xmlhttp_gu.responseText)
        setTimeout(() => {
            getMyStakes()
        }, 3000)

        setInterval(() => {
            getMyStakes()
        }, 1000 * 60 )

    }
}

setInterval(() => {
    run_Stake(true)
}, 1000 * 35)

function stakeChangeDays() {
    stakeData.entered_days = parseInt($('.stake-inp-day')[0].value)

    const stakeDays = stakeData.entered_days + currentDay
    $('.st-val-2')[0].innerHTML = stakeDays
    $('.st-val-3')[0].innerHTML = stakeDays + 1

    let extraDays = stakeData.entered_days - 1
    if (extraDays > LPB_MAX_DAYS) extraDays = LPB_MAX_DAYS
    stakeData.clc_1 = (extraDays / 1820)

    holder = abbreviate_number_cu1((stakeData.clc_1 * parseFloat($('.stake-inp-amount')[0].value)).toLocaleString(void 0, {
        minimumFractionDigits: 8
    }))
    $('.st-val-5')[0].innerHTML = "+ " + holder + " E2X"

    calculator()
}

function stakeChangeAmount() {
    stakeData.entered_amount = parseFloat($('.stake-inp-amount')[0].value)

    stakeData.clc_2 = stakeData.entered_amount * (Math.min(stakeData.entered_amount, 150000000) / 1500000000)

    holder = abbreviate_number_cu1((stakeData.clc_2).toLocaleString(void 0, {
        minimumFractionDigits: 8
    }))
    $('.st-val-4')[0].innerHTML = "+ " + holder + " E2X"

    holder = abbreviate_number_cu1((stakeData.clc_1 * parseFloat($('.stake-inp-amount')[0].value)).toLocaleString(void 0, {
        minimumFractionDigits: 8
    }))
    $('.st-val-5')[0].innerHTML = "+ " + holder + " E2X"

    calculator()
}


function calculator() {
    if (!currentDay) return

    holder = abbreviate_number(stakeData.clc_1 * parseFloat($('.stake-inp-amount')[0].value) + stakeData.clc_2, 2)
    $('.st-val-6')[0].innerHTML = holder + " E2X"

    let effective = parseFloat($('.stake-inp-amount')[0].value) + (stakeData.clc_1 * parseFloat($('.stake-inp-amount')[0].value) + stakeData.clc_2)
    holder = abbreviate_number(effective, 2)
    $('.st-val-7')[0].innerHTML = holder + " E2X"

    $('.st-val-13')[0].innerHTML = abbreviate_number(parseFloat(effective * stakeData.shareRate), 2)
}

function doStake() {
    $('.btn-usertransfer-load')[0].style.display = "block"
    $('.btn-usertransfer-txt')[0].innerHTML = ""

    mainContract.methods.balanceOf(user.address).call({
        shouldPollResponse: true
    }).then(res => {
        if (res < parseFloat($('.stake-inp-amount')[0].value)) {
            displayAlert(3, "Not Enough Balance !")
            $('.btn-usertransfer-load')[0].style.display = "none"
            $('.btn-usertransfer-txt')[0].innerHTML = "STAKE"
        } else {
            mainContract.methods.stakeStart(parseFloat($('.stake-inp-amount')[0].value) * DESI, parseInt($('.stake-inp-day')[0].value)).send({
                from: user.address,
                shouldPollResponse: false
            }).then(res => {
                displayAlert(1, `Successfully staked ${parseFloat($('.stake-inp-amount')[0].value)} E2X for ${parseInt($('.stake-inp-day')[0].value)} days.`)
                refreshMyStakes()
            }).catch(err => {
                displayAlert(3, "Something went wrong !")
                console.log(err)
            }).finally(res => {
                $('.btn-usertransfer-load')[0].style.display = "none"
                $('.btn-usertransfer-txt')[0].innerHTML = "STAKE"
            })
        }
    })
}


function getMyStakes() {
    mainContract.methods.stakeCount(user.address).call({
        shouldPollResponse: true
    }).then(res => {
        setTimeout(() => {
            const myStakesCount = res

            let toBeRendered = []

            let strt = 0
            ck1()

            function ck1() {
                if (strt < myStakesCount) {
                    getDrc()
                    strt++
                }
            }

            function getDrc() {
                mainContract.methods.stakeLists(user.address, strt).call({
                    shouldPollResponse: true
                }).then(res2 => {
                    toBeRendered.push(res2)

                    if (toBeRendered.length == myStakesCount) {
                        toBeRendered.sort((b, a) => parseInt(a.stakeId) - parseInt(b.stakeId))
                        renderMyStakes(toBeRendered)
                    } else {
                        ck1()
                    }
                })
            }

        }, 500)
    })
}

function renderMyStakes(data) {
    let rows = []

    let ii = 0
    data.forEach(item => {
        ii++

        item.lockedDay = parseInt(item.lockedDay)
        item.stakedDays = parseInt(item.stakedDays)

        let progress, btnTheme = "bg-theme-101",
            btnTxt = "CANCEL"
        if (item.lockedDay == currentDay + 1) {
            progress = `
            <div class="w-64 sm:w-auto truncate"
                style="width: 150vw; text-align:center; font-weight: 900;">
                <span class="inbox__item--highlight">In Waiting</span>
            </div>
            `
        } else if (item.lockedDay == currentDay) {
            progress = `
            <div class="w-64 sm:w-auto truncate"
                style="width: 150vw; text-align:center; font-weight: 900;">
                <div class="progress-b" style=""><div class="progress-bn" style="width: 2%;"></div></div>
            </div>
            `
        } else if (item.lockedDay + item.stakedDays < currentDay + 1) {
            progress = `
            <div class="w-64 sm:w-auto truncate"
                style="width: 150vw; text-align:center; font-weight: 900;">
                <div class="progress-b" style=""><div class="progress-bn" style="width: 100%;"></div></div>
            </div>
            `
            btnTxt = "COLLECT"
            btnTheme = "bg-theme-100"
        } else if (item.lockedDay < currentDay + 1 && (item.lockedDay + item.stakedDays >= currentDay + 1)) {
            let clcR1 = currentDay - item.lockedDay
            let clcR2 = (clcR1 / item.stakedDays) * 100
            progress = `
            <div class="w-64 sm:w-auto truncate"
                style="width: 150vw; text-align:center; font-weight: 900;">
                <div class="progress-b" style=""><div class="progress-bn" style="width: ${clcR2}%;"></div></div>
            </div>
            `
        }


        let activeRow = "item-sln"
        if (!clcD1) activeRow = "item-slm"

        let stakedSuns = item.stakedSuns
        let stakeShares =item.stakeShares

        let stakeButton = `
        <div class="w-64 sm:w-auto truncate"
            style="width: 100vw; text-align:center; font-weight: 900;">
            <button class="button w-24 mr-1 mb-2 ${btnTheme} text-white" onClick="endStake(${item.stakeId})"
                style="width: auto; padding: 0px 5px;margin: 0; opacity: 0.5;">
            ${btnTxt}</button>
        </div>
        `

        const newItem =
            `
        <div class="intro-y">
            <div class="${activeRow} row-body inbox__item inline-block sm:block text-gray-700 bg-gray-100 border-b border-gray-200"
                style="cursor: auto;">
                <div class="flex px-5 py-3"
                    style="padding-left: .0rem; padding-right: .0rem;">
    
                    <div class="w-64 sm:w-auto truncate"
                        style="width: 50vw; text-align:center; font-weight: 900;">
                        <span class="inbox__item--highlight">${item.lockedDay}</span>
                    </div>
    
                    <div class="w-64 sm:w-auto truncate"
                        style="width: 50vw; text-align:center; font-weight: 900;">
                        <span class="inbox__item--highlight">${item.lockedDay + item.stakedDays}</span>
                    </div>
    
                    ${progress}
    
                    <div class="w-64 sm:w-auto truncate"
                        style="width: 90vw; text-align:center; font-weight: 900;">
                        <span class="inbox__item--highlight">${abbreviate_number(parseInt(stakedSuns) / DESI, 2)}</span>
                    </div>
    
                    <div class="w-64 sm:w-auto truncate"
                        style="width: 110vw; text-align:center; font-weight: 900;">
                        <span class="inbox__item--highlight">${abbreviate_number(parseInt(stakeShares) / DESI, 2)}</span>
                    </div>
    
                    <div class="w-64 sm:w-auto truncate"
                        style="width: 125vw; text-align:center; font-weight: 900;">
                        <span class="daily-bonus-it-${ii} inbox__item--highlight" id="0">0</span>
                    </div>

                    <div class="w-64 sm:w-auto truncate"
                        style="width: 125vw; text-align:center; font-weight: 900;">
                        <span class="dividends-it-${ii} inbox__item--highlight" id="0">--</span>
                    </div>
    
                    <div class="w-64 sm:w-auto truncate"
                        style="width: 100vw; text-align:center; font-weight: 900;">
                        <span class="interest-tn-${ii} inbox__item--highlight">--</span>
                    </div>
    
                    <div class="w-64 sm:w-auto truncate"
                        style="width: 100vw; text-align:center; font-weight: 900;">
                        <span class="interest-tm-${ii} inbox__item--highlight" id="${parseInt(stakedSuns) / DESI}">--</span>
                    </div>
    
                    ${stakeButton}
                </div>
            </div>
        </div>
        `


        calcInterest(`interest-tn-${ii}`, `interest-tm-${ii}`, `daily-bonus-it-${ii}`, parseInt(item.stakeShares) / DESI, item.lockedDay, item.stakedDays + item.lockedDay)

        calcDividends(`dividends-it-${ii}`, item.lockedDay, item.stakedDays, stakeShares)

        getDailyBonusRewards(parseInt(item.lockedDay), parseInt(item.stakedDays), stakeShares, `daily-bonus-it-${ii}`)


        clcD1 = !clcD1
        rows.push(newItem)
    })

    $('.my-stakes-list')[0].innerHTML = ""

    for (var i = 0; i < rows.length; i++) {
        $('.my-stakes-list')[0].innerHTML += rows[i]
    }
}

function calcDividends(elm, lockedDay, stakedDays, stakeShares) {
    setTimeout(() => {
        let addUpDivs = 0

        for (var i = 0; i < stakedDays; i++) {
            DaysData.forEach(item => {
                if (item.day == lockedDay + i) {
                    addUpDivs += (item.totalDividends * 0.90) * stakeShares / item.stakeSharesTotal
                    $(`.${elm}`)[0].innerHTML = abbreviate_number((addUpDivs), 7) + " ETH"
                }
            })

        }
    }, 3000)
}






function getDailyBonusRewards(startDay, stakedDays, stakeShares, item) {
    setTimeout(() => {
        let counter = 0
        for (var ii = startDay; ii < stakedDays + startDay; ii++) {
            if (counter < 4) {
                counter++;
            } else {
                processDailyBonus(ii, item)
                counter = 0;
            }
        }

        function processDailyBonus(theDay, _elm) {
            DaysData.forEach(item => {
                if (item.day == theDay) {
                    let elm = document.getElementsByClassName(`${_elm}`)[0]
                    if (!item.payoutTotal) {
                        if (elm.innerHTML === "..." || elm.innerHTML === "0") elm.innerHTML = "0"
                        return
                    }
                    let calc = (((parseFloat(item.payoutTotal) * parseFloat(stakeShares)) / parseFloat(item.stakeSharesTotal)) * 2)
                    if (elm && elm.id) {
                        elm.innerHTML = abbreviate_number(parseFloat(elm.id) + parseFloat(calc), 2)
                        elm.id = calc
                    }
                }
            })
        }
    }, 3000)
}











function calcInterest(item, item2, item3, stakeShares, startDay, endDay) {
    setTimeout(() => {
        let interest = 0

        for (var i = startDay; i < endDay; i++) {
            DaysData.forEach(item => {
                if (item.day == i) {
                    interest += parseFloat(item.payoutTotal) * parseFloat(stakeShares) / parseFloat(item.stakeSharesTotal)
                }
            })
        }
        // $(`.${item}`)[0].innerHTML = `${abbreviate_number(parseInt(interest) / SUN, 2)}`
        // if ($(`.${item2}`)[0].id && $(`.${item3}`)[0].id) $(`.${item2}`)[0].innerHTML = `${abbreviate_number(parseFloat($(`.${item2}`)[0].id) + parseFloat($(`.${item3}`)[0].id) + (parseInt(interest) / SUN), 2)}`

        $(`.${item}`)[0].innerHTML = `${abbreviate_number(interest, 2)}`
        
        if ($(`.${item2}`)[0].id && $(`.${item3}`)[0].id) $(`.${item2}`)[0].innerHTML = `${abbreviate_number(parseFloat($(`.${item2}`)[0].id) + parseFloat($(`.${item3}`)[0].id) + interest, 2)}`
        // $(`.${item3}`)[0].innerHTML = `${abbreviate_number(parseFloat($(`.${item2}`)[0].id) + parseFloat($(`.${item3}`)[0].id) + interest / 100, 2)} E2X`
    }, 3000)
}


//a.slice(0, a.indexOf(" E2X"))
function addUpCurrentValue() {
    $('.interest-tm-${ii}')
}

function endStake(stakeId) {
    getStakesCount()

    function getStakesCount() {
        mainContract.methods.stakeCount(user.address).call({
            shouldPollResponse: true
        }).then(res => {
            for (var i = 0; i < res; i++) {
                checkListForIndex(i)
            }
        })
    }

    function checkListForIndex(i) {
        mainContract.methods.stakeLists(user.address, i).call({
            shouldPollResponse: true
        }).then(res => {
            if (res.stakeId == stakeId) doEnd(i)
        })
    }

    function doEnd(stakeIndex) {
        mainContract.methods.stakeEnd(stakeIndex, stakeId).send({
            from: user.address,
            shouldPollResponse: true,
        }).then(res => {
            refreshMyStakes()
            setTimeout(() => {
              //  refreshMyEndedStakes()
            }, 1500)
        })
    }
}

function getMyEndedStakes() {
    let httpReq_a = new XMLHttpRequest()
    httpReq_a.open("POST", "/get_my_ended_stakes", true)
    httpReq_a.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    httpReq_a.send('address=' + user.address)

    httpReq_a.onreadystatechange = (e) => {
        if (httpReq_a.readyState !== 4 || httpReq_a.status !== 200) return
        if (httpReq_a.responseText.length < 1) return

        $('.my-ended-stakes-list')[0].innerHTML = ""
        renderMyEndedStakes(JSON.parse(httpReq_a.responseText))
    }
}

function renderMyEndedStakes(data) {console.log("e", data)
    data.sort((b, a) => parseInt(a.date) - parseInt(b.date))
    data.forEach(item => {
        item.lockedDay = parseInt(item.lockedDay)
        item.servedDays = parseInt(item.servedDays)

        let progress, tstStyle
        if (item.currentDay < item.lockedDay) {
            progress = "pending"
        } else if (item.currentDay > item.lockedDay + (item.lockedDay - 1)) {
            progress = "100%"
        } else if (item.currentDay == item.lockedDay + (item.lockedDay - 1)) {
            progress = "0%"
        } else if (item.currentDay < item.lockedDay + (item.lockedDay - 1)) {
            progress = (100 / item.lockedDay).toFixed(2) + "%"
        }

        let endDay = item.lockedDay + item.servedDays
        progress = "Canceled"
        tstStyle = "c06054db"

        if (item.servedDays > 0 && item.payout !== "0") {
            progress = "Finished"
            tstStyle = "8db85b"
        }

        let activeRow = "item-sln"
        if (!clcD2) activeRow = "item-slm"

        let row =
            `
        <div class="intro-y">
            <div class="${activeRow} row-body inbox__item inline-block sm:block text-gray-700 bg-gray-100 border-b border-gray-200"
                style="cursor: auto;">
                <div class="flex px-5 py-3" style="padding-left: .0rem; padding-right: .0rem;">

                    <div class="w-64 sm:w-auto truncate"
                        style="width: 50vw; text-align:center; font-weight: 900;">
                        <span class="inbox__item--highlight">${item.lockedDay}</span>
                    </div>

                    <div class="w-64 sm:w-auto truncate"
                        style="width: 50vw; text-align:center; font-weight: 900;">
                        <span class="inbox__item--highlight">${endDay}</span>
                    </div>

                    <div class="w-64 sm:w-auto truncate"
                        style="width: 70vw; text-align:center; font-weight: 900; color:#${tstStyle}">
                        <span class="inbox__item--highlight">${progress}</span>
                    </div>

                    <div class="w-64 sm:w-auto truncate"
                        style="width: 150vw; text-align:center; font-weight: 900;">
                        <span class="inbox__item--highlight">${abbreviate_number(item.stakedSuns / DESI, 2)} E2X</span>
                    </div>

                    <div class="w-64 sm:w-auto truncate"
                        style="width: 80vw; text-align:center; font-weight: 900;">
                        <span class="inbox__item--highlight">${abbreviate_number(item.stakeShares / DESI, 2)}</span>
                    </div>

                    <div class="w-64 sm:w-auto truncate"
                        style="width: 210vw; text-align:center; font-weight: 900;">
                        <span class="inbox__item--highlight">${abbreviate_number(parseInt(item.payout) / DESI, 2)} E2X</span>
                    </div>

                    <div class="w-64 sm:w-auto truncate"
                        style="width: 100vw; text-align:center; font-weight: 900;">
                        <span class="inbox__item--highlight">${abbreviate_number(parseInt(item.dividends) / 10e17, 6)} ETH</span>
                    </div>

                    <div class="w-64 sm:w-auto truncate"
                        style="width: 100vw; text-align:center; font-weight: 900;">
                        <span class="inbox__item--highlight">${abbreviate_number(parseInt(item.stakeReturn) / DESI, 2)} E2X</span>
                    </div>

              

                </div>
            </div>
        </div>
        `
        clcD2 = !clcD2
        $('.my-ended-stakes-list')[0].innerHTML += row
    })
}

setInterval(() => {
    eligibleBonusDays()
}, 500)

function eligibleBonusDays() {
    $('.bounty-days-el')[0].innerHTML = `Eligible for ${Math.floor(parseInt($('.stake-inp-day')[0].value || 1) / 5)} BonusDays`
}

function estimateNextDay() {
    for (var i = currentDay; i > currentDay - 3; i--) {
        getLobbyData(i - 1)
    }
}

let pstEntries = 0

function getLobbyData(day) {
    // mainContract.methods.xfLobby(day).call({
    //     shouldPollResponse: true,
    // }).then(res => {
    //     pstEntries += parseFloat(tronWeb.fromSun(res))
    //     $('.st-val-9')[0].innerHTML = "~" + abbreviate_number(pstEntries / 3, 2) + " ETH"
    // })
}