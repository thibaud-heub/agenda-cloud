document.getElementById('assignGroupForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const userId = document.getElementById('userSelect').value;
  const selectedGroups = Array.from(document.getElementById('groupSelect').selectedOptions).map(option => option.value);

  // Vérifier que des groupes ont été sélectionnés
  if (!selectedGroups.length) {
      alert('Veuillez sélectionner au moins un groupe.');
      return;
  }

  try {
      // Mise à jour des groupes pour l'utilisateur spécifié avec fetch en utilisant le routehandler
      const response = await fetch(`/api/users/${userId}/groups`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ groupsIds: selectedGroups })
      });

      const data = await response.json(); // Récupérer la réponse du serveur

      // Si la mise à jour réussit, afficher un message de succès
      if (response.ok) {
          alert('Utilisateur affilié aux groupes avec succès!');
      } else {
          throw new Error(`Failed to update user's groups with status: ${response.status}`);
      }
  } catch (error) {
      console.error('Error updating user groups:', error);
      alert('Échec de l\'affiliation aux groupes : ' + error.message);
  }
});



document.getElementById('createRoomForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const roomName = document.getElementById('roomName').value;

    fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roomName })
    })
    .then(response => response.json())
    .then(data => alert('Salle créée: ' + data.name))
    .catch(error => alert('Erreur: ' + error));
});

document.getElementById('createGroupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const groupName = document.getElementById('groupName').value;

    fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: groupName })
    })
    .then(response => response.json())
    .then(data => alert('Groupe créé: ' + data.name))
    .catch(error => alert('Erreur: ' + error));
    
});


document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const tables = document.querySelectorAll('table'); // Select all tables
  
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
  
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
  
        tables.forEach(table => table.style.display = 'none'); // Hide all tables
  
        // Ensure the targeted table ID exists before accessing style
        const matchingTable = document.getElementById(`${filter}-table`);
        if (matchingTable) {
          matchingTable.style.display = 'table'; // Show the matching table
        } else {
          console.error(`Table with id '${filter}-table' not found.`); // Handle missing table
        }
      });
    });
  });
  
