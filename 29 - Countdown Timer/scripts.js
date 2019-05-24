const MILLI_TO_SECONDS = 1000;
const TIME_UNIT_MULTIPLIER = 60;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');
let countdown;

function timer(seconds) {
  clearInterval(countdown); //clear existing timers;

  const now = Date.now();
  const then = now + (seconds * MILLI_TO_SECONDS);

  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / MILLI_TO_SECONDS);

    // check if we should stop the timer countdown
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }

    // display the time left
    displayTimeLeft(secondsLeft);
  }, MILLI_TO_SECONDS);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / TIME_UNIT_MULTIPLIER);
  const remainderSeconds = seconds % TIME_UNIT_MULTIPLIER;
  const secondDigit = remainderSeconds < 10 ? '0' : '';

  const display = `${minutes}:${secondDigit}${remainderSeconds}`;

  document.title = display;
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const minutes = end.getMinutes();

  const adjustedHour = hour > 12 ? hour- 12 : hour;
  const timeUnit = hour > 12 ? 'pm' : 'am';
  const minuteDigitPlaceholder = minutes < 10 ? '0' : '';

  endTime.textContent = `
    Be back at ${adjustedHour}:${minuteDigitPlaceholder}${minutes} ${timeUnit}
  `;
}

function startTimer() {
  const seconds = +this.dataset.time; // + is shorthand for parseInt()
  timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));

/**
 * document.customForm gives you the form with the `name="customForm"`
 * document.customForm.minutes gives you the input with the `name="minutes"`
 *
 */
document.customForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const mins = this.minutes.value;
  timer(mins * TIME_UNIT_MULTIPLIER);
  this.reset();
});
