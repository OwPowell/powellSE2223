const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const d = new Date();

let month = months[d.getMonth()];
let day = d.getDate();
let year = d.getFullYear();

let currentDate = `The current date is: ${month} ${day}, ${year}`;

console.log(d);
console.log(currentDate);