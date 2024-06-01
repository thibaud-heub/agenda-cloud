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
    
    console.log({title, date, startTime, endTime, category, description, group, room});
    


    // Premièrement, récupérer les usersIds pour le groupe sélectionné
    let usersIds = await fetchGroupUsers(group);

    // Ensuite, préparer les données de l'événement avec les usersIds récupérés
    const eventData = {
        title,
        description,
        start: date + 'T' + start_time,
        end: date + 'T' + end_time,
        room: eventForm.room.value, // Assurez-vous que ce champ est aussi géré correctement
        category,
        groupsIds: [group],
        usersIds
    };
    

    // Enfin, envoyer les données de l'événement à l'API
    fetch('/api/events', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, description, start: date + 'T' + start_time, end: date + 'T' + end_time, room, category, groupsIds: [group], usersIds})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create event');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // Mettre à jour l'interface utilisateur ici
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to create event: ' + error.message);
    });
    

    eventPopup.style.display = 'none';
    eventForm.reset();
});

async function fetchGroupUsers(groupId) {
    const response = await fetch(`/api/groups/${groupId}`);
    const data = await response.json();
    return data.usersIds || [];
}


function fetchCategories() {
    fetch('/api/categories')
        .then(response => response.json())
        .then(data => {
            const categorySelect = document.getElementById('category');
            data.forEach(category => {
                let option = document.createElement('option');
                option.value = category._id;
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
