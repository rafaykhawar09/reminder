
class Reminder{
     constructor(DATA){
          this.data = DATA;
          this.checked = "false";
          this.submitted = "true";
     }
};

class aTime{
     constructor(HOUR, REM_COUNT){
          this.hour = HOUR;
          this.remCount = REM_COUNT;
          this.reminders = [];
     }
};


function save_newly_created_task_to_localSt(aDay, hour, aReminder){

     if( localStorage.getItem("data") === null)
          localStorage.setItem("data", JSON.stringify(aDay));
     else{
          // get the previous data
          let prevData = JSON.parse(localStorage.getItem("data", JSON.stringify(aDay)));
          
          // aDay[hour] => gives us the newly added reminders/data with respect to a particular time       
          prevData[hour].reminders.push(aReminder);
          prevData[hour].remCount = aDay[hour].remCount;

          localStorage.setItem("data", JSON.stringify(prevData));
     }
};

function save_edited_task_to_localSt(hour, prevValue, newValue){

     // get the previous data
     if(localStorage.getItem("data") !== null){
          let prevData = JSON.parse(localStorage.getItem("data", JSON.stringify(aDay)));

          for (let i = 0; i < prevData[hour].reminders.length; i++) {
               
               if( prevData[hour].reminders[i].data === prevValue )
                    prevData[hour].reminders[i].data = newValue;
          }
          
          localStorage.setItem("data", JSON.stringify(prevData));
     }
};

function save_checkedStatus_of_reminder_to_localStr(chkTxt, hour, chkStatus){
     
     // get the previous data
     let prevData = JSON.parse(localStorage.getItem("data", JSON.stringify(aDay)));
     
     for (let i = 0; i < prevData[hour].reminders.length; i++) {
          
          if( prevData[hour].reminders[i].data === chkTxt )
               prevData[hour].reminders[i].checked = chkStatus;
     }
     
     localStorage.setItem("data", JSON.stringify(prevData));
};

let aDay = [];
let totalHours = 24;

// initializing a single DAY's array
for (let i = 0; i < totalHours; i++) {
     let temp = new aTime(i, 0);
     aDay.push(temp);
}

let newTask = `<div class="a-task">
<div class="radio-btn hidden" data-checked="false">
<div class="checked hidden"></div>
</div>

<form class="a-task-form" data-submitted="false">
<label>
     <div class="a-marker">
          <div class="bar"></div>
          <div class="bar"></div>
     </div>
     <input type="text" placeholder="New Reminder" class="txt-field l-txt" data-value="">
</label>
</form>

<div class="delete-btn delete-btn-disable">
     <i class="far fa-trash-alt"></i>
</div>
</div>`;

// Local Storage Structure
// 1st Index => DATE
// 2nd Index => All data regarding that particular DATE 
$(document).ready(function(){

     let todaysDate = moment().format("dddd, MMMM D, Y");
     $(".date-today").text(todaysDate);

     let localIsEmpty = window.localStorage.length;
     
     // IF => Local storage is empty, push today's date
     if( localIsEmpty === 0)
          localStorage.setItem("date", todaysDate);
     // ELSE 
     else{
          // IF => TODAY's DATE =/= EXTRACTED DATE - empty local storage & push today's date
          if(todaysDate !== localStorage.getItem("date")){
               localStorage.clear();
               localStorage.setItem("date", todaysDate);
          }
          //   ELSE => Extract & Plop the DATA onto the page
          else{
               if(localStorage.getItem("data") !== null){
                    
                    let data = JSON.parse(localStorage.getItem("data"));
                    let timelineRow = $(".a-timeline-row");

                    // console.log(data, timelineRow);
                    for (let i = 0; i < data.length; i++) {
                         
                         if(data[i].remCount >= 1){

                              $(timelineRow[i]).attr("data-count", data[i].remCount);

                              for (let j = 0, k = 1; j < data[i].remCount; j++, k++){

                                   let task;

                                   if( data[i].reminders[j].checked === "false" ){
                                        
                                        task = `<div class="a-task">
                                        <div class="radio-btn" data-checked="${data[i].reminders[j].checked}">
                                        <div class="checked hidden"></div>
                                        </div>
                                        
                                        <form class="a-task-form" data-submitted="${data[i].reminders[j].submitted}">
                                        <label>
                                             <div class="a-marker hidden">
                                                  <div class="bar"></div>
                                                  <div class="bar"></div>
                                             </div>
                                             <input type="text" placeholder="New Reminder" class="txt-field l-txt" data-value="${data[i].reminders[j].data}" value="${data[i].reminders[j].data}">
                                        </label>
                                        </form>

                                        <div class="delete-btn delete-btn-active">
                                             <i class="far fa-trash-alt"></i>
                                        </div>
                                        </div>`;
                                   }
                                   else{

                                        task = `<div class="a-task">
                                        <div class="radio-btn" data-checked="${data[i].reminders[j].checked}">
                                        <div class="checked"></div>
                                        </div>
                                        
                                        <form class="a-task-form" data-submitted="${data[i].reminders[j].submitted}">
                                        <label>
                                             <div class="a-marker hidden">
                                                  <div class="bar"></div>
                                                  <div class="bar"></div>
                                             </div>
                                             <input type="text" placeholder="New Reminder" class="txt-field l-txt" data-value="${data[i].reminders[j].data}" value="${data[i].reminders[j].data}">
                                        </label>
                                        </form>

                                        <div class="delete-btn delete-btn-active">
                                             <i class="far fa-trash-alt"></i>
                                        </div>
                                        </div>`;
                                   }

                                   $(task).insertBefore($($(timelineRow[i]).children()[k]));
                              }
                         }
                    }
               }
          }
     }
});

