function run_Dividends() {
    $('.div-br')[0].value = ".." + " ETH"

    mainContract.methods.xfLobby(currentDay).call({
        shouldPollResponse: true
    }).then(res => {
        $('.div-br')[0].value = abbreviate_number(parseInt(res) / 10e17, 5) + " ETH"
    })
}

setTimeout(() => {
    run_Dividends()
}, 20 * 1000)