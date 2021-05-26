export const getCurrentDateString = () => {
  let date = new Date();

  let day = date.getDate();
  if (day < 10) day = "0" + day;

  let month = date.getMonth() + 1;
  if (month < 10) month = "0" + month;

  let hours = date.getHours();
  if (hours < 10) hours = "0" + hours;

  let minutes = date.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;

  let seconds = date.getSeconds();
  if (seconds < 10) seconds = "0" + seconds;

  let milliseconds = date.getMilliseconds();
  if (milliseconds < 100) milliseconds = "0" + milliseconds;
  if (milliseconds < 10) milliseconds = "0" + milliseconds;

  return date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + ":" + milliseconds;
};
