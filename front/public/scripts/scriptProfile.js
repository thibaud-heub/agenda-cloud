document.addEventListener('DOMContentLoaded', function() {
    // Récupérer l'ID utilisateur dès le chargement de la page
    let userId;
    fetch('/api/profile/getUserId')
        .then(response => response.json())
        .then(data => {
            if (data && data.userId) {
                userId = data.userId;
                console.log('User ID retrieved:', userId);
            } else {
                console.error('Failed to fetch user ID or no ID provided by the server');
            }
        })
        .catch(error => console.error('Error fetching user ID:', error));

    // Charger les données de profil
    const profilePic = document.getElementById('profile-pic');
    const editProfileButton = document.getElementById('edit-profile');
    const editProfilePopup = document.getElementById('edit_profile_popup');
    const closeEditProfilePopup = editProfilePopup.querySelector('.close_button');
    const profileDetails = document.querySelector('.profile-details');

    const loadProfileData = () => {
        fetch('/api/users/profile', {
            method: 'GET',
            credentials: 'include' 
        })
        .then(response => response.json())
        .then(user => {
            document.getElementById('last_name').value = user.lastName;
            document.getElementById('first_name').value = user.firstName;
            document.getElementById('email').value = user.mail;
            //profilePic.src = user.profilePicUrl || '/res/profile.png';
            profileDetails.querySelector('p:nth-of-type(1)').innerHTML = `<strong>Nom :</strong> ${user.lastName}`;
            profileDetails.querySelector('p:nth-of-type(2)').innerHTML = `<strong>Prénom :</strong> ${user.firstName}`;
            profileDetails.querySelector('p:nth-of-type(3)').innerHTML = `<strong>Email :</strong> ${user.mail}`;
        })
        .catch(error => console.error('Failed to load user data:', error));
    };

    loadProfileData();

    editProfileButton.addEventListener('click', () => {
        editProfilePopup.style.display = 'block';
    });

    closeEditProfilePopup.addEventListener('click', () => {
        editProfilePopup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === editProfilePopup) {
            editProfilePopup.style.display = 'none';
        }
    });

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

    // Ajouter l'événement de soumission du formulaire après avoir récupéré l'ID utilisateur
    document.getElementById('editProfileForm').addEventListener('submit', function(e) {
        e.preventDefault();

        if (!userId) {
            console.error('User ID not available');
            return;
        }

        const formData = new FormData(this);
        const jsonData = {
            lastName: formData.get('last_name'),
            firstName: formData.get('first_name'),
            mail: formData.get('email')
        };

        fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Profile updated successfully:', data);
            window.location.reload();
        })
        .catch(error => {
            console.error('Failed to update profile:', error);
        });
    });
});
