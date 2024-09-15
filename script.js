const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const workDial = document.getElementById('workDial');
const breakDial = document.getElementById('breakDial');
const progressRing = document.querySelector('.progress-ring__circle');
const statusText = document.getElementById('statusText');
const pomodoroCountElement = document.getElementById('pomodoroCount');
const toggleThemeBtn = document.getElementById('toggleTheme');
const accentColorInput = document.getElementById('accentColor');

let timer;
let isWorking = true;
let timeLeft;
let totalTime;
let pomodoroCount = 0;

const radius = 145;
const circumference = 2 * Math.PI * radius;

progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressRing.style.strokeDashoffset = offset;
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
    setProgress((timeLeft / totalTime) * 100);
    updateTabTitle(minutes, seconds);
}

function updateTabTitle(minutes, seconds) {
    document.title = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - Pomodoro Timer`;
}

function playAlarm() {
    const audio = new Audio('alarm.mp3');
    audio.play().catch(error => console.error('Error playing audio:', error));
}

function startPauseTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
        startPauseBtn.textContent = 'Start';
    } else {
        if (timeLeft === undefined) {
            totalTime = isWorking ? getSelectedTime(workDial) * 60 : getSelectedTime(breakDial) * 60;
            timeLeft = totalTime;
        }
        startPauseBtn.textContent = 'Pause';
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimer();
            } else {
                clearInterval(timer);
                timer = null;
                playAlarm();
                if (isWorking) {
                    pomodoroCount++;
                    pomodoroCountElement.textContent = pomodoroCount;
                }
                isWorking = !isWorking;
                updateStatus();
                startPauseTimer();
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    isWorking = true;
    timeLeft = undefined;
    startPauseBtn.textContent = 'Start';
    updateStatus();
    updateTimer();
}

function updateStatus() {
    statusText.textContent = isWorking ? "Work Time" : "Break Time";
    updateAccentColor();
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
}

function updateAccentColor() {
    const color = isWorking ? accentColorInput.value : '#2196F3';
    document.documentElement.style.setProperty('--accent-color', color);
    progressRing.style.stroke = color;
}

function getSelectedTime(dial) {
    const activeButton = dial.querySelector('.dial-btn.active');
    return activeButton ? parseInt(activeButton.dataset.value) : parseInt(dial.querySelector('.dial-btn').dataset.value);
}

function initializeDials() {
    [workDial, breakDial].forEach(dial => {
        dial.querySelectorAll('.dial-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                dial.querySelectorAll('.dial-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                resetTimer();
            });
        });
        dial.querySelector('.dial-btn').classList.add('active');
    });
}

startPauseBtn.addEventListener('click', startPauseTimer);
resetBtn.addEventListener('click', resetTimer);
toggleThemeBtn.addEventListener('click', toggleTheme);
accentColorInput.addEventListener('change', updateAccentColor);

initializeDials();
resetTimer();