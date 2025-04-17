let globalDataObject

// Set Up
fetch("https://sports.is120.ckearl.com")
    .then((response) => response.json())
    .then((dataObject) => {
        console.log(dataObject)
        globalDataObject = dataObject
        completeSteps(globalDataObject);
    });

function completeSteps(allLeagues) {
    // makeTeamList(allLeagues)
    // console.log(allLeagues)
    const cardsContainer = document.getElementById("cards-outer-container");
    const gridBtn = document.getElementById("grid-view-btn");
    const dropdown = document.getElementById("league-dropdown");

    if (cardsContainer && gridBtn && dropdown) {
        cardsContainer.classList.add("grid-view");
        gridBtn.classList.add("active");

        dropdown.addEventListener("change", () => {
            let selectedLeague = dropdown.value;
            if (selectedLeague && allLeagues[selectedLeague]) {
                makeTeamList(allLeagues, selectedLeague);
            };
        });

        if (dropdown.value && allLeagues[dropdown.value]) {
            makeTeamList(allLeagues, dropdown.value);
        };

        document.getElementById("team-list").addEventListener("change", updateCards);
        document.getElementById("roster-dropdown").addEventListener("change", updateCards);

        updateCards();
    }

    showRandomPlayer(allLeagues);
}



function makeTeamList(dataObject, selectedLeague) {
    console.log("Available keys in dataObject:", Object.keys(dataObject));

    let teams = dataObject[selectedLeague]["teams"];

    console.log("Teams from", selectedLeague + ":", teams)
    let teamList = document.getElementById("team-list");

    teamList.innerHTML = `
        <option value="" disabled selected>Team</option>
    `;

    teams.forEach(team => {
        let option = document.createElement("option");
        option.textContent = team.name;
        option.value = team.name;
        teamList.appendChild(option);
    });
    
}

function updateCards() {
    let league = document.getElementById("league-dropdown").value;
    let teamName = document.getElementById("team-list").value;
    let view = document.getElementById("roster-dropdown").value;
    let container = document.getElementById("cards-outer-container");

    container.innerHTML = ""; // Clear previous content
    
    if (!teamName) {
        container.innerHTML = `<p class="placeholder-message">Please select a team to view info</p>`;
        return;
    }

    let selectedTeam = globalDataObject[league]["teams"].find(team => team.name === teamName);

    // Add team header with logo and name
    const header = document.createElement("div");
    header.className = "team-header";
    header.innerHTML = `
        <img src="${selectedTeam.logo}" alt="${selectedTeam.name} logo" class="header-team-logo">
        <h2 class="team-name">${selectedTeam.name}</h2>
    `;
    container.appendChild(header);
    
    if (!selectedTeam) {
        container.innerText = "Team not found.";
        return;
    }
    
    if (view === "roster") {
        const primaryColorObj = selectedTeam.colors.find(c => c.primary);
        const primaryColor = primaryColorObj ? primaryColorObj.color : "#ccc";

        selectedTeam.roster.forEach(player => {
            let card = document.createElement("div");
            card.className = "player-card";
            card.style.border = `2px solid ${primaryColor}`;

            card.innerHTML = `
                <div id="list-headshot"><img src="${player.headshot}" alt="Headshot of ${player.fullName}" class="player-headshot"></div>
                <div id="list-jersey"><h2>#${player.jersey}</h2></div>
    
                <div id="list-name"><h3>${player.fullName}</h3></div>
                <div id="list-position"><p>Position: ${player.position}</p></div>
                <div id="list-height"><p>Height: ${player.height} in</p></div>
                <div id="list-weight"><p>Weight: ${player.weight} lb</p></div>
                <div id="list-age"><p>Age: ${player.age}</p></div>
                
            `;
            container.appendChild(card);
        });
    } else if (view === "recent_games") {
        selectedTeam.recent_games.forEach(game => {
            let card = document.createElement("div");
            card.className = "game-card";

            const team1 = game.scores[1];
            const team2 = game.scores[0];

            // Get all teams in the current league
            const leagueTeams = globalDataObject[league]["teams"];

            // Find logos by matching team names
            const team1Data = leagueTeams.find(t => t.name === team1.team);
            const team2Data = leagueTeams.find(t => t.name === team2.team);

            const team1Logo = team1Data ? team1Data.logo : "";
            const team2Logo = team2Data ? team2Data.logo : "";

            // Determine if selected team won
            const selectedTeamScore = game.scores.find(s => s.team === selectedTeam.name);
            const winnerExists = game.scores.some(s => s.winner === true);

            // Default to tie
            let outcomeClass = "tie";

            if (selectedTeamScore) {
                if (winnerExists) {
                    if (selectedTeamScore.winner === true) {
                        outcomeClass = "win";
                    } else {
                        outcomeClass = "loss";
                    }
                }
            }

            card.classList.add(outcomeClass);

            card.innerHTML = `
            <div id="list-date"><h3>${game.date}</h3></div>
            <div id="list-shortName"><p>${game.shortName}</p></div>

            <div id="list-team-name-1" class="team-score">
                <img src="${team1Logo}" alt="${team1.team} logo" class="team-logo">
                <p class="${team1.winner ? 'winner' : ''}">${team1.team}: ${team1.score}</p>
            </div>

            <div id="list-team-name-2" class="team-score">
                <img src="${team2Logo}" alt="${team2.team} logo" class="team-logo">
                <p class="${team2.winner ? 'winner' : ''}">${team2.team}: ${team2.score}</p>
            </div>
            `;
            container.appendChild(card);
        });
    }
}


