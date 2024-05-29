document.addEventListener('DOMContentLoaded', () => {
    const profilePic = document.getElementById('profile-pic');
    const editProfileButton = document.getElementById('edit-profile');
    const editProfilePopup = document.getElementById('edit_profile_popup');
    const closeEditProfilePopup = editProfilePopup.querySelector('.close_button');

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
});
