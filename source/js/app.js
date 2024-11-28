// varibales
let players;
let cardAllPlayer;
let principalPlayer;
let substitutePlayer;

const stadiumImage = document.querySelector('.stadium-image');
const substitutes = document.querySelector('.substitutes');
const modalPlayers = document.querySelector('.modal-players');
const close = document.querySelector('.close');

const allPlayers = document.querySelector('.allPlayers');

// event click to show all players
const showModalPlayers = () => {
    const appPlayer = document.querySelectorAll('.add-player');
    appPlayer.forEach(card => {
        card.addEventListener('click', () => {
            
            if(card.dataset.card == 1) {
                console.log(card.dataset.card);
                
                allPlayers.dataset.id = card.dataset.card
                modalPlayers.classList.toggle('hidden')
            } else {
                console.log(card.dataset.card);
                allPlayers.dataset.id = card.dataset.card
                modalPlayers.classList.toggle('hidden')  
            }
        })
    })
}

close.addEventListener('click', () => {
    modalPlayers.classList.remove('hidden')
})

// fetch dara of players
fetch('/source/players.json')
.then(res => res.json())
.then(res => {
    players = res.players

    let localPlayers = JSON.parse(localStorage.getItem('playersSelected')) || [];
    let localSubstitutes = JSON.parse(localStorage.getItem('substitutes')) || [];

    const findPositionPlayer = (positionPlayer, playerId) => {

        const findPosition = localPlayers.filter(player => player.position === positionPlayer);
        
        const playerIndex = findPosition.findIndex(player => player.id === playerId);
        

        if (playerIndex === 0) {
            return `${positionPlayer}`;
        } else if (playerIndex === 1) {
            return `l-${positionPlayer}`;
        } else {
            return `r-${positionPlayer}`;
        }
    };
    
    showPrincipalPlayers()
    showSubstitutesPlayers()
    showAllPlayers()

    // function for show all players
    function showAllPlayers() {
        players.map(player => {
            cardAllPlayer = 
            `<div class="card-player selected-player select-substitute-player" data-id="${player.id}">
                <div class="head-card">
                    <div class="position">
                        <p>${player.rating}</p>
                        <span>${player.position}</span>
                    </div>
                    <div class="image-player">
                        <img width="150" src="${player.photo}" alt="">
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
                    <div class="current-team">
                        <img width="17" height="10" src="${player.flag}" alt="">
                        <img width="14" src="${player.logo}" alt="">
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
                    if(allPlayers.dataset.id == 1) {
                        localPlayers.push(playerId)
                        localStorage.setItem('playersSelected', JSON.stringify(localPlayers))
                        showPrincipalPlayers();
                    } else {
                        localSubstitutes.push(playerId)
                        localStorage.setItem('substitutes', JSON.stringify(localSubstitutes))
                        showSubstitutesPlayers();
                    }
                    
                }
                modalPlayers.classList.remove('hidden')
            })
        })
    }

    // show principal players
    function showPrincipalPlayers() {
        JSON.parse(localStorage.getItem('playersSelected')) || [];
        
        localPlayers.map(player => {
            principalPlayer =
                `<div class="card-player ${findPositionPlayer(player.position, player.id)}" data-id="${player.id}">
                    <div class="head-card">
                        <div class="position">
                            <p>${player.rating}</p>
                            <span>${player.position}</span>
                        </div>
                        <div class="image-player">
                            <img width="150" src="${player.photo}" alt="">
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
                            <div class="current-team">
                                <img width="17" height="10" src="${player.flag}" alt="">
                                <img width="14" src="${player.logo}" alt="">
                            </div>
                    </div>
                    
                </div>`
            stadiumImage.innerHTML += principalPlayer;
        })
        showModalPlayers();
    }

    function showSubstitutesPlayers() {
        JSON.parse(localStorage.getItem('substitutes')) || [];
        
        localSubstitutes.map(player => {
            substitutePlayer =
                `<div class="card-player" data-id="${player.id}">
                    <div class="head-card">
                        <div class="position">
                            <p>${player.rating}</p>
                            <span>${player.position}</span>
                        </div>
                        <div class="image-player">
                            <img width="150" src="${player.photo}" alt="">
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
                            <div class="current-team">
                                <img width="17" height="10" src="${player.flag}" alt="">
                                <img width="14" src="${player.logo}" alt="">
                            </div>
                    </div>
                    
                </div>`
                substitutes.innerHTML += substitutePlayer;
        })
        showModalPlayers();
    }
    showModalPlayers();
})