const gridBtn = document.getElementById("grid-view-btn");
const listBtn = document.getElementById("list-view-btn");
const cardsContainer = document.getElementById("cards-outer-container");

// Default view
let currentViewClass = "grid-view";
cardsContainer.classList.add(currentViewClass);

gridBtn.addEventListener("click", () => {
    cardsContainer.classList.remove("list-view");
    cardsContainer.classList.add("grid-view");
    currentViewClass = "grid-view";
});

listBtn.addEventListener("click", () => {
    cardsContainer.classList.remove("grid-view");
    cardsContainer.classList.add("list-view");
    currentViewClass = "list-view";
});


function setActiveView(view) {
    gridBtn.classList.remove("active");
    listBtn.classList.remove("active");

    if (view === "grid") {
        cardsContainer.classList.remove("list-view");
        cardsContainer.classList.add("grid-view");
        gridBtn.classList.add("active");
    } else {
        cardsContainer.classList.remove("grid-view");
        cardsContainer.classList.add("list-view");
        listBtn.classList.add("active");
    }

    currentViewClass = view + "-view";
}

gridBtn.addEventListener("click", () => setActiveView("grid"));
listBtn.addEventListener("click", () => setActiveView("list"));








///////////////// Player of the week //////////////////////
//////////////////////////////////////////////////////////

function showRandomPlayer(allLeagues) {
    const allPlayers = [];
  
    for (let leagueKey in allLeagues) {
      const league = allLeagues[leagueKey];
  
      if (league?.teams?.length) {
        league.teams.forEach(team => {
          if (Array.isArray(team.roster)) {
            team.roster.forEach(player => {
              allPlayers.push({
                fullName: player.fullName,
                headshot: player.headshot || "https://via.placeholder.com/150",
                jersey: player.jersey,
                position: player.position,
                height: player.height,
                weight: player.weight,
                age: player.age,
                team: team.name,
                league: leagueKey.toUpperCase()
              });
            });
          }
        });
      }
    }
  
    if (allPlayers.length === 0) {
      document.getElementById("spotlight-player").innerHTML = "<p>No players found.</p>";
      return;
    }
  
    const randomPlayer = allPlayers[Math.floor(Math.random() * allPlayers.length)];
  
    const spotlight = document.getElementById("spotlight-player");
    spotlight.innerHTML = `
      <img src="${randomPlayer.headshot}" alt="${randomPlayer.fullName}" style="width:150px;">
      <div id="random-player-name">
        <h3>${randomPlayer.fullName}</h3>
        <h2>#${randomPlayer.jersey}</h2>
        <p><strong></strong> ${randomPlayer.team}</p>
    </div>
    <div id="random-player-info">
        <p><strong>Position:</strong> ${randomPlayer.position}</p>
        <p><strong>League:</strong> ${randomPlayer.league}</p>
        <p><strong>Height:</strong> ${randomPlayer.height} in</p>
        <p><strong>Weight:</strong> ${randomPlayer.weight} lb</p>
        <p><strong>Age:</strong> ${randomPlayer.age}</p>
    </div>  
    `;
  }
  