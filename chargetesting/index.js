let connection;
let mainAccount;
let tokenContractAddress = "TVs1rRWrBkgQ5zxksYJuCeGthFohjKUGyy";
let contractAddress = "TVu2keBLZrbmx9QTXHuzQwhPF242fsheN2";
window.addEventListener("message", (e) => {
  setInterval(function checkConnection() {
    if (
      window.tronWeb &&
      window.tronWeb.defaultAddress.base58 === "undefined"
    ) {
      connection = "TROn LINK is not available";
      console.log("not available");
      jQuery("#metamaskConnection").text(connection);
    } else {
      connection = "Connected to Tron LINK.";
      console.log("connections : ", connection);
      jQuery("#metamaskConnection").text(connection);

      mainAccount = window.tronWeb.defaultAddress.base58;
      console.log("MAINNACCOUNt : ", mainAccount);
      jQuery(document).ready(function () {
        isLocked();
        getBalanceOfAccount();
        balanceOfCSE();
        getUserDividend();
        totalSupply();
      });
    }

    if (e.data.message && e.data.message.action == "setNode") {
      console.log("setNode event", e.data.message);
      if (e.data.message.data.node.chain == "_") {
        console.log("tronLink currently selects the main chain");
      } else {
        console.log("tronLink currently selects the side chain");
      }
    }
  }, 5000);

  if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
    // clearInterval(obj)
    let tronweb = window.tronWeb;
  }
});
function isLocked() {
  // web3.eth.getAccounts(function (err, accounts) {
  if (window.tronWeb.defaultAddress.base58 == null) {
    console.log(err);
    jQuery("#lock").text(err);
  } else if (window.tronWeb.defaultAddress.base58 === 0) {
    console.log("TRON LINK is locked");
    jQuery("#lock").text("TRON LINK is locked.");
  } else {
    console.log("TRON LINK is unlocked");
    jQuery("#lock").text("TRON LINK is unlocked.");
  }
  // });
}
//get balance
function getBalanceOfAccount() {
  tronWeb.trx.getBalance(mainAccount, function (err, res) {
    console.log("BALCNE RESPONE : ", res);
    jQuery("#getBalance").text(res / 1000000 + " " + "TRX");
  });
  tronWeb.trx.getBalance(contractAddress, function (err, res) {
    console.log("BALCNE RESPONE : ", res);
    jQuery("#contractBalance").text(res / 1000000 + " " + "TRX");
  });
  tronWeb.trx.getBalance(tokenContractAddress, function (err, res) {
    console.log("BALCNE RESPONE Token : ", res);
    jQuery("#getBalanceToken").text(res / 1000000 + " " + "TRX");
  });
}

//deposit your fund
async function deposit() {
  const amount = jQuery("#depositamount").val();
  let Tokencontract = await tronWeb.contract().at(tokenContractAddress);
  let capitalContract = await tronWeb.contract().at(contractAddress);
  console.log("amount:" + amount);
  await Tokencontract.approve(contractAddress, amount * 100000000)
    .send({
      feeLimit: 100000000,
    })
    .then((output) => {
      console.log("- Output:", output, "\n");
      jQuery("#approve").text("Hash ID:" + " " + output);
    });
  await capitalContract
    .stakeCSE(amount * 100000000)
    .send({
      feeLimit: 100000000,
    })
    .then((output) => {
      console.log("- Output:", output, "\n");
      jQuery("#transferToken").text("Hash ID:" + " " + output);
    });
}
async function withdrawDividend() {
  let currentAddress = window.tronWeb.defaultAddress.base58;
  let contract = await tronWeb.contract().at(contractAddress);
  contract
    .withdrawReward()
    .send({
      feeLimit: 100000000,
    })
    .then((output) => {
      console.log("- Output:", output, "\n");
      jQuery("#withdrawID").text("Hash ID:" + " " + output);
    });
}
async function getUserDividend() {
  let contract = await tronWeb.contract().at(contractAddress);
  console.log("contract:" + contract);
  let details = await contract.payoutOf(mainAccount).call();
  console.log("DETAILS : ", details);

  let obj = {
    dividend: parseInt(details.payout) / 100000000,
    MaxToPay: parseInt(details.max_payout) / 100000000,
  };

  console.log("MY OBJ : ", obj);
  jQuery("#getUserDividend").text(JSON.stringify(obj));
  document.getElementById("dividend").innerHTML = obj.dividend;
}
//get user detail
async function getUserDetails() {
  console.log("get user detail function called!");
  let contract = await tronWeb.contract().at(contractAddress);
  console.log("contract:" + contract);
  let details = await contract.users(mainAccount).call();
  console.log("DETAILS : ", details);

  let obj = {
    payouts: parseInt(details.payouts) / 100000000,
    deposit_amount: parseInt(details.deposit_amount) / 100000000,
    deposit_payouts: parseInt(details.deposit_payouts) / 100000000,
    deposit_time: parseInt(details.deposit_time),
    total_deposits: parseInt(details.total_deposits),
    total_payouts: parseInt(details.total_payouts) / 100000000,
  };

  console.log("MY OBJ : ", obj);
  jQuery("#getUserDetails").text(JSON.stringify(obj));
  document.getElementById("userpayouts").innerHTML = obj.payouts;
  document.getElementById("depositamount").innerHTML = obj.deposit_amount;
  document.getElementById("totaldeposits").innerHTML = obj.total_deposits;
  document.getElementById("deposittime").innerHTML = obj.deposit_time;
  document.getElementById("totalpayouts").innerHTML = obj.total_payouts;
}
async function totalSupply() {
  let currentAddress = window.tronWeb.defaultAddress.base58;
  let contract = await tronWeb.contract().at(contractAddress);
  let details = await contract.totalSupply().call();
  jQuery("#totalSupply").text(parseInt(details) / 100000000);
}
async function balanceOf() {
  let currentAddress = window.tronWeb.defaultAddress.base58;
  let contract = await tronWeb.contract().at(contractAddress);
  let details = await contract.balanceOf(mainAccount).call();
  jQuery("#balanceOf").text(parseInt(details) / 100000000);
}
async function balanceOfCSE() {
  let currentAddress = window.tronWeb.defaultAddress.base58;
  let contract = await tronWeb.contract().at(tokenContractAddress);
  let details = await contract.balanceOf(mainAccount).call();
  jQuery("#balanceOfCSE").text(parseInt(details) / 100000000);
}
async function tokenName() {
  let currentAddress = window.tronWeb.defaultAddress.base58;
  let contract = await tronWeb.contract().at(contractAddress);
  let details = await contract.name().call();
  jQuery("#name").text((details));
}
async function tokenSymbol() {
  let currentAddress = window.tronWeb.defaultAddress.base58;
  let contract = await tronWeb.contract().at(contractAddress);
  let details = await contract.symbol().call();
  jQuery("#symbol").text((details));
}
