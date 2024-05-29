document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const weekdays = document.getElementById('weekdays');
    const todayButton = document.getElementById('today');
    const weekButton = document.getElementById('week');
    const monthButton = document.getElementById('month');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const monthNameElement = document.getElementById('month-name');


    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();

    todayButton.addEventListener('click', showToday);
    weekButton.addEventListener('click', showWeek);
    monthButton.addEventListener('click', showMonth);
    prevMonthButton.addEventListener('click', showPrevMonth);
    nextMonthButton.addEventListener('click', showNextMonth);

    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const dayNames = [
        "Lundi", "Mardi", "Mercredi",
        "Jeudi", "Vendredi", "Samedi", "Dimanche"
    ];

    function showToday() {
        const today = new Date();
        weekdays.classList.add('hidden');
        calendar.classList.add('full-height');
        calendar.innerHTML = `<div>Aujourd'hui : ${dayNames[(today.getDay() + 6) % 7]} ${today.getDate().toString().padStart(2, '0')}</div>`;
        monElement.classList.toggle('style-change');
    }

    function showWeek() {
        weekdays.classList.remove('hidden');
        calendar.classList.remove('full-height');
        calendar.innerHTML = '';
        const today = new Date();
        const startOfWeek = today.getDate() - ((today.getDay() + 6) % 7);
        for (let i = 0; i < 7; i++) {
            const day = new Date(today.setDate(startOfWeek + i));
            const dayElement = document.createElement('div');
            
            dayElement.textContent = `${day.getDate().toString().padStart(2, '0')}`;
            calendar.appendChild(dayElement);
        }
        monElement.classList.toggle('style-change');
    }

    function showMonth() {
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
            let id_name = "cells_"+i.toString();
            dayElement.setAttribute("id",id_name);
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
                dayElement.setAttribute("id","cells");
                calendar.appendChild(dayElement);
            }
        }
        assignDayClickHandlers();
    }

    function showPrevMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        showMonth();
    }

    function showNextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        showMonth();
    }
    
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