
//MY VARIABLES
const header = document.querySelector('header');
const titleContainer = document.querySelector('.title-container')
const refreshBtn = document.querySelector('#reset-all-btn')
let savedStates = JSON.parse(localStorage.getItem('juzStates')) || {};
const grid = document.querySelector('#main-grid')
const countSpan = document.querySelector('#count')
const progressBar = document.querySelector('#progress-bar')
const total = 60
//let percentage = JSON.parse(localStorage.getItem("hizb-percentage")) || 0;
//*************************** */
let hizbLength = Object.keys(savedStates).length
let percentage = (hizbLength/total)*100
countSpan.textContent = hizbLength || 0;
progressBar.style.width = percentage + '%'
// Create 30 Juz' sections, each with 2 Ahzab
uiElement()
function uiElement(){
    for (let j=1; j<=30; j++){
    const juzBox = document.createElement('div')
    juzBox.className= 'juz-box'
    const hizb1 = (j * 2) - 1;
    const hizb2 = j * 2;
    juzBox.innerHTML=`
                    <span class="juz-title">الجزء ${j}</span>
                <div class="hizb-pair">
                    <div class="hizb-item">
                        <input type="checkbox" id="hizb-${hizb1}" class="hizb-check">
                        <label for="hizb-${hizb1}" class="hizb-label">
                            <span class="hizb-number">${hizb1}</span>
                            <span class="hizb-text">الحزب</span>
                        </label>
                    </div>
                    <div class="hizb-item">
                        <input type="checkbox" id="hizb-${hizb2}" class="hizb-check">
                        <label for="hizb-${hizb2}" class="hizb-label">
                            <span class="hizb-number">${hizb2}</span>
                            <span class="hizb-text">الحزب</span>
                        </label>
                    </div>
                </div>
    `

    grid.appendChild(juzBox);
}
}

//LOGIC TO UPDATE PROGRESS
grid.addEventListener('change', (e)=>{
    const checkbox = e.target
    if(checkbox.classList.contains('hizb-check')){
        savedStates[checkbox.id] = checkbox.checked;
        if(!checkbox.checked){
            delete savedStates[checkbox.id]
        }        
        localStorage.setItem('juzStates', JSON.stringify(savedStates))
        updateProgress()
    }
})

//UPDATE PROGRESS FUNCTION 
function updateProgress(){
    hizbLength = Object.keys(savedStates).length
    percentage = (hizbLength/60)*100
    countSpan.textContent = hizbLength;
    progressBar.style.width = percentage + '%'
}

//CHECK ALL CHECKED CHECKBOXES STORED IN LOCAL STORAGE
const checkboxes = document.querySelectorAll('.hizb-check')
checkboxes.forEach(checkbox => {
     if (savedStates[checkbox.id]) {
        checkbox.checked = true;
    }
})

//FUNCTION TO UNCHECK ALL CHECKBOXES
 function uncheckCheckboxes(){

    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    savedStates = {}
    localStorage.setItem('juzStates', JSON.stringify(savedStates));
    updateProgress()
}
refreshBtn.addEventListener('click', ()=>{
    uncheckCheckboxes()
}) 

