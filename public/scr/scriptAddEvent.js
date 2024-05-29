function openPopup(day) {
    console.log(`openPopup called for day: ${day}`);
    const dateInput = document.getElementById('date');
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    dateInput.value = formattedDate;

    const eventPopup = document.getElementById('event_popup');
    eventPopup.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const today = new Date();
    const calendar = document.getElementById('calendar');
    const eventPopup = document.getElementById('event_popup');  // Changed to match your HTML
    const closeButton = document.querySelector('.close_button');
    const eventForm = document.getElementById('eventForm');
    const createEventButoon = document.getElementById('createEvent')

    closeButton.addEventListener('click', () => {
        eventPopup.style.display = 'none';
    });
    createEventButoon.addEventListener('click', ()=> {

        openPopup(today.getDate());
    } ) 

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

    function attachEventListeners() {
        console.log('Attaching event listeners to calendar days');
        let currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            let day_id = 'cells_' + i.toString();
            var day_div = document.getElementById(day_id);
            if (day_div) {
                console.log(`Attaching event listener to day: ${i}`);
                day_div.addEventListener('click', (function(day) {
                    return function() {
                        openPopup(day);
                    };
                })(i));
            } else {
                console.warn(`Element not found: ${day_id}`);
            }
        }
    }

    // Call attachEventListeners directly after the month view is created
    attachEventListeners();
/*
    // Override the showMonth function to attach event listeners after creating the calendar
    const originalShowMonth = showMonth;
    window.showMonth = function() {
        originalShowMonth();
        attachEventListeners();
    };

    // Trigger the initial showMonth to set up the calendar
    showMonth();
*/
});