$(".a-timeline-row").on("submit", ".a-task-form", function(event){
     
     event.preventDefault();
     
     // The "data-submitted" attribute is used to ensure that a "newTask" is only appended ONCE. 
     // This ensures that a "newTask" is NOT appended when the user edits a previosuly created task.  
     
     // IF => new task is CREATED
     // ELSE => a previously created task is EDITED 
     if( $(this).attr("data-submitted") === "false" ){
          if( $($($(this).children()[0]).children()[1]).val() !== "" ){
               
               $(this).attr("data-submitted", "true");

               let timelineRow = $(this).parent().parent();
               let count = timelineRow.attr("data-count");
               
               timelineRow.append(newTask);
               timelineRow.attr("data-count", ++count);
               
               // Removing the "plus" marker
               if( $($($(this).children()).children()[0]).hasClass("a-marker") )
                    $($($(this).children()).children()[0]).addClass("hidden");

               // Enabling the "radio-btn", which will be unchecked by default
               if( $($(this).siblings()[0]).hasClass("radio-btn") && $($(this).siblings()[0]).hasClass("hidden") )
                    $($(this).siblings()[0]).removeClass("hidden");

               // Focusing out of the input field & saving the input field's value in a data attribute for easy access to the value later on.
               $($($(this).children()[0]).children()[1]).blur();
               $($($(this).children()[0]).children()[1]).attr("data-value", $($($(this).children()[0]).children()[1]).val());

               $($(this).siblings()[1]).removeClass("delete-btn-disable");
               $($(this).siblings()[1]).addClass("delete-btn-active");

               // The following block of code sets up a NEW reminder to be pushed each time, with respective to it's HOUR.
               // This is also the reason why "class Reminder" constructor only takes in "data" as a parameter, the other 2 members can be initialized with hard-coded values.
               let data = $($($(this).children()[0]).children()[1]).attr("data-value");
               let aReminder = new Reminder(data);

               let hour = timelineRow.attr("data-hour");
               aDay[hour].reminders.push(aReminder);
               
               let remCount = timelineRow.attr("data-count");
               aDay[hour].remCount = remCount;

               // SAVING TO LOCAL STORAGE
               save_newly_created_task_to_localSt(aDay, hour, aReminder);
          }
     }
     else{
          // IF => re-submit & field is empty the last value will be shown again.
          // ELSE => show new value & also save it to data-value attribute.
          if( $($($(this).children()[0]).children()[1]) === "" )
               $($($(this).children()[0]).children()[1]).attr("data-value");
          else{
               let hour = $(this).parent().parent().attr("data-hour");
               let prevValue = $($($(this).children()[0]).children()[1]).attr("data-value");
               let newValue;

               $($($(this).children()[0]).children()[1]).attr("data-value", $($($(this).children()[0]).children()[1]).val());
               
               newValue = $($($(this).children()[0]).children()[1]).attr("data-value");

               // UPDATING LOCAL STORAGE
               save_edited_task_to_localSt(hour, prevValue, newValue);
          }

          // focusout out of text field
          $($($(this).children()[0]).children()[1]).blur();
     }
});

$(".a-timeline-row").on("focusout", ".txt-field", function(){

     if( $(this).parent().parent().attr("data-submitted") === "false" ){
          if( $(this).val() !== "" ){
               
               $(this).parent().parent().attr("data-submitted", "true");
               
               $(this).attr("data-value", $(this).val());
               
               if( !($($($(this).parent().parent().siblings()[0]).children()[0]).hasClass("hidden")) ){
                    $($($(this).parent().parent().siblings()[0]).children()[0]).addClass("hidden")
               }
               
               $(this).parent().parent().parent().parent().append(newTask);
               
               let count = $(this).parent().parent().parent().parent().attr("data-count");
               $(this).parent().parent().parent().parent().attr("data-count", ++count);

               $($(this).siblings()[0]).addClass("hidden");
               $($(this).parent().parent().siblings()[0]).removeClass("hidden");

               $($(this).parent().parent().siblings()[1]).removeClass("delete-btn-disable");
               $($(this).parent().parent().siblings()[1]).addClass("delete-btn-active");
               
               let data = $(this).attr("data-value");
               let aReminder = new Reminder(data);

               let hour = $(this).parent().parent().parent().parent().attr("data-hour");
               aDay[hour].reminders.push(aReminder);
               
               let remCount = $(this).parent().parent().parent().parent().attr("data-count");
               aDay[hour].remCount = remCount;

               // SAVING TO LOCAL STORAGE
               save_newly_created_task_to_localSt(aDay, hour, aReminder);
          }
     }
     else{
          // IF => re-submit & field is empty the last value will be shown again.
          // ELSE => show new value & also save it to data-value attribute. UPDATE LOCAL STORAGE.
          if( $(this).val() === "" )
               $(this).val($(this).attr("data-value"));
          else{
               let hour = $(this).parent().parent().parent().parent().attr("data-hour");
               let prevValue = $(this).attr("data-value");
               let newValue;

               $(this).attr("data-value", $(this).val());

               newValue = $(this).attr("data-value");

               // UPDATING LOCAL STORAGE
               save_edited_task_to_localSt(hour, prevValue, newValue);
          }    
     }
});

$(".a-timeline-row").on("click", ".radio-btn", function(){

     let chkTxt = $($($($(this).siblings()[0]).children()[0]).children()[1]).attr("data-value");
     let hour = $(this).parent().parent().attr("data-hour");

     if( $($(this).children()[0]).hasClass("hidden") ){
          
          $($(this).children()[0]).removeClass("hidden");
          $(this).attr("data-checked", "true");

          save_checkedStatus_of_reminder_to_localStr( chkTxt, hour, $(this).attr("data-checked") );
     }
     else{
          $($(this).children()[0]).addClass("hidden");
          $(this).attr("data-checked", "false");

          save_checkedStatus_of_reminder_to_localStr( chkTxt, hour, $(this).attr("data-checked") );
     }
});

$(".a-timeline-row").on("click", ".delete-btn", function(){

     // IF => button state is "ACTIVE"
     //   remove the reminder from VIEW 
     //   remove from LOCAL STORAGE
     //   update the reminder count for the timeblock 

     if($(this).hasClass("delete-btn-active")){

          let hour = $(this).parent().parent().attr("data-hour");
          let data = $($($($(this).siblings()[1]).children()[0]).children()[1]).attr("data-value");

          let count = $(this).parent().parent().attr("data-count");
          count--;

          $(this).parent().parent().attr("data-count", count);
          $(this).parent().remove();

          let prevData = JSON.parse(localStorage.getItem("data"));

          for (let i = 0; i < prevData[hour].reminders.length; i++) {
               
               if(prevData[hour].reminders[i].data === data){
                    prevData[hour].reminders.splice(i, 1);
                    prevData[hour].remCount--;
                    break;
               }
          }

          localStorage.setItem("data", JSON.stringify(prevData));
     }
});


let interval = parseInt(moment().format("m")); 
interval = (60 - interval)*60*1000;

let runInterval = setInterval(request, interval);
function request(){

     clearInterval(runInterval);

     interval = 3600000;

     let todaysDate = moment().format("dddd, MMMM D, Y");
     let localSt_Date = localStorage.getItem("date");

     // IF => dates are not the same, clear local storage and push today's date
     if(todaysDate !== localSt_Date){

          localStorage.clear();
          localStorage.setItem("date", todaysDate);
     }

     runInterval(request, interval);
}