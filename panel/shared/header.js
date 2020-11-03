$('.shared-header')[0].innerHTML =
    `
<div class="mobile-menu md:hidden" style="border: 0;">
    <div class="mobile-menu-bar" style="background: #3f4366; box-shadow: 0px 0px 10px #121420; height: 60px;">
        <a href="" class="flex mr-auto" onclick="openMenuM()">
            <img alt="E2X token" class="w-6" src="../img/E2X-logo-s.png" style="width: 10vw;filter: drop-shadow(0px 0px 3px #120f27);">
        </a>

        <div class="top-bar-boxed flex items-center">
            <div id="countdown" style="background: #040417;/* box-shadow: 2px 2px 8px #202639a1; */height: 38px;border-radius: 6px;padding: 2px 0px 0px 10px;border: 3px solid #42527178;color: #c5d6f3;font-size: 18px;font-weight: 500;margin-right: 20px;"><span style="padding-right: 10px;">Day Ends In: 01 : 17 : 22</span></div>

            <div style="background: #040417;box-shadow: 2px 2px 8px #202639a1;height: 38px;border-radius: 6px;padding: 2px 0px 0px 10px;border: 3px solid #42527178;color: #c5d6f3;font-size: 18px;font-weight: 500;margin-right: 10px;"><span class="my-acc-add">TDH1z...8m6d6</span><img class="img-tronlink" src="https://cdn.discordapp.com/attachments/572416318234427402/700398613230125076/IIWYRzhS_400x400.jpg" style="width: 28px;margin-top: -3.7px;margin: 0px 1px 0px 10px;float: right;border-radius: 4px;"></div>
        </div>


        <a onclick="openMenuM()"> <i data-feather="bar-chart-2"
                class="w-8 h-8 text-white transform -rotate-90"></i> </a>
    </div>


    <div class="mobile-exten" style="background: #3c3c63;box-shadow: 0px 0px 10px #121420;height: 60px;z-index: 1000000000;position: absolute;width: 100%;display: flex;align-items: center;display: none; height: auto;">

        <ul class="border-t border-theme-24 py-7">
             <li>
                <a href="stake.html" class="menu">
                    <div class="menu__icon"> <i data-feather="layers"></i> </div>
                    <div class="menu__title"> Stake </div>
                </a>
            </li>
            <li>
                <a href="auction.html" class="menu">
                    <div class="menu__icon"> <i data-feather="server"></i> </div>
                    <div class="menu__title"> Auction </div>
                </a>
            </li>
            <li>
                <a href="dividends.html" class="menu">
                    <div class="menu__icon"> <i data-feather="pie-chart"></i> </div>
                    <div class="menu__title"> Dividends </div>
                </a>
            </li>
            <li>
                <a href="refer.html" class="menu ">
                    <div class="menu__icon"> <i data-feather="users"></i> </div>
                    <div class="menu__title"> Referral </div>
                </a>
            </li>
            <li>
                <a href="#" class="menu ">
                    <div class="menu__icon"> <i data-feather="shuffle"></i> </div>
                    <div class="menu__title"> XSwap (Coming Soon) </div>
                </a>
            </li>


           
        </ul>
        
    </div>


<script>
const DAYS = 24 * 3600 * 1000;

const countdowns = [{
    id: "countdown",
    timestamp: new Date("2020-11-01T00:00:00.1000Z").getTime(),
    interval: 1 * DAYS
  },
];

setInterval(() => {
  const now = new Date().getTime();
  countdowns.forEach(c => {
    while (c.timestamp < now) c.timestamp += c.interval; // set target to future date
    const tSecs = Math.floor((c.timestamp - now) / 1000);
    const secs = tSecs % 60;
    const tMins = (tSecs - secs) / 60;
    const mins = tMins % 60;
    const tHours = (tMins - mins) / 60;
    const hours = tHours % 24;
    const days = (tHours - hours) / 24;
    document.getElementById(c.id).textContent = `${hours}: ${mins}: ${secs}`;
  });
}, 1000);
</script>





    

</div>
<div class="border-b hd-nm border-theme-24 -mt-10 md:-mt-5 -mx-3 sm:-mx-8 px-3 sm:px-8 pt-3 md:pt-0 mb-10" style="background: #262935;border-bottom: 1px solid #040417;">
    <div class="top-bar-boxed flex items-center">
        <!-- BEGIN: Logo -->
        <a href="" class="-intro-x hidden md:flex">
            <img href="https://testblockdapp.github.io" alt="E2X Token" class="w-6" src="../img/T2X-logo-s.png" style="width: 3rem; filter: drop-shadow(2px 2px 7px rgba(177, 186, 216, 0.6));">
            <span class="text-white text-lg ml-3" style="padding-top: 0.2rem;font-size: 28px;padding-left: 5px;font-weight: 500;color: #c5d6f3;">E2X</span>
        </a>
        <!-- END: Logo -->
        <!-- BEGIN: Breadcrumb -->
        <div class="-intro-x breadcrumb breadcrumb--light mr-auto" style="background: #262935; border-left: 0px solid #040417;"> 
        <span style="font-size: 20px;color: #8585a8ba;font-weight: 400;">Next Generation Staking Platform</span></div>
        <!-- END: Breadcrumb -->
        <div style="background: #2c303d;/* box-shadow: 2px 2px 8px #202639a1; */height: 38px;border-radius: 6px;padding: 2px 0px 0px 10px;border: 3px solid #42527178;color: #c5d6f3;font-size: 18px;font-weight: 500;margin-right: 20px;"><span class="" style="padding-right: 10px;"><a href="https://etherscan.io/address/0xda0c27269c049e915e2cc7e5f1a7a2f838ec8dec" target="_blank">Etherscan</a></span></div>


        <div style="background: #2c303d;/* box-shadow: 2px 2px 8px #202639a1; */height: 38px;border-radius: 6px;padding: 2px 0px 0px 10px;border: 3px solid #42527178;color: #c5d6f3;font-size: 18px;font-weight: 500;margin-right: 20px;"><span class="day-end-in" style="padding-right: 10px;">Day Ends In: 00:00:00</span></div>

        <div style="background: #2c303d;box-shadow: 2px 2px 8px #202639a1;height: 38px;border-radius: 6px;padding: 2px 0px 0px 10px;border: 3px solid #42527178;color: #c5d6f3;font-size: 18px;font-weight: 500;"><span class="my-acc-add">...</span><img class="img-tronlink" src="https://cdn.discordapp.com/attachments/572416318234427402/771703875602350090/metamask-2728406-2261817.png" style="width: 28px;margin-top: -3.7px;margin: 0px 1px 0px 10px;float: right;border-radius: 4px;"></div>
    </div>
</div>
`

let mmO
setInterval(() => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('.hd-nm')[0].style.display = "none"
        $('.my-acc-add')[0].style.fontSize = "16px"
        $('.day-end-in')[0].style.fontSize = "16px"
    }

}, 1000)

function openMenuM() {
    if (mmO) {
        mmO = false
        $('.mobile-exten')[0].style.display = "none"
    } else {
        mmO = true
        $('.mobile-exten')[0].style.display = "block"
    }
}
