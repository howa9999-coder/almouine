// ============================================================
// PWA INSTALL BUTTON LOGIC
// ============================================================
// Select the install button
const installBtn = document.querySelector('#install-btn');

// Store the deferred prompt so we can trigger it later
let deferredPrompt = null;

// Listen for the "beforeinstallprompt" event
window.addEventListener("beforeinstallprompt", (installEvent) => {
    // Prevent the browser from automatically showing the prompt
    installEvent.preventDefault();

    // Remove "display: none" inline style to show the button
    installBtn.style.removeProperty('display');

    // Save the event for later use
    deferredPrompt = installEvent;
});

// When the user clicks the install button
installBtn.addEventListener("click", () => {
    if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user's choice
        deferredPrompt.userChoice.then((choice) => {
            if (choice.outcome === "accepted") {
                console.log('User accepted installation');
                // Hide the install button after install
                installBtn.style.display = "none";
            } else {
                console.log('User refused installation');
            }
        });

        // Reset the deferred prompt
        deferredPrompt = null;
    }
});

// ============================================================
// SERVICE WORKER REGISTRATION
// ============================================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("./sw.js")
        .then((reg) => {
            console.log("Service Worker registered:", reg);
        })
        .catch((err) => {
            console.log("Service Worker registration failed:", err);
        });
}


// ============================================================
// TASBIH DEFAULT DATA (INITIAL SETUP)
// ============================================================

let tassbihObject = JSON.parse(localStorage.getItem('tasbih-object')) || null
if (!tassbihObject || Object.keys(tassbihObject).length == 0){
    tassbihObject = {
        'option-0': {
            id: 'option-0',
            value:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
            goal: 33,
            count: 0,
            offset: 596.9026041820607,
            percent: 0
        },
        'option-1': {
            id: 'option-1',
            value:'سُبْحَانَ اللَّهِ الْعَظِيمِ',
            goal: 33,
            count: 0,
            offset: 596.9026041820607,
            percent: 0
        },
        'option-2': {
            id: 'option-2',
            value: 'الْحَمْدُ لِلَّهِ',
            goal: 33,
            count: 0,
            offset: 596.9026041820607,
            percent: 0
        },
        'option-3': {
            id: 'option-3',
            value: 'اللَّهُ أَكْبَرُ',
            goal: 33,
            count: 0,
            offset: 596.9026041820607,
            percent: 0
        }    
    }
    localStorage.setItem('tasbih-object', JSON.stringify(tassbihObject))
}


//========================================AHZAB PROGRESS================================================================
const progressBarHizb = document.querySelector('#progress-bar-hizb')
const progressPercentHizb = document.querySelector('#progress-percent-hizb')
const hizbCounterText = document.querySelector('#hizb-counter')
const hizbStates = JSON.parse(localStorage.getItem('juzStates')) || {}
let hizbCounter = Object.keys(hizbStates).length
let hizbPercent = (hizbCounter/60)*100
progressBarHizb.style.width = hizbPercent+'%'
progressPercentHizb.innerHTML = Math.round(hizbPercent)+'%'
hizbCounterText.innerHTML = hizbCounter

//=========================================TIKRAR PROGRESS=============================================================

let savedStates = JSON.parse(localStorage.getItem('checkboxStates')) || {};
let lunch = JSON.parse(localStorage.getItem("value")) || 30
let fromContent = JSON.parse(localStorage.getItem("fromContent")) || '---'
let toContent = JSON.parse(localStorage.getItem("toContent")) || '---'
const fromContentSpan = document.querySelector('#from-content')
const toContentSpan = document.querySelector('#to-content')
fromContentSpan.innerHTML = fromContent
toContentSpan.innerHTML = toContent
const progressBarTikrar = document.querySelector('#progress-bar-tikrar')
const progressPercentTikrar = document.querySelector('#progress-percent-tikrar')
let tikrarLength = Object.keys(savedStates).length
let tikrarPercentage = (tikrarLength/lunch)*100
progressBarTikrar.style.width = tikrarPercentage+'%'
progressPercentTikrar.innerHTML = Math.round(tikrarPercentage)+'%'

//======================================TASSBIH PROGRESS============================================================
const tassbihObjectLength = Object.keys(tassbihObject).length
//console.log(tassbihObject)

const tassbihData = document.querySelector('#tassbih-data')
const more = document.querySelector('.more')
const progressPercentTassbih = document.querySelector('#progress-percent-tassbih')
const progressBarTassbih = document.querySelector('#progress-bar-tassbih')
let goalSum = 0
let countSum = 0
function tassbihContent(){
    tassbihData.innerHTML=''
     Object.values(tassbihObject).forEach(dikr => {
       // console.log(dikr.value)
        tassbihData.innerHTML+=`<p class="progress-text">${dikr.value} : <span> ${dikr.count || 0}/${dikr.goal || (33*5)}</span></p>`
     })
        tassbihData.innerHTML += `
            <div class='links-container'>
                <span><a href='tasbihEdit.htm'>تعديل</a></span>
                <span class="reset-link" onclick="resetAll()" id="reset-all-btn">إعادة ضبط الكل</span>
            </div>
        `     
    
}

tassbihContent()
// 1. the progress bar is not working

function resetAll(){
    Object.values(tassbihObject).forEach(dikr => {
        dikr.count = 0
        dikr.percent = 0
        dikr.offset = 596.9026041820607
    })
    localStorage.setItem('tasbih-object', JSON.stringify(tassbihObject)) 
    optionID= 'option-0'
    localStorage.setItem('optionID', JSON.stringify(optionID));
    tassbihContent()
    progressBarTassbih.style.width = '0%'
    progressPercentTassbih.innerHTML = '0%'    
}

progressFunc()
function progressFunc(){
    goalSum = 0
    countSum = 0
    Object.values(tassbihObject).forEach(dikr => {
       goalSum = goalSum + dikr.goal
       countSum = countSum + dikr.count
     })
    let tassbihPercent = (countSum/goalSum)*100
    progressBarTassbih.style.width = tassbihPercent+'%'
    progressPercentTassbih.innerHTML = Math.round(tassbihPercent)+'%'
}

more.addEventListener('click', () => {
    // 1. Toggle the visibility class
    tassbihData.classList.toggle('active');

    // 2. Update the button text based on whether 'active' is present
    if (tassbihData.classList.contains('active')) {
        more.innerHTML = '-';
    } else {
        more.innerHTML = '+';
    }
});
