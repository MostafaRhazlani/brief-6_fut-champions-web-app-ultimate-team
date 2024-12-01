// varibales
let players;
let cardAllPlayer;
let principalPlayer;
let substitutePlayer;
let playerSubstitutes;

const stadiumImage = document.querySelector('.stadium-image');
const substitutes = document.querySelector('.substitutes');
const modalPlayers = document.querySelector('.modal-players');
const modalSubstitutes = document.querySelector('.modal-substitutes');
const contentModalSubstitutes = document.querySelector('.content-modal');

const close = document.querySelector('.close');
const closeSubstitutes = document.querySelector('.close-substitutes');

const allPlayers = document.querySelector('.allPlayers');


const closeForm = document.querySelector('.close-form');
const submit = document.querySelector('.submit');
const addNewPlayer = document.querySelector('.add-new-player');

const btnFilter = document.querySelectorAll('.btn-filter');
const modalFilter = document.querySelectorAll('.modal-filter');

const namePlayer = document.querySelector('.name');
const nationality = document.querySelector('.nationality');
const club = document.querySelector('.club');
const ratingPlayer = document.querySelector('.ratingPlayer');
const selectPositionPlayer = document.querySelector('.select-position-player');

const toggle = document.querySelector('.toggle');
const sectionInfo = document.querySelector('.section-info');

let localPrincipalPlayers = JSON.parse(localStorage.getItem('principalPlayers')) || [];
let localSubstitutes = JSON.parse(localStorage.getItem('substitutes')) || [];
let localAllPlayers = JSON.parse(localStorage.getItem('allPlayers')) || []


toggle.addEventListener('click', () => {
    
    sectionInfo.classList.toggle('show-section')
})

closeForm.addEventListener('click', (e) => {
    e.preventDefault();
    addNewPlayer.classList.remove('show');
})

const resetData = () => {
    namePlayer.value = '',
    nationality.value = '',
    club.value = '',
    ratingPlayer.value = 0
    selectPositionPlayer.value = ''
}

// event click to show all players
const showModalPlayers = () => {
    const appPlayer = document.querySelectorAll('.add-player');
    appPlayer.forEach(card => {
        card.addEventListener('click', () => {
            
            if(card.dataset.card == 1) {
                
                allPlayers.dataset.id = card.dataset.card
                modalPlayers.classList.add('hidden')
            } else {
                allPlayers.dataset.id = card.dataset.card
                modalPlayers.classList.add('hidden')  
            }
        })
    })
}

closeSubstitutes.addEventListener('click', () => { 
    modalSubstitutes.classList.remove('show-substitutes')
})

close.addEventListener('click', () => {
    modalPlayers.classList.remove('hidden')
})

