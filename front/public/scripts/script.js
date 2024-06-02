document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const weekdays = document.getElementById('weekdays');
    const todayButton = document.getElementById('today');
    const weekButton = document.getElementById('week');
    const monthButton = document.getElementById('month');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const monthNameElement = document.getElementById('month-name');


    const categoryColors = {
        'Formation': 'color-green',
        'Réunion': 'color-blue',
        'Conférence': 'color-red',
        'Social': 'color-yellow'
    };
    
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentView = 'month';

    todayButton.addEventListener('click', showToday);
    weekButton.addEventListener('click', showWeek);
    monthButton.addEventListener('click', showMonth);
    prevMonthButton.addEventListener('click', showPrevPeriod);
    nextMonthButton.addEventListener('click', showNextPeriod);

    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const dayNames = [
        "Lundi", "Mardi", "Mercredi",
        "Jeudi", "Vendredi", "Samedi", "Dimanche"
    ];

    var event_new_month = new Event("new_month");
    var event_new_week = new Event("new_week");
    var event_new_day = new Event("new_day");

    function showToday() {
        currentView = 'day';
        const today = new Date(currentDate);
        weekdays.classList.add('hidden');
        calendar.classList.add('full-height');
        const dayId = "cells_day";
        calendar.innerHTML = `<div id="${dayId}">${dayNames[(today.getDay() + 6) % 7]} ${today.getDate().toString().padStart(2, '0')}</div>`;
        monthNameElement.textContent = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
        monElement.classList.toggle('style-change');
        document.dispatchEvent(event_new_day);
    }

    function showWeek() {
        currentView = 'week';
        weekdays.classList.remove('hidden');
        calendar.classList.remove('full-height');
        calendar.innerHTML = '';
        const today = new Date(currentDate);
        const startOfWeek = today.getDate() - ((today.getDay() + 6) % 7);
        for (let i = 0; i < 7; i++) {
            const day = new Date(today.setDate(startOfWeek + i));
            const dayElement = document.createElement('div');
            
            dayElement.textContent = `${day.getDate().toString().padStart(2, '0')}`;
            let id_name = "cells_" + i.toString();
            dayElement.setAttribute("id", id_name);
            calendar.appendChild(dayElement);
        }
        monthNameElement.textContent = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
        monElement.classList.toggle('style-change');
        document.dispatchEvent(event_new_week);
    }

    function showMonth() {
        currentView = 'month';
        weekdays.classList.remove('hidden');
        calendar.classList.remove('full-height');
        calendar.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;  // Adjust for Monday start

        // Update the header to show the month name
        monthNameElement.textContent = `${monthNames[month]} ${year}`;

        // Fill in the days from the previous month
        if (startDayOfWeek > 0) {
            const prevMonthLastDay = new Date(year, month, 0).getDate();
            for (let i = startDayOfWeek - 1; i >= 0; i--) {
                const dayElement = document.createElement('div');
                dayElement.classList.add('prev-month');
                dayElement.textContent = `${prevMonthLastDay - i}`;
                dayElement.setAttribute("id","cells");
                calendar.appendChild(dayElement);
            }
        }

        // Fill in the days of the current month
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            if (i === currentDate.getDate() && currentDate.getMonth() === currentMonth) {
                dayElement.classList.add('today', 'current-month');
                dayElement.textContent = `● ${i.toString().padStart(2, '0')}`;
            } else {
                dayElement.classList.add('current-month');
                dayElement.textContent = `${i.toString().padStart(2, '0')}`;
            }
            let id_name = "cells_" + i.toString();
            dayElement.setAttribute("id", id_name);
            calendar.appendChild(dayElement);
        }
        
        // Fill in the days of the next month to complete the last week
        const totalCells = startDayOfWeek + daysInMonth;
        const nextMonthDays = 7 - (totalCells % 7);
        if (nextMonthDays < 7) {
            for (let i = 1; i <= nextMonthDays; i++) {
                const dayElement = document.createElement('div');
                dayElement.classList.add('next-month');
                dayElement.textContent = `${i}`;
                dayElement.setAttribute("id", "cells");
                calendar.appendChild(dayElement);
            }
        }
        fetchEvents().then(events => {
            displayEventsOnCalendar(events);
        }).catch(error => console.error("Failed to fetch events:", error));
    }

    function fetchEvents() {
        return fetch('/api/events')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(error => console.error('Error fetching events:', error));
    }

    document.getElementById('filter-category').addEventListener('change', () => {
        showMonth();  // Assure que la fonction showMonth rappelle fetchEvents et displayEventsOnCalendar
    });
    
    function displayEventsOnCalendar(events) {
        const monthAndYear = document.getElementById('month-name').textContent;
        const [monthName, year] = monthAndYear.split(' ');
        const monthIndex = getMonthIndex(monthName);
        const yearNumber = parseInt(year, 10);
    
        const selectedCategory = document.getElementById('filter-category').value;
    
        // Tri et filtre des événements par date et catégorie
        events = events.filter(event => {
            const eventDate = new Date(event.start);
            const eventMonth = eventDate.getMonth();
            const eventYear = eventDate.getFullYear();
            return eventMonth === monthIndex && eventYear === yearNumber &&
                   (selectedCategory === 'all' || event.category === selectedCategory);
        }).sort((a, b) => new Date(a.start) - new Date(b.start));
    
        events.forEach(event => {
            const eventDate = new Date(event.start);
            const dayElementId = "cells_" + eventDate.getDate();
            const dayElement = document.getElementById(dayElementId);
    
            if (dayElement) {
                const eventElement = document.createElement('div');
                eventElement.className = `event ${categoryColors[event.category] || 'default-color'}`;
                eventElement.textContent = `${event.title} (${eventDate.getHours()}:${eventDate.getMinutes().toString().padStart(2, '0')})`;
                dayElement.appendChild(eventElement);
            }
        });
        document.dispatchEvent(event_new_month);
    }
    
    // Fonction pour convertir le nom du mois en index (0 pour janvier, 11 pour décembre)
    function getMonthIndex(monthName) {
        const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
        return months.indexOf(monthName);
    }
    
    
    

    function showPrevWeek() {
        currentDate.setDate(currentDate.getDate() - 7);
        showWeek();
    }

    function showNextWeek() {
        currentDate.setDate(currentDate.getDate() + 7);
        showWeek();
    }

    function showPrevDay() {
        currentDate.setDate(currentDate.getDate() - 1);
        showToday();
    }

    function showNextDay() {
        currentDate.setDate(currentDate.getDate() + 1);
        showToday();
    }

    function showPrevPeriod() {
        switch (currentView) {
            case 'month':
                currentDate.setMonth(currentDate.getMonth() - 1);
                showMonth();
                break;
            case 'week':
                showPrevWeek();
                break;
            case 'day':
                showPrevDay();
                break;
        }
    }

    function showNextPeriod() {
        switch (currentView) {
            case 'month':
                currentDate.setMonth(currentDate.getMonth() + 1);
                showMonth();
                break;
            case 'week':
                showNextWeek();
                break;
            case 'day':
                showNextDay();
                break;
        }
    }

    function loadOptions() {
        fetch('/api/categories')
        .then(response => response.json())
        .then(categories => {
            const select = document.getElementById('filter-category');
            categories.forEach(category => {
                console.log(category);
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                select.appendChild(option);
            });
        })
        .catch(error => console.log('Erreur lors de la récupération des catégories:', error));
    };
    loadOptions();
    
    // Par défaut, afficher la vue du mois
    showMonth();    

    const profileIcon = document.getElementById('profile');
    const controlPanel = document.getElementById('controlPanel');

    profileIcon.addEventListener('click', () => {
        controlPanel.style.display = controlPanel.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (event) => {
        if (!profileIcon.contains(event.target) && !controlPanel.contains(event.target)) {
            controlPanel.style.display = 'none';
        }
    });

    var event_page_loaded = new Event("page_loaded");
    document.dispatchEvent(event_page_loaded);
});
eventForm.addEventListener('submit', () => {
    showMonth();
})