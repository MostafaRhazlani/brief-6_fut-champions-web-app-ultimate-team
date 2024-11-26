const cardPlayer = document.querySelectorAll('.card-player');
const close = document.querySelector('.close');
const modalPlayers = document.querySelector('.modal-players');


cardPlayer.forEach(card => {
    card.addEventListener('click', () => {
        modalPlayers.classList.toggle('hidden')
    })
})

close.addEventListener('click', () => {
    modalPlayers.classList.remove('hidden')
    
})