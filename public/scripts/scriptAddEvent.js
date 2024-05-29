function openPopup(day) {
    const dateInput = document.getElementById('date');
    const startTimeInput = document.getElementById('start_time');
    const endTimeInput = document.getElementById('end_time');

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    dateInput.value = formattedDate;

    let hours = today.getHours();
    let minutes = today.getMinutes();

    if (minutes % 10 !== 0) {
        minutes = Math.ceil(minutes / 10) * 10;
        if (minutes === 60) {
            minutes = 0;
            hours += 1;
        }
    }

    const formattedStartTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    startTimeInput.value = formattedStartTime;

    let endHours = hours;
    let endMinutes = minutes + 0;
    if (endMinutes === 60) {
        endMinutes = 0;
        endHours += 1;
    } else {
        endMinutes = (minutes + 60) % 60;
        endHours = (hours + Math.floor((minutes + 60) / 60)) % 24;
    }
    
    const formattedEndTime = `${endHours < 10 ? '0' + endHours : endHours}:${endMinutes < 10 ? '0' + endMinutes : endMinutes}`;
    endTimeInput.value = formattedEndTime;

    const eventPopup = document.getElementById('event_popup');
    eventPopup.style.display = 'block';
}

function openPopupForButton() {
    const dateInput = document.getElementById('date');
    const startTimeInput = document.getElementById('start_time');
    const endTimeInput = document.getElementById('end_time');

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    // Arrondir les minutes à la dizaine supérieure
    if (minutes % 10 !== 0) {
        minutes = Math.ceil(minutes / 10) * 10;
        if (minutes === 60) {
            minutes = 0;
            hours += 1;
        }
    }

    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    dateInput.value = formattedDate;

    const formattedStartTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    startTimeInput.value = formattedStartTime;

    // Calculer l'heure de fin en ajoutant 1 heure à l'heure arrondie
    let endHours = hours;
    let endMinutes = minutes + 0;
    if (endMinutes === 60) {
        endMinutes = 0;
        endHours += 1;
    } else {
        endMinutes = (minutes + 60) % 60;
        endHours = (hours + Math.floor((minutes + 60) / 60)) % 24;
    }

    const formattedEndTime = `${endHours < 10 ? '0' + endHours : endHours}:${endMinutes < 10 ? '0' + endMinutes : endMinutes}`;
    endTimeInput.value = formattedEndTime;

    const eventPopup = document.getElementById('event_popup');
    eventPopup.style.display = 'block';
}

function assignDayClickHandlers() {
    let currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        let day_id = 'cells_' + i.toString();
        var day_div = document.getElementById(day_id);
        if (day_div) {
            day_div.addEventListener('click', (function(day) {
                return function() {
                    openPopup(day);
                };
            })(i));
        }
    }
}

const closeButton = document.querySelector('.close_button');
const eventForm = document.getElementById('eventForm');
const eventPopup = document.getElementById('event_popup');
const eventButton = document.getElementById('createEvent');

closeButton.addEventListener('click', () => {
    eventPopup.style.display = 'none';
});

eventButton.addEventListener('click', () => openPopupForButton());

window.addEventListener('click', (event) => {
    if (event.target === eventPopup) {
        eventPopup.style.display = 'none';
    }
});

eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = eventForm.title.value;
    const date = eventForm.date.value;
    const start_time = eventForm.start_time.value;
    const end_time = eventForm.end_time.value;
    const category = eventForm.category.value;
    const description = eventForm.description.value;
    const groupe = eventForm.groupe.value;

    console.log('Event added:', { title, date, start_time, end_time, category, description, groupe });

    eventPopup.style.display = 'none';
    eventForm.reset();
});

document.addEventListener('page_loaded', assignDayClickHandlers);
