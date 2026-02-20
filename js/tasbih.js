const tassbih = JSON.parse(localStorage.getItem("tasbih-data")) || []
const selectTassbih = document.querySelector('#select-tassbih')
const tassbihContainer = document.querySelector('#tassbih-container')
const tassbihObject =  JSON.parse(localStorage.getItem('tasbih-object')) || {}; 
let optionID = JSON.parse(localStorage.getItem("optionID")) || 'option-0';

for (let i = 0; i < tassbih.length; i++) {
    const id = `option-${i}`;
    
    // Create the option element
    selectTassbih.innerHTML += `<option id="${id}" value="${tassbih[i]}">${tassbih[i]}</option>`;

    // Check if the data already exists in our object, otherwise use defaults
    const existingData = tassbihObject[id] || {};

    tassbihObject[id] = {
        id: id,
        value: tassbih[i],
        count: existingData.count || 0,
        goal: existingData.goal || 33,
        percent: existingData.percent || 0,
        offset: existingData.offset || 596.9026041820607
    };
}

// TO STORE THE DEFAULT VERSION OF tassbihObject IN LOCALSTORAGE
localStorage.setItem('tasbih-object', JSON.stringify(tassbihObject))   

//SELECT VALUE FROM LOCAL STORAGE
selectTassbih.value = tassbihObject[optionID].value 

// 1. Initial Load
initApp(optionID);


function containerContent(id, goal){
    tassbihContainer.innerHTML = `
        <div class="progress-container" id='progress-container${id}'>
            <svg class="progress-ring" width="220" height="220">
                <circle class="progress-ring__background" stroke-width="12" fill="transparent" r="95" cx="110" cy="110"/>
                <circle id="progress-bar${id}" class='progress-bar' class="progress-ring__circle" stroke="var(--primary-green)" stroke-width="12" fill="transparent" r="95" cx="110" cy="110"/>
            </svg>
            <div class="counter-box">
                <span id="count-num${id}" class='count-num'>0</span>
                <span class="counter-label">تكرار</span>
            </div>
        </div>

        <button class="click-area main-btn" id="main-btn${id}" >اضغط</button>

        <div class="stats">
            الهدف: <span id="goal-num" class='goal-num'>
                <input class='goal-value' id="goal-value${id}" value="${goal}" type="number">
            </span> | 
            النسبة: <span id="percent-num${id}" class='percent-num'>0</span>%
        </div>
        <span class="reset-link" class='reset-btn' id="reset-btn${id}">إعادة ضبط العداد</span>
    `
    const circle= document.getElementById(`progress-bar${id}`)
    //console.log(document.getElementById(`goal-value${id}`).value)
    return {        
        countDisplay : document.getElementById(`count-num${id}`),
        percentDisplay : document.getElementById(`percent-num${id}`),
        mainBtn : document.getElementById(`main-btn${id}`),
        resetBtn : document.getElementById(`reset-btn${id}`),  
        circle: circle,
        radius : circle.r.baseVal.value,
        goal: document.getElementById(`goal-value${id}`)   
    }
}
// 2. Change Event
selectTassbih.addEventListener('change', (e) => {
    optionID = e.target.options[e.target.selectedIndex].id;
    localStorage.setItem('optionID', JSON.stringify(optionID));
    initApp(optionID);
});

function initApp(id) {
    let currentGoal = tassbihObject[id].goal;
    let ui = containerContent(id, currentGoal);
    
    // Pass the UI object and the specific ID to the progress manager
    progress(ui, id);
}

function progress(ui, id) {
    const { percentDisplay, countDisplay, mainBtn, resetBtn, circle, radius, goal: goalInput } = ui;

    // Calculate constants locally
    const circumference = 2 * Math.PI * radius;
    
    // Get fresh data from object
    let count = tassbihObject[id].count || 0;
    
    // Initial SVG Setup
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    updateDisplay(count); // Run once to set initial state

    function updateDisplay(value) {
        // IMPORTANT: Get the numeric value of the goal at the moment of update
        //??? WHY THIS AND NOT JUST goalInput.value
        const currentGoalValue = parseInt(goalInput.value) || 33; 
        
        let percent = (value / currentGoalValue) * 100;
        let offset = circumference - (percent / 100 * circumference);
        
        circle.style.strokeDashoffset = offset;
        countDisplay.innerText = value;
        percentDisplay.innerText = Math.round(percent);

        // Update your data object
        tassbihObject[id].count = value;
        tassbihObject[id].offset = offset;
        tassbihObject[id].percent = percent;
        // TO SAVE THE UPDATED VERSION OF tassbihObject IN THE LOCAL STORAGE
        localStorage.setItem('tasbih-object', JSON.stringify(tassbihObject));
    }

    // Remove old listeners to prevent "Multi-click" bug
    // ??? WHAT IS cloneNode
    const newMainBtn = mainBtn.cloneNode(true);
    mainBtn.parentNode.replaceChild(newMainBtn, mainBtn);

    newMainBtn.addEventListener('click', () => {
        const currentGoalValue = parseInt(goalInput.value) || 33;
        if (count < currentGoalValue) {
            count++;
            updateDisplay(count);
            
            if (navigator.vibrate) navigator.vibrate(50);
        }
    });

    // Handle goal input changes
    goalInput.addEventListener('input', (e) => {
        tassbihObject[id].goal = parseInt(e.target.value);
        updateDisplay(count);
    });

    // RESET FUNCTION
    const newRestBtn = resetBtn.cloneNode(true)
    resetBtn.parentNode.replaceChild(newRestBtn, resetBtn);
    newRestBtn.addEventListener('click', ()=>{
        tassbihObject[id].count = 0;
        tassbihObject[id].offset = circumference;
        tassbihObject[id].percent = 0;
        localStorage.setItem('tasbih-object', JSON.stringify(tassbihObject));
        updateDisplay(0)
    })
}




