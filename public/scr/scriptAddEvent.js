function openPopup(day) {
    const dateInput = document.getElementById('date');
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    dateInput.value = formattedDate;

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

closeButton.addEventListener('click', () => {
    eventPopup.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === eventPopup) {
        eventPopup.style.display = 'none';
    }
});

eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = eventForm.title.value;
    const date = eventForm.date.value;
    const time = eventForm.time.value;
    const category = eventForm.category.value;
    const description = eventForm.description.value;
    const groupe = eventForm.groupe.value;

    // Traitement de l'événement (ajouter à la base de données, afficher sur le calendrier, etc.)
    console.log('Event added:', { title, date, time, category, description, groupe });

    eventPopup.style.display = 'none';
    eventForm.reset();
});

document.addEventListener('page_loaded', assignDayClickHandlers);
