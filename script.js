function printEventList(){
    eventList.forEach(event => console.log(
        event.startTime, 
        event.endTime, 
        event.owner,
        event.title,
        event.description
    ));
}

function getDateList(){
    let dateList = []
    let today = new Date();
    let currentDay = ((today.getDay() - 1) % 7 + 7) % 7; //Weekly day number (1-7)
    console.log(currentDay)
    let currentDayOfMonth = today.getDate();
    let startDate = new Date(today);
    startDate.setDate(currentDayOfMonth - currentDay);
    let endDate = new Date(today);
    endDate.setDate(currentDayOfMonth + (6 - currentDay));
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        dateList.push(date.getDate())
    }
    return dateList;
}

function setWeekView(dateList){
    let container =  document.getElementById("calendar");
    for (let i = 0; i < 7; i++) {
        let newDiv = document.createElement('div');
        newDiv.className = "column";
        newDiv.id = "column-" + dateList[i];
        let dayDiv = document.createElement('p');
        dayDiv.className = "dayDisp";
        dayDiv.id = "dayDisp-" + i;
        dayDiv.textContent = dayLabel[i];
        let dateDiv = document.createElement('p');
        dateDiv.className = "dateDisp";
        dateDiv.id = "dateDisp-" + dateList[i];
        dateDiv.textContent = dateList[i];
        newDiv.appendChild(dayDiv);
        newDiv.appendChild(dateDiv)
        container.appendChild(newDiv);
    }
    drawEventList();
    container.innerHTML += `
        <style>
            .eventDisp{
                border: 1px solid black;
                margin: 5px;
                position: absolute;
                width: ${1}%;
                left: 50px;
                height: 50%;
                border-radius: 100px;
                background-color: red;
                border: none;
                box-shadow: 0px 0px 5px;
            }
            .dateDisp{
                font-size: 2em;
                margin: 0px;
            }
            .dayDisp{
                margin-bottom: 5px;
            }
            .column{
                border: 1px solid lightGrey;
                color: grey; 
                flex: 2;
                height: 100%;
                min-width: 100px;
                font-family: monospace;
                text-align: center;
            }
            #calendar{
                justify-content: flex-start;
                display: flex; 
                flex-direction: row;
                flex-wrap: wrap;
                overflow-x: auto;
                overflow-y: hidden;
                flex-wrap: nowrap;
                position: relative;
            }
        </style>
    `
    //Array.from(document.getElementsByClassName("column")).forEach(column => {column.style.border = "2px solid black";})
    
}

function drawEventList(){
    for (let i = 0; i < length(eventList); i++){
        drawEvent(eventList[i]);
    }
}

function drawEvent(event){
    let column = document.getElementById(`column-${event.startTime.day()}`);
    let eventDiv = document.createElement('div');
    eventDiv.className = "eventDisp";
    eventDiv.textContent = "";
    column.appendChild(eventDiv);
    column.appendChild(eventDiv);
}

class CalendarEvent {
    constructor(date, start, end, owner, title, description) {
        this.startTime = new Date(`${date} ${start}`);
        this.endTime = new Date(`${date} ${end}`);
        this.owner = owner;
        this.title = title;
        this.description = description;
    }
}

let eventList = [];

document.getElementById("newEventButton").onclick = function(){
    let date = "";
    let start = "";
    let end = "";
    while (date == ""){
        date = window.prompt("Enter Date (dd/mm/yyyy)");
    }
    while (start == ""){
        start = window.prompt("Enter Start Time (hh:mm:)");
    }
    while (end == ""){
        end = window.prompt("Enter End Time (hh:mm)");
    }
    let description = window.prompt("Description (Optional)");
    eventList.push(new CalendarEvent(date, start, end, description, "green"));
}
document.getElementById("getEventList").onclick = function(){
    printEventList();
}


const dayLabel = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const dateList = getDateList();
setWeekView(dateList);

