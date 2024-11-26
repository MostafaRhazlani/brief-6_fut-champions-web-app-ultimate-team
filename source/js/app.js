// varibales
let players;
let cardAllPlayer;

const cardPlayer = document.querySelectorAll('.card-player');
const modalPlayers = document.querySelector('.modal-players');
const close = document.querySelector('.close');

const allPlayers = document.querySelector('.allPlayers');


// event click to show all players
cardPlayer.forEach(card => {
    card.addEventListener('click', () => {
        modalPlayers.classList.toggle('hidden')
    })
})

close.addEventListener('click', () => {
    modalPlayers.classList.remove('hidden')
})

// fetch dara of players
fetch('/source/players.json')
.then(res => res.json())
.then(res => {
    players = res.players

    let localPlayers = JSON.parse(localStorage.getItem('playersSelected')) || [];

    showAllPlayers()

    // function for show all players
    function showAllPlayers() {
        players.map(player => {
            cardAllPlayer = 
            `<div class="card-player selected-player" data-id="${player.id}">
                <div class="head-card">
                    <div class="position">
                        <p>${player.rating}</p>
                        <span>${player.position}</span>
                    </div>
                    <div class="image-player">
                        <img width="100" src="${player.photo}" alt="">
                    </div>
                </div>
                <div class="body-card">
                    <h3>${player.name}</h3>
                    <div class="rate-player">
                        <div>
                            <p>PAC</p>
                            <span>${player.pace || player.diving}</span>
                        </div>
                        <div>
                            <p>SHO</p>
                            <span>${player.shooting || player.handling}</span>
                        </div>
                        <div>
                            <p>PAS</p>
                            <span>${player.passing || player.kicking}</span>
                        </div>
                        <div>
                            <p>DRI</p>
                            <span>${player.dribbling || player.reflexes}</span>
                        </div>
                        <div>
                            <p>DEF</p>
                            <span>${player.defending || player.speed}</span>
                        </div>
                        <div>
                            <p>PHY</p>
                            <span>${player.physical || player.positioning}</span>
                        </div>
                    </div>
                </div>
            </div>`

            allPlayers.innerHTML += cardAllPlayer;

        })
        
        document.querySelectorAll('.selected-player').forEach(player => {
            const cardId = player.dataset.id
            
            player.addEventListener('click', () => {
                const playerId = players.find(p => p.id == cardId)

                const findInLocal = localPlayers.find(p => p.id == cardId)

                if(findInLocal) {
                    return;
                }

                if(playerId) {
                    localPlayers.push(playerId)
                    localStorage.setItem('playersSelected', JSON.stringify(localPlayers))
                }  
            })
        })
    }
})