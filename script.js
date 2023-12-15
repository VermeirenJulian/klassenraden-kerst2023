function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function updateTimingAndRemovePassed(lokaalId) {
    const lokaal = document.getElementById(lokaalId);
    const timingList = lokaal.querySelector('.timing-list');

    const currentTime = getCurrentTime();

    const tijdsintervallen = timingList.querySelectorAll('li');
    tijdsintervallen.forEach((tijdsinterval) => {
        const timingText = tijdsinterval.textContent;
        const startEndTimes = timingText.match(/(\d{2}:\d{2}) - (\d{2}:\d{2}): (.*)/);
        if (startEndTimes) {
            const startTime = startEndTimes[1];
            const endTime = startEndTimes[2];
            const klasInfo = startEndTimes[3];

            if (currentTime >= endTime) {
                // Verwijder het tijdsinterval als de tijd is verstreken
                tijdsinterval.remove();
            } else {
                // Update de opmaak voor het huidige tijdsinterval
                if (currentTime >= startTime && currentTime <= endTime) {
                    tijdsinterval.classList.add('current-time');
                } else {
                    tijdsinterval.classList.remove('current-time');
                }
            }
        }
    });
}

function verlengKlassenraad() {
    const adminKey = prompt('Voer de beheerdersleutel in:');

    // Controleer hier of de ingevoerde sleutel overeenkomt met de verwachte sleutel
    // Voorbeeld: Vergelijk met een bekende sleutel zoals 'admin123'
    if (adminKey === 'admin123') {
        const selectedLokaal = document.getElementById('lokaalSelect').value;
        const lokaal = document.getElementById(selectedLokaal);
        const timingList = lokaal.querySelector('.timing-list');

        const tijdsintervallen = timingList.querySelectorAll('li');
        tijdsintervallen.forEach((tijdsinterval) => {
            const timingText = tijdsinterval.textContent;
            const startEndTimes = timingText.match(/(\d{2}:\d{2}) - (\d{2}:\d{2}): (.*)/);
            if (startEndTimes) {
                const startTime = startEndTimes[1];
                const endTime = startEndTimes[2];
                const klasInfo = startEndTimes[3];

                const newStartTime = addMinutes(startTime, 10);
                const newEndTime = addMinutes(endTime, 10);

                tijdsinterval.textContent = `${newStartTime} - ${newEndTime}: ${klasInfo}`;
            }
        });

        updateTimingAndRemovePassed(selectedLokaal);
    } else {
        alert('Ongeldige beheerdersleutel');
    }
}

function addMinutes(time, minutes) {
    const [hours, currentMinutes] = time.split(':').map(Number);
    const newMinutes = (currentMinutes + minutes) % 60;
    const newHours = hours + Math.floor((currentMinutes + minutes) / 60);
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}

function startInterval(lokaalId) {
    updateTimingAndRemovePassed(lokaalId);
    setInterval(() => {
        updateTimingAndRemovePassed(lokaalId);
    }, 60000);
}

// Roept de intervalfunctie aan voor elk lokaal
document.addEventListener('DOMContentLoaded', function () {
    startInterval('lokaal1');
    startInterval('lokaal2');
    startInterval('lokaal3');

    // Toon beheerdersectie
    showAdminControls();
});

// Voeg deze functie toe om de beheerdersectie te tonen
function showAdminControls() {
    document.getElementById('admin-section').classList.remove('hidden');
}
