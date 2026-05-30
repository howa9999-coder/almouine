
/* 
clear the code and fix my varibles */

let tasbihObject = JSON.parse(localStorage.getItem('tasbih-object')) || [];
let optionID = JSON.parse(localStorage.getItem("optionID")) || 'option-0';
const defaultBtn = document.querySelector('#default-btn')
let index
function renderTable() {
    const body = document.getElementById('tableBody');
    body.innerHTML = '';
    Object.entries(tasbihObject).forEach((option) => {
        const row = body.insertRow();
        row.innerHTML = `<td>${option[1].value}</td><td>${option[1].goal}</td><td>${Math.round(option[1].percent) +'%'}</td>`;
        row.onclick = () => showDetails(option[1].id);
    });
}
function defaultDikr(){
    tasbihObject = {
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
    localStorage.setItem('tasbih-object', JSON.stringify(tasbihObject))
    optionID = 'option-0'
    localStorage.setItem('optionID', JSON.stringify(optionID))
    renderTable()
}
renderTable()
const dikrInput = document.getElementById('dDikr')
const goalInput = document.getElementById('dGoal')
const detailViewBtnContainer = document.getElementById('detailView-btn-container')
        function showDetails(index) {
            const tasbihOption = tasbihObject[index];
            dikrInput.value = tasbihOption.value;
            goalInput.value = tasbihOption.goal;
            dikrInput.dataset.index = index
            goalInput.dataset.index = index
            document.getElementById('listView').classList.add('hidden');
            defaultBtn.classList.add('hidden')
            document.getElementById('detailView').classList.remove('hidden');
            detailViewBtnContainer.innerHTML=`
                <button id="save-btn" class="btn-add" data-index='${index}' onclick="saveChanges(this.dataset.index)">حفظ</button>
                <button id="delete-btn" class="btn-cancel" data-index='${index}' onclick="indexVal(this.dataset.index)">حذف</button>
                `
        } 
        function showList() {
            document.getElementById('listView').classList.remove('hidden');
            defaultBtn.classList.remove('hidden')
            document.getElementById('detailView').classList.add('hidden');
            renderTable()
        }

function saveChanges(index){
    tasbihObject[index].value = dikrInput.value
    tasbihObject[index].goal = parseInt(goalInput.value)
    localStorage.setItem('tasbih-object', JSON.stringify(tasbihObject))   
    showNotification(saveChangesMsg, '#2d5a27')
    showList()
}
function indexVal(indexValue){
    index = indexValue
    confirme(deleteMsg)
}
/* make a model for deleting */
function deleteTasbih(index){
    
   // console.log(tasbihObject[index].id)
    if (tasbihObject[index].id == 'option-0' && optionID == 'option-0') {
      //  console.log('OPTION ID 0')
      //  console.log(tasbihObject[index].id)
        optionID = Object.values(tasbihObject)[1].id
        localStorage.setItem('optionID', JSON.stringify(optionID));
    } else if(optionID == tasbihObject[index].id){
         //       console.log('OPTION ID OTHER 0')
      //  console.log(tasbihObject[index].id)
        /* to do: catch error if there is just one dikr left */
        optionID = Object.values(tasbihObject)[1].id 
        localStorage.setItem('optionID', JSON.stringify(optionID));
    } 
    delete tasbihObject[index]
    localStorage.setItem('tasbih-object', JSON.stringify(tasbihObject))  
    showNotification(deleteMsg2, '#c57659') 
}

/* Add new dikr */
// to do : redo the function to make sure that it wont generate an existing randomNum
// i can use an array to store all random num
function saveTasbih(){
    const randomNum = Math.round(Math.random()* 100)
    id = `option-${randomNum}`

    const entry ={
        value: document.getElementById('newDikr').value,
        goal: parseInt(document.getElementById('newGoal').value),
        count: 0,
        percent: 0,
        id: id,
        offset: 596.9026041820607
    }
    tasbihObject[id] = entry
    localStorage.setItem('tasbih-object', JSON.stringify(tasbihObject)); 
    renderTable();
    document.getElementById('entryModal').close();
    //Notification
    showNotification(saveMsg, '#2d5a27')
}

/* to do: Msg to arabic */
const message = document.getElementById("message")
const defaultMsg = 'العودة إلى الحالة الإفتراضية'
const deleteMsg = 'هل تريد حذف الذكر؟'
const saveMsg = 'تم حفظ الذكر بنجاح'
const deleteMsg2 = 'تم حذف الذكر'
const saveChangesMsg = 'تم حفظ التغييرات بنجاح'
let messageContentVar
function confirme(messageContent) {
    message.innerHTML = messageContent
    messageContentVar = messageContent
     // Show the custom modal
     document.getElementById("customModal").style.display = "flex";
 }
   function handleResponse(response) {
     if (response) {
         if(messageContentVar == defaultMsg){
            defaultDikr();
         }else{
            deleteTasbih(index)
         }
     }
     // Close the modal after the user selects an option
     document.getElementById("customModal").style.display = "none";
     if(response && messageContentVar == deleteMsg){
        showList()
     }
 }

const notification = document.querySelector('#notification')
 
function showNotification(message, color) {
    notification.innerHTML =  message
    notification.style.borderLeft = `8px solid ${color}`
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}