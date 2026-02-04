 
//============================================================Local storage
// Function to handle content changes
let fromContent = JSON.parse(localStorage.getItem("fromContent")) || '---'
let toContent = JSON.parse(localStorage.getItem("toContent")) || '---'
const progressBar= document.querySelector('#tikrar-progress-bar')
const fromContentSpan = document.querySelector('#from-content')
const toContentSpan = document.querySelector('#to-content')
fromContentSpan.innerHTML = fromContent
toContentSpan.innerHTML = toContent
const counter = document.querySelector('#counter')
const goalContainer = document.querySelector('#goal-container')

fromContentSpan.addEventListener('input', function(){
    fromContent = fromContentSpan.innerHTML
    localStorage.setItem("fromContent", JSON.stringify(fromContent));
})
toContentSpan.addEventListener('input', function(){
    toContent = toContentSpan.innerHTML
    localStorage.setItem("toContent", JSON.stringify(toContent));
})
//current checkboxes counter
let savedStates = JSON.parse(localStorage.getItem('checkboxStates')) || {};
let tikrarLength = Object.keys(savedStates).length
counter.innerHTML= tikrarLength

//checkbox generator 
let lunch = JSON.parse(localStorage.getItem("value")) || 20
const select =  document.querySelector('#repeat')
select.value = lunch
goalContainer.innerHTML=lunch
generateStyledCheckboxes(lunch);
let tikrarPercentage = (tikrarLength/lunch)*100
progressBar.style.width = tikrarPercentage + '%'
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++RECORD
const mic_btn = document.querySelector('.btn-record');
const playback = document.querySelector('.playback');
const audio = document.getElementById('audio-recorder');
const playBtn = document.getElementById('custom-play-btn');
const icon = playBtn.querySelector('.icon');
const btnText = playBtn.querySelector('.text');

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.classList.add('playing');
        icon.innerText = '⏸'; // Change icon to pause
        btnText.innerText = 'جاري الاستماع...';
    } else {
        audio.pause();
        resetPlayButton();
    }
});

// Reset button when audio finishes
audio.onended = () => {
    resetPlayButton();
};

function resetPlayButton() {
    playBtn.classList.remove('playing');
    icon.innerText = '▶';
    btnText.innerText = 'استماع للتسجيل';
}
mic_btn.addEventListener('click', ToggleMic);

let can_record = false;
let is_recording = false;
let recorder = null;
let chunks = [];
 
 function SetupAudio() {
     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
         navigator.mediaDevices
             .getUserMedia({
                 audio: true
             })
             .then(SetupStream)
             .catch(err => {
                 console.error(err);
             });
     }
 }

 SetupAudio();

 function SetupStream(stream) {
     recorder = new MediaRecorder(stream);
     recorder.ondataavailable = e => {
         chunks.push(e.data);
     };
     recorder.onstop = e => {
         const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
         chunks = [];
         const audioURL = window.URL.createObjectURL(blob);
         playback.src = audioURL;
     };
     can_record = true;
 }

 function ToggleMic() {
     if (!can_record) return;
     is_recording = !is_recording;
     if (is_recording) {
         recorder.start();
         mic_btn.classList.add("is-recording");
     } else {
         recorder.stop();
         mic_btn.classList.remove("is-recording");
         confirme();
     }
 }
//=========================================== select function
select.addEventListener('change', function() {
    const value = this.value;
    localStorage.setItem("value", JSON.stringify(value));
    lunch = value
    generateStyledCheckboxes(value);
    refreshFunction()
 });

//++++++++++++++++++++++++++++++++++++++++++++++++++++++CHECKBOXES GENERATOR
function generateStyledCheckboxes(number) {
    // Get the container
    const container = document.getElementById('checkbox-container');
    // Clear existing checkboxes
    container.innerHTML = '';    
    // Generate the specified number of checkboxes
    for (let i = 1; i <= number; i++) {
         // Create the label element
        const label = document.createElement('label');
        label.className = 'circle-checkbox';
        label.id = `check-${i}`;
    
        // Create the input element
        const input = document.createElement('input');
        input.className = 'check-box'
        input.type = 'checkbox';
        input.id = `checkbox-${i}`;
        input.disabled = true;
        // Set the checkbox state from localStorage
        if (savedStates[input.id]) {
            input.checked = true;
        }   
        // Add event listener for 'change' event
        input.addEventListener('change', () => {
            savedStates[input.id] = input.checked;
            // Different actions for checked and unchecked states
            if (!input.checked) {
                input.disabled = true;
                delete savedStates[input.id]
            } 
            localStorage.setItem('checkboxStates', JSON.stringify(savedStates));
            updateProgress()
                    });
            // Create the span element
            const span = document.createElement('span');   
            // Append input and span to label
            label.appendChild(input);
            label.appendChild(span);  
            // Append the label to the container
            container.appendChild(label);
        }
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++CHECKBOXES CHECKER
 // Custom confirmation modal
 function confirme() {
     // Show the custom modal
     document.getElementById("customModal").style.display = "flex";
 }

 function handleResponse(response) {
     if (response) {
         cycleCheckboxes();
     }
     // Close the modal after the user selects an option
     document.getElementById("customModal").style.display = "none";
 }
//===================================================the saved states of the checkboxes
//TO CHECK CHECKBOXES ONCE THE EVENT REQUIRED
 function cycleCheckboxes() {
    const checkboxes = document.querySelectorAll('#checkbox-container input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.disabled = true;
    });
    const checkedCount = document.querySelectorAll('.check-box:checked').length
    // Check the current checkbox and save its state
     if (checkboxes[checkedCount]) {
        checkboxes[checkedCount].checked = true;
        //TO ENABLE USER TO UNCHECK CHECKBOX MANUALLY
        checkboxes[checkedCount].disabled = false;
        // Update the saved states in localStorage
        savedStates[checkboxes[checkedCount].id] = true;
        localStorage.setItem('checkboxStates', JSON.stringify(savedStates));
        tikrarLength = Object.keys(savedStates).length
    } 
    updateProgress()

    tikrarLength = Object.keys(savedStates).length
    tikrarPercentage = (tikrarLength / lunch)*100
    progressBar.style.width = tikrarPercentage + '%'

}

function updateProgress(){
    tikrarLength = Object.keys(savedStates).length
    tikrarPercentage = (tikrarLength / lunch)*100
    progressBar.style.width = tikrarPercentage + '%'
    goalContainer.innerHTML=lunch
    counter.innerHTML= tikrarLength
} 
//========================Refresh function
const refresh = document.querySelector('.refresh');
refresh.addEventListener('click', function () {
    refreshFunction()
});
function refreshFunction(){
    // Get all checkboxes and uncheck them
    const checkboxes = document.querySelectorAll('#checkbox-container input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.disabled = true;        
    });
    // Clear the checkbox states from localStorage
    savedStates= {}
    localStorage.setItem('checkboxStates', JSON.stringify(savedStates));
    updateProgress()
}

