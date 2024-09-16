const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const stopAlarmBtn = document.getElementById('stopAlarmBtn');
const workTimeRange = document.getElementById('workTimeRange');
const breakTimeRange = document.getElementById('breakTimeRange');
const workTimeValue = document.getElementById('workTimeValue');
const breakTimeValue = document.getElementById('breakTimeValue');
const progressRing = document.querySelector('.progress-ring__circle');
const colorOptions = document.querySelectorAll('.color-option');
const colorPaletteIcon = document.getElementById('colorPaletteIcon');
const colorOptionsContainer = document.getElementById('colorOptionsContainer');

let timer;
let isWorking = true;
let timeLeft;
let totalTime;
let alarmSound;

// Circle properties for progress ring
const radius = 145;
const circumference = 2 * Math.PI * radius;

progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressRing.style.strokeDashoffset = offset;
}

// Functionality (Start, Pause, Reset)
startPauseBtn.addEventListener('click', () => {
    if (timer) {
        clearInterval(timer);
        timer = null;
        startPauseBtn.textContent = 'Start';
    } else {
        if (timeLeft === undefined) {
            totalTime = isWorking ? getTimerDuration(workTimeRange.value) : getTimerDuration(breakTimeRange.value);
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
                document.title = 'Pomodoro Timer';
                playAlarm();

                if (!isWorking) {
                    showResetButtonOnly();
                }
            }
        }, 1000);
    }
});

resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    timer = null;
    startPauseBtn.textContent = 'Start';
    timeLeft = undefined;
    isWorking = true; // Reset to work timer
    minutesElement.textContent = '00'; // Set timer display to 00:00
    secondsElement.textContent = '00';
    document.title = 'Pomodoro Timer'; // Reset title when reset
    stopAlarmBtn.style.display = 'none'; // Hide Stop Alarm button
    startPauseBtn.style.display = 'block'; // Show Start button again
    resetBtn.style.display = 'none'; // Hide the reset button
    stopAlarm(); // Ensure alarm is stopped if it was playing
});

function getTimerDuration(value) {
    return value * 60;
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
    setProgress((timeLeft / totalTime) * 100);

    document.title = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - Pomodoro Timer`;
}

function playAlarm() {
    alarmSound = new Audio('audio/alarm.mp3');
    alarmSound.play();
    stopAlarmBtn.style.display = 'block';
}

stopAlarmBtn.addEventListener('click', () => {
    stopAlarm();
    isWorking = false;
    totalTime = getTimerDuration(breakTimeRange.value);
    timeLeft = totalTime;
    startPauseTimer();
    stopAlarmBtn.style.display = 'none';
});

function stopAlarm() {
    if (alarmSound) {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }
}

function showResetButtonOnly() {
    startPauseBtn.style.display = 'none';
    stopAlarmBtn.style.display = 'none';
    resetBtn.style.display = 'block';
}

function startPauseTimer() {
    startPauseBtn.textContent = 'Pause';
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimer();
        } else {
            clearInterval(timer);
            timer = null;
            document.title = 'Pomodoro Timer';
            playAlarm();

            if (!isWorking) {
                showResetButtonOnly();
            }
        }
    }, 1000);
}

workTimeRange.addEventListener('input', () => {
    workTimeValue.textContent = `${workTimeRange.value} minutes`;
});

breakTimeRange.addEventListener('input', () => {
    breakTimeValue.textContent = `${breakTimeRange.value} minutes`;
});

// Handle color selection for the accent color
colorOptions.forEach(option => {
    option.addEventListener('click', (event) => {
        const selectedColor = option.getAttribute('data-color');
        document.documentElement.style.setProperty('--accent-color', selectedColor);
        updateVisualElements();
        event.stopPropagation();
    });
});

function updateVisualElements() {
    progressRing.style.stroke = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
    minutesElement.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
    secondsElement.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
    startPauseBtn.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
    stopAlarmBtn.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
    resetBtn.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
}

// Show and hide the color options container
colorPaletteIcon.addEventListener('click', (event) => {
    colorOptionsContainer.style.display = colorOptionsContainer.style.display === 'flex' ? 'none' : 'flex';
    event.stopPropagation();
});

// Hide color options when clicking outside
document.body.addEventListener('click', () => {
    colorOptionsContainer.style.display = 'none';
});