// fetch dara of players
fetch('/source/players.json')
.then(res => res.json())
.then(res => {
    players = res.players

    const findPositionPlayer = (positionPlayer, playerId) => {

        const findPosition = localPrincipalPlayers.filter(player => player.position === positionPlayer);
        
        const playerIndex = findPosition.findIndex(player => player.id === playerId);
        

        if (playerIndex === 0) {
            return `${positionPlayer}`;
        } else if (playerIndex === 1) {
            return `l-${positionPlayer}`;
        } else {
            return `r-${positionPlayer}`;
        }
    };

    // remove all players from principal and substitutes
    const btnRemovePlayers = document.querySelector('.remove-players');
    
    const removePlayers = () => {
        localPrincipalPlayers = []
        localSubstitutes = []

        localStorage.setItem('principalPlayers', JSON.stringify(localPrincipalPlayers))
        localStorage.setItem('substitutes', JSON.stringify(localSubstitutes))

        toggleBtnRemove()
        showPrincipalPlayers()
        showSubstitutesPlayers()

        calcRating();
        totalChemistry()
        calcPriceTeam()
    }
    btnRemovePlayers.addEventListener('click', removePlayers)
    
    function toggleBtnRemove() {
        if(localPrincipalPlayers.length == 0 && localSubstitutes.length == 0) {
            btnRemovePlayers.style.display = 'none'
        } else {
            btnRemovePlayers.style.display = 'flex'
        }
    }
    
    toggleBtnRemove()
    showPrincipalPlayers()
    showSubstitutesPlayers()
    showAllPlayers()

    // function for show all players
    function showAllPlayers() {
        allPlayers.innerHTML = '';

        localAllPlayers.map(player => {
            cardAllPlayer = 
            `<div class="card-player show-info-player-in-list" data-id="${player.id}">
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
                <div class="modal-player modal-player-in-list" data-id="${player.id}">
                    <div class="drop-player icon-modal" data-id="${player.id}">
                        <i class="fa-regular fa-circle-down"></i>
                    </div>
                    <div class="edit btn icon-modal" data-id="${player.id}">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </div>
                    <div class="info icon-modal">
                        <i class="fa-solid fa-info-circle"></i>
                    </div>
                </div>
            </div>`

            allPlayers.innerHTML += cardAllPlayer;

        })

        const showInfoPlayerInList = document.querySelectorAll('.show-info-player-in-list');
        const modalPlayerInList = document.querySelectorAll('.modal-player-in-list')
        const dropPlayer = document.querySelectorAll('.drop-player')

        showInfoPlayerInList.forEach(show => {
            show.addEventListener('click', () => {

                // show modal player
                modalPlayerInList.forEach(modal => {
                    if(modal.dataset.id === show.dataset.id) {
                        modal.classList.toggle('show-modal-player')
                        
                    } else {
                        modal.classList.remove('show-modal-player')
                    }
                })
            })
        })
        
        dropPlayer.forEach(player => {
            const cardId = player.dataset.id

            player.addEventListener('click', () => {
                const playerId = localAllPlayers.find(p => p.id == cardId)

                const findInLocalPrincipal = localPrincipalPlayers.find(p => p.id == cardId)
                const findInLocalSubstitutes = localSubstitutes.find(p => p.id == cardId)

                if(findInLocalPrincipal) {
                    return;
                }

                if(findInLocalSubstitutes) {
                    return;
                }

                if(playerId) {
                    if(allPlayers.dataset.id == 1) {
                        localPrincipalPlayers.push(playerId)
                        localStorage.setItem('principalPlayers', JSON.stringify(localPrincipalPlayers))
                        showPrincipalPlayers();
                    } else {
                        localSubstitutes.push(playerId)
                        localStorage.setItem('substitutes', JSON.stringify(localSubstitutes))
                        showSubstitutesPlayers();
                    }
                    
                }
                calcRating();
                totalChemistry()
                calcPriceTeam()
                toggleBtnRemove()
                
                modalPlayers.classList.remove('hidden')
            })
        })
        
        const btnEditAdd = document.querySelectorAll('.btn');

        btnEditAdd.forEach(btn => {
            
            btn.addEventListener('click', () => {
                const editH1 = addNewPlayer.querySelector('h1')
                if(btn.dataset.add == 1) {
                    editH1.innerHTML = 'Add New Player'
                    addNewPlayer.classList.add('show');
                    sectionInfo.classList.remove('show-section')
                    resetData()
                    
                } else {
                    editH1.innerHTML = 'Edit Player'
                    addNewPlayer.classList.add('show');
                    addOrEditPlayer(btn.dataset.id)

                    localAllPlayers.forEach(player => {
                        if(player.id == btn.dataset.id) {
                            namePlayer.value = player.name,
                            nationality.value = player.nationality,
                            club.value = player.club,
                            ratingPlayer.value = player.rating
                            selectPositionPlayer.value = player.position
                        }
                    })
                    sectionInfo.classList.remove('show-section')
                }
            })
        })
    }

    function generatePlayers() {
        const generatePlayers = document.querySelector('.generate-players');

        generatePlayers.addEventListener('click', () => {
            localStorage.setItem('allPlayers', JSON.stringify(players))

            let getDataPlayers = JSON.parse(localStorage.getItem('allPlayers')) || []
            
            localAllPlayers = getDataPlayers
            showAllPlayers()
        })
    }
    generatePlayers()

    function filterPlayers() {

        // show or hide modals filter
        btnFilter.forEach(btn => {  
            btn.addEventListener('click', () => {
                let btnId = btn.dataset.id
                
                if(btn.classList.contains('focus-btn')) {
                    btn.classList.remove('focus-btn')
                    modalFilter.forEach(modal => modal.classList.remove('show-modal'));
                } else {
                    btnFilter.forEach(btn => btn.classList.remove('focus-btn'))
                    btn.classList.add('focus-btn')

                    modalFilter.forEach((modal, j) => {  
                        if(btnId == j+1) {
                            modal.classList.toggle('show-modal')
                        } else {
                            modal.classList.remove('show-modal')
                        }
                    })
                }
            })
        })

        const modalPosition = document.querySelector('.modal-position');
        const modalCountry = document.querySelector('.modal-country');
        const modalClub = document.querySelector('.modal-club');
        const search = document.querySelector('.search');
        const allPlayers = JSON.parse(localStorage.getItem('allPlayers')) || []
        
        // display all position
        const positions = ['GK', 'CB', 'LB', 'RB', 'CM', 'LW', 'RW', 'ST']
        modalPosition.innerHTML = ''
        positions.map(filterPosition => {

            modalPosition.innerHTML += `
                <span class="group-filter filter-position">${filterPosition}</span>
            `
        })
        

        // filter players when click on button position 
        document.querySelectorAll('.filter-position').forEach(position => {
            
            position.addEventListener('click', () => {
                const filtredPosition = allPlayers.filter(p => p.position == position.innerText)
                
                localAllPlayers = filtredPosition
                btnFilter.forEach(btn => btn.classList.remove('focus-btn'))
                modalFilter.forEach(modal => modal.classList.remove('show-modal'));
                showAllPlayers()
            })
        })

        const filtredCountry = []
        const filtredFlag = []
        // filter countries if douplicate
        for (let i = 0; i < localAllPlayers.length; i++) {
            if(!filtredCountry.includes(localAllPlayers[i].nationality)) {
                filtredCountry.push(localAllPlayers[i].nationality)
            }
        }
        // filter flags if douplicate
        for (let i = 0; i < localAllPlayers.length; i++) {
            if(!filtredFlag.includes(localAllPlayers[i].flag)) {
                filtredFlag.push(localAllPlayers[i].flag)
            }
        }
        
        // display all countries
        modalCountry.innerHTML = ''
        filtredCountry.forEach((country, i) => {

            modalCountry.innerHTML += `
                <div class="group-filter filter-country">
                    <img width="13" src="${filtredFlag[i]}" alt="">
                    <span>${country}</span>
                </div>
            `
        })

        // filter players by countries
        document.querySelectorAll('.filter-country').forEach(country => {
            country.addEventListener('click', () => {
                
                let child = country.querySelector('span');
                
                const filtredCountry = allPlayers.filter(p => p.nationality == child.innerText)
                
                localAllPlayers = filtredCountry
                btnFilter.forEach(btn => btn.classList.remove('focus-btn'))
                modalFilter.forEach(modal => modal.classList.remove('show-modal'));
                showAllPlayers()
            })
        })

        const filtredClub = []
        const filterLogoClub = []
        // filter club if douplicate
        for (let i = 0; i < localAllPlayers.length; i++) {
            if(!filtredClub.includes(localAllPlayers[i].club)) {
                filtredClub.push(localAllPlayers[i].club)
            }
        }

        // filter logo club if douplicate
        for (let i = 0; i < localAllPlayers.length; i++) {
            if(!filterLogoClub.includes(localAllPlayers[i].logo)) {
                filterLogoClub.push(localAllPlayers[i].logo)
            }
        }

        // display all clubs
        modalClub.innerHTML = ''
        filtredClub.forEach((club, i) => {

            modalClub.innerHTML += `
                <div class="group-filter filter-club">
                    <img width="13" src="${filterLogoClub[i]}" alt="">
                    <span>${club}</span>
                </div>
            `
        })

        // filter players by club
        document.querySelectorAll('.filter-club').forEach(club => {
            club.addEventListener('click', () => {
                
                let child = club.querySelector('span');
                
                const filtredClub = allPlayers.filter(p => p.club == child.innerText)
                
                localAllPlayers = filtredClub
                btnFilter.forEach(btn => btn.classList.remove('focus-btn'))
                modalFilter.forEach(modal => modal.classList.remove('show-modal'));
                showAllPlayers()
            })
        })

        // filter players by name
        search.addEventListener('input', () => {
            let searchValue = search.value.toLowerCase()

            let filtredName = allPlayers.filter(p => p.name.toLowerCase().includes(searchValue))
            
            localAllPlayers = filtredName;
            showAllPlayers()
        })
        
    }
    filterPlayers()

    function addOrEditPlayer(id) {
        let index = localAllPlayers.length+1;
        
        submit.addEventListener('click', (e) => {
            e.preventDefault()
            
            const childAddNewPlayer = addNewPlayer.querySelector('h1')
            if(childAddNewPlayer.innerText == 'Edit Player') {
                

                const getPlayer = localAllPlayers.find(p => p.id == id)
                
                if(getPlayer) {
                    getPlayer.name = namePlayer.value;
                    getPlayer.position = selectPositionPlayer.value;
                    getPlayer.nationality = nationality.value;
                    getPlayer.club = club.value;
                    getPlayer.rating = ratingPlayer.value;
                } 

                localAllPlayers.push(getPlayer)
                localStorage.setItem('allPlayers', JSON.stringify(localAllPlayers))
                
                
            } else {
                const objectPlayer = {
                    "id": index++,
                    "name": namePlayer.value,
                    "photo": 'https://cdn3.futbin.com/content/fifa25/img/players/p50531752.png?fm=png&ixlib=java-2.1.0&w=485&s=c618880412227731b9665c31e4531593',
                    "position": selectPositionPlayer.value,
                    "nationality": nationality.value,
                    "flag": '',
                    "club": club.value,
                    "logo": '',
                    "rating": ratingPlayer.value,
                    "pace": '88',
                    "shooting": '88',
                    "passing": '88',
                    "dribbling": '88',
                    "defending": '88',
                    "physical": '88'
                }
                
                localAllPlayers.push(objectPlayer);
                localStorage.setItem('allPlayers', JSON.stringify(localAllPlayers))
            }
            showAllPlayers()
            addNewPlayer.classList.remove('show');
    
            resetData();
        })
    }

    // function for calc rating and show result calc
    function calcRating() {
        let countPAC = 0
        let countSHO = 0
        let countPAS = 0
        let countDRI = 0
        let countDEF = 0
        let countPHY = 0

        const rating = document.querySelector('.rating');

        rating.innerHTML = ''

        localPrincipalPlayers.map(player => {
            if(player.position != 'GK') {
                countPAC += player.pace 
                countSHO += player.shooting 
                countPAS += player.passing 
                countDRI += player.dribbling 
                countDEF += player.defending 
                countPHY += player.physical 
            } 
        }) 

        let cPac = countPAC / localPrincipalPlayers.length
        let cSho = countSHO / localPrincipalPlayers.length
        let cPas = countPAS / localPrincipalPlayers.length
        let cDri = countDRI / localPrincipalPlayers.length
        let cDef = countDEF / localPrincipalPlayers.length
        let cPhy = countPHY / localPrincipalPlayers.length
        
        
        // condition for change color border of rating
        let changeColorBorderPAC = cPac > 0 && cPac <= 30 ? 'red' : cPac > 30 && cPac <= 70 ? 'yellow' : cPac > 70 ? 'green' : '';
        let changeColorBorderSHo = cPac > 0 && cSho <= 30 ? 'red' : cSho > 30 && cSho <= 70 ? 'yellow' : cPac > 70 ? 'green' : '';
        let changeColorBorderPAS = cPac > 0 && cPas <= 30 ? 'red' : cPas > 30 && cPas <= 70 ? 'yellow' : cPac > 70 ? 'green' : '';
        let changeColorBorderDRI = cPac > 0 && cDri <= 30 ? 'red' : cDri > 30 && cDri <= 70 ? 'yellow' : cPac > 70 ? 'green' : '';
        let changeColorBorderDEF = cPac > 0 && cDef <= 30 ? 'red' : cDef > 30 && cDef <= 70 ? 'yellow' : cPac > 70 ? 'green' : '';
        let changeColorBorderPHY = cPac > 0 && cPhy <= 30 ? 'red' : cPhy > 30 && cPhy <= 70 ? 'yellow' : cPac > 70 ? 'green' : '';
        

        rating.innerHTML = `
        <div class="card-rate">
            <div class="rate ${changeColorBorderPAC}">
                <p>${Math.floor(cPac) || '-'}</p>
            </div>
            <span>PAC</span>
        </div>
        <div class="card-rate">
            <div class="rate ${changeColorBorderSHo}">
                <p>${Math.floor(cSho) || '-'}</p>
            </div>
            <span>SHO</span>
        </div>
        <div class="card-rate">
            <div class="rate ${changeColorBorderPAS}">
                <p>${Math.floor(cPas) || '-'}</p>
            </div>
            <span>PAS</span>
        </div>
        <div class="card-rate">
            <div class="rate ${changeColorBorderDRI}">
                <p>${Math.floor(cDri) || '-'}</p>
            </div>
            <span>DRI</span>
        </div>
        <div class="card-rate">
            <div class="rate ${changeColorBorderDEF}">
                <p>${Math.floor(cDef) || '-'}</p>
            </div>
            <span>DEF</span>
        </div>
        <div class="card-rate">
            <div class="rate ${changeColorBorderPHY}">
                <p>${Math.floor(cPhy) || '-'}</p>
            </div>
            <span>PHY</span>
        </div>`
    }
    calcRating()

    function totalChemistry() {
        let count = 0
        const rangeRate = document.querySelector('.range-rate');

        localPrincipalPlayers.map(player => {
            count += player.rating
        })

        let total = count / localPrincipalPlayers.length

        rangeRate.innerHTML = `
                <div class="range">
                    <div class="line-range"></div>
                </div>
            <p>${Math.floor(total) || 0}/100</p>`

        document.querySelector('.line-range').style.width = `${Math.floor(total)}%`
    }
    totalChemistry()

    function calcPriceTeam() {
        let countPrice = 0
        const price = document.querySelector('.price');

        localPrincipalPlayers.map(player => {
            countPrice += player.rating
        })

        price.innerHTML = '';

        price.innerHTML = `
            <h4>Price:</h4>
            <p>${countPrice},000,000,000</p>
            <img width="13" src="./source/img/coin-fut.svg" alt="">`
    }

    calcPriceTeam()

    // show principal players
    function showPrincipalPlayers() {

        const contentPlayers = document.querySelector('.content-players');

        contentPlayers.innerHTML = ''
        
        localPrincipalPlayers.map(player => {
            principalPlayer =
                `<div class="card-player show-info-player ${findPositionPlayer(player.position, player.id)}" data-id="${player.id}">
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
                    <div class="modal-player show-modal-principal" data-id="${player.id}">
                        <div class="remove icon-modal">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                        <div class="changes icon-modal">
                            <i class="fa-solid fa-arrow-right-arrow-left"></i>
                        </div>
                        <div class="info icon-modal">
                            <i class="fa-solid fa-info-circle"></i>
                        </div>
                    </div>
                </div>`
                contentPlayers.innerHTML += principalPlayer;
        })
        
        showModalPlayers();
        
        const showInfoPlayer = document.querySelectorAll('.show-info-player');
        const modalPlayerPrincipal = document.querySelectorAll('.show-modal-principal')
        const changes = document.querySelectorAll('.changes')
        const remove = document.querySelectorAll('.remove')

        // show modal to remove or change player 
        showInfoPlayer.forEach(show => {
            show.addEventListener('click', () => {

                // show modal player
                modalPlayerPrincipal.forEach((modal, i) => {
                    if(modal.dataset.id === show.dataset.id) {
                        modal.classList.toggle('show-modal-player')
                        
                        // modal for change place player with player in substitutes
                        changes[i].addEventListener('click', () => {
    
                            modalSubstitutes.classList.add('show-substitutes')
                            showModalSubstitutesPlayer(show.dataset.id);
                        })

                        // remove player from stade
                        remove[i].addEventListener('click', () => {
                            const deletePlayer = localPrincipalPlayers.filter(p => p.id != show.dataset.id)
                            
                            localStorage.setItem('principalPlayers', JSON.stringify(deletePlayer))
                            localPrincipalPlayers = deletePlayer
                            showPrincipalPlayers();
                        })
                    } else {
                        modal.classList.remove('show-modal-player')
                    }
                })

                calcRating();
                totalChemistry()
                calcPriceTeam()
                toggleBtnRemove()
            })
        })

    }

    function showModalSubstitutesPlayer(selectedPlayerId) {
        
        contentModalSubstitutes.innerHTML = '';
        
        localSubstitutes.map(player => {
            contentModalSubstitutes.innerHTML +=
                `<div class="card-player change-place" data-id="${player.id}">
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
        })
        
        document.querySelectorAll('.change-place').forEach(change => {
  
            change.addEventListener('click', () => {
                
                // find players
                let substitutePlayerId = localSubstitutes.find(p => p.id == change.dataset.id);
                let pricipalPlayerId = localPrincipalPlayers.find(p => p.id == selectedPlayerId);

                if(substitutePlayerId.position != pricipalPlayerId.position) {
                    return
                }

                // remove player
                const principalPlayer = localPrincipalPlayers.filter(p => p.id != selectedPlayerId)
                const substitutePlayer = localSubstitutes.filter(p => p.id != change.dataset.id)
                
                
                // check id player and add principal player to substitutes
                if(pricipalPlayerId) {
                    substitutePlayer.push(pricipalPlayerId)
                    localStorage.setItem('substitutes', JSON.stringify(substitutePlayer))
                }

                // check id player and add substitute player to stade
                if(substitutePlayerId) {
                    principalPlayer.push(substitutePlayerId)
                    localStorage.setItem('principalPlayers', JSON.stringify(principalPlayer))
                }

                // remove principal player from stade
                localStorage.setItem('principalPlayers', JSON.stringify(principalPlayer))
                addedToPrincipal = principalPlayer;
                localPrincipalPlayers = addedToPrincipal

                // remove substitute player from substitutes
                localStorage.setItem('substitutes', JSON.stringify(substitutePlayer))
                addedToSubstitutes = substitutePlayer;
                localSubstitutes = addedToSubstitutes

                showPrincipalPlayers();
                showSubstitutesPlayers();

                calcRating();
                totalChemistry()
                calcPriceTeam()
                modalSubstitutes.classList.remove('show-substitutes');
            })
        })
    }

    function showSubstitutesPlayers() {
        const contentSubstitutes = document.querySelector('.content-substitutes');
        const substitutesCard = document.querySelector('.substitutes-card');
        contentSubstitutes.innerHTML = ''

        if(localSubstitutes.length == 12) {
            substitutesCard.style.display = 'none'
        } else {
            substitutesCard.style.display = 'flex'
        }

        localSubstitutes.map(player => {
            substitutePlayer =
                `<div class="card-player show-info-player-sub" data-id="${player.id}">
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
                        <div class="modal-player show-modal-substitutes" data-id="${player.id}">
                            <div class="remove icon-modal">
                                <i class="fa-solid fa-xmark"></i>
                            </div>
                            <div class="info icon-modal">
                                <i class="fa-solid fa-info-circle"></i>
                            </div>
                        </div>
                    </div>
                    
                </div>`
            contentSubstitutes.innerHTML += substitutePlayer;
        })

        const showInfoPlayerSub = document.querySelectorAll('.show-info-player-sub');
        const modalPlayerSubstitutes = document.querySelectorAll('.show-modal-substitutes')
        const remove = document.querySelectorAll('.remove')

        // show modal to remove or change player 
        showInfoPlayerSub.forEach(show => {
            show.addEventListener('click', () => {

                // show modal player
                modalPlayerSubstitutes.forEach((modal, i) => {
                    if(modal.dataset.id === show.dataset.id) {
                        modal.classList.toggle('show-modal-player')

                        // remove player from stade
                        remove[i].addEventListener('click', () => {
                            const deletePlayer = localSubstitutes.filter(p => p.id != show.dataset.id)
                            
                            localStorage.setItem('substitutes', JSON.stringify(deletePlayer))
                            localSubstitutes = deletePlayer
                            showSubstitutesPlayers();
                        })
                    } else {
                        modal.classList.remove('show-modal-player')
                    }
                })

                calcRating();
                totalChemistry()
                calcPriceTeam()
                toggleBtnRemove()
            })
        })

        showModalPlayers();
    }
    showModalPlayers();
})