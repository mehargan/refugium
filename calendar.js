arr_date = [];
arr_day = []

// '12/7,12/8,3/2'
// the arr_day is going to be an array of string that 
function arrayOfDates(timestamp){
  
  var arr_date = timestamp.split(',');

  let new_arr = []
  for(j = 0; j < arr_date.length; j++){
    let str_len = j.length;
    new_arr.push(j[str_len-1])
  }
  // ['7','8','2']


}
const date = new Date();

const renderCalendar = () => {
  date.setDate(1);

  let monthDaysNew = document.querySelectorAll(".days");
  const monthDays = document.querySelector(".days");

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();

  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];


  let x = document.querySelectorAll(".date h1");
  for (var i = 0; i < x.length; i++) {
    x[i].innerHTML = months[date.getMonth()];
}

  let p = document.querySelectorAll(".date p");
  for (var i = 0; i < p.length; i++) {
    p[i].innerHTML = new Date().toDateString();
}

  let days = "";
  // let dates = new Array(2,3,4,5)
  let arr = [1,2,8,12]
  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }
  for (let i = 1; i <= lastDay; i++) {
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
    } else {
      if (arr.includes(i)) {
        days += `<div class="today">${i}</div>`;
      }
      else {
        days += `<div>${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
    for (let k = 0; k < monthDaysNew.length; k++) {
        monthDaysNew[k].innerHTML = days;
    }
    // monthDays.innerHTML = days;
  }
};

let prev_query = document.querySelectorAll('.prev');
for (let i = 0; i < prev_query.length; i++) {
    prev_query[i].addEventListener("click", () => {
        date.setMonth(date.getMonth() - 1);
        renderCalendar();
    });
}
// document.querySelector(".prev").addEventListener("click", () => {
//   date.setMonth(date.getMonth() - 1);
//   renderCalendar();
// });

let next_query = document.querySelectorAll('.next');
for (let i = 0; i < next_query.length; i++) {
    next_query[i].addEventListener("click", () => {
        date.setMonth(date.getMonth() + 1);
        renderCalendar();
      });
}
// document.querySelector(".next").addEventListener("click", () => {
//   date.setMonth(date.getMonth() + 1);
//   renderCalendar();
// });

renderCalendar();