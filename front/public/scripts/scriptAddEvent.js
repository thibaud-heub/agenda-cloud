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

function assignWeekClickHandlers() {
    let currentDate = new Date();
    const today = new Date(currentDate);
    const startOfWeek = today.getDate() - ((today.getDay() + 6) % 7);
    for (let i = 0; i < 7; i++) {
        const day = new Date(today.setDate(startOfWeek + i));
        let day_id = 'cells_' + i.toString();
        var day_div = document.getElementById(day_id);
        if (day_div) {
            day_div.addEventListener('click', (function(clickedDay) {
                return function() {
                    openPopup(clickedDay);
                };
            })(day));
        }
    }
}

function assignSingleDayClickHandler() {
    let currentDate = new Date();
    const today = new Date(currentDate);
    let day_id = 'cells_day';
    var day_div = document.getElementById(day_id);
    if (day_div) {
        day_div.addEventListener('click', function() {
            openPopup(today);
        });
    }
}

const closeButton = document.querySelector('.close_button');
const eventForm = document.getElementById('eventForm');
const eventPopup = document.getElementById('event_popup');
const eventButton = document.getElementById('createEvent');

closeButton.addEventListener('click', () => {
    eventPopup.style.display = 'none';
});

eventForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('start_time').value;
    const endTime = document.getElementById('end_time').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const group = document.getElementById('groupe').value;
    const room = document.getElementById('room').value;

    // Log des valeurs pour le débogage
    console.log({title, date, startTime, endTime, category, description, group, room});

    // Vérification des valeurs de date et d'heure
    if (!date || !startTime || !endTime) {
        console.error('Date, start time, or end time is missing');
        alert('Veuillez fournir une date, une heure de début et une heure de fin valides.');
        return;
    }

    // Vérification des autres valeurs obligatoires
    if (!title || !category || !group || !room) {
        console.error('Required fields are missing');
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }

    // Conversion des chaînes de date et d'heure en objets Date
    const start =  date +'T'+startTime +':00.000Z';
    const end =  date+'T'+ endTime +':00.000Z'

    // Log pour vérifier la conversion des dates
    console.log({start, end});

    // Premièrement, récupérer les usersIds pour le groupe sélectionné
    let usersId = await fetchGroupUsers(group);

    // Préparer les données de l'événement avec les usersIds récupérés
    const eventData = {
        title: title,
        description: description,
        start: start,
        end: end,
        room: room,
        category: category,
        groupsIds: group,
        usersIds: usersId
    };

    // Conversion en JSON et envoi des données de l'événement à l'API
    
    fetch('/api/events', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(eventData)  
    })
    .then(response => {
        
        if (!response.ok) {
            throw new Error('Failed to create event');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
       
    })
    .catch(error => {
        console.error('Error:', error);
        console.log(JSON.stringify(eventData));
        alert('Failed to create event: ' + error.message);
    });

    eventPopup.style.display = 'none';
    eventForm.reset();
});


async function fetchGroupUsers(groupId) {
    const response = await fetch(`/api/groups/${groupId}`);
    const data = await response.json();
    return data.usersIds;
}


function fetchCategories() {
    fetch('/api/categories')
        .then(response => response.json())
        .then(data => {
            const categorySelect = document.getElementById('category');
            data.forEach(category => {
                let option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Failed to load categories:', error));
}

function fetchGroups() {
    fetch('/api/groups')
        .then(response => response.json())
        .then(data => {
            const groupSelect = document.getElementById('groupe');
            data.forEach(group => {
                let option = document.createElement('option');
                option.value = group._id;
                option.textContent = group.name;
                groupSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Failed to load groups:', error));
}

function fetchRooms() {
    fetch('/api/rooms')
        .then(response => response.json())
        .then(data => {
            const roomSelect = document.getElementById('room'); // Assurez-vous que ce select existe dans votre HTML
            data.forEach(room => {
                let option = document.createElement('option');
                option.value = room._id;
                option.textContent = room.name;
                roomSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Failed to load rooms:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    fetchGroups();
    fetchRooms();
    assignDayClickHandlers();
});

document.addEventListener("new_month", () => assignDayClickHandlers());
document.addEventListener("new_week", () => assignWeekClickHandlers());
document.addEventListener("new_day", () => assignSingleDayClickHandler());