let globalDataObject

// Set Up
fetch("https://sports.is120.ckearl.com")
    .then((response) => response.json())
    .then((dataObject) => {
        console.log(dataObject)
        globalDataObject = dataObject["data"]
        completeSteps(globalDataObject);
    });

function completeSteps(allLeagues) {
    // makeTeamList(allLeagues)
    // console.log(allLeagues)

    let dropdown = document.getElementById("league-dropdown");

    dropdown.addEventListener("change", () => {
        let selectedLeague = dropdown.value;
        makeTeamList(allLeagues, selectedLeague);
    });

    makeTeamList(allLeagues, dropdown.value);

    document.getElementById("team-list").addEventListener("change", updateCards);
    document.getElementById("roster-dropdown").addEventListener("change", updateCards);
}


function makeTeamList(dataObject, selectedLeague) {
    console.log("Available keys in dataObject:", Object.keys(dataObject));

    let teams = dataObject[selectedLeague]["teams"];

    console.log("Teams from", selectedLeague + ":", teams)
    let teamList = document.getElementById("team-list");

    teamList.innerHTML = "";

    teams.forEach(team => {
        let option = document.createElement("option");
        option.textContent = team.name;
        teamList.appendChild(option);
    });
    
}

function updateCards() {
    let league = document.getElementById("league-dropdown").value;
    let teamName = document.getElementById("team-list").value;
    let view = document.getElementById("roster-dropdown").value;
    let container = document.getElementById("cards-outer-container");
    container.innerHTML = ""; // Clear previous content
    let selectedTeam = globalDataObject[league]["teams"].find(team => team.name === teamName);
    if (!selectedTeam) {
        container.innerText = "Team not found.";
        return;
    }
    if (view === "roster") {
        selectedTeam.roster.forEach(player => {
            let card = document.createElement("div");
            card.className = "player-card";
            card.innerHTML = `
                <img src="${player.headshot}" alt="Headshot of ${player.fullName}" class="player-headshot">
                <h3>${player.fullName}</h3>
                <p>Position: ${player.position}</p>
            `;
            container.appendChild(card);
        });
    } else if (view === "recent_games") {
        selectedTeam.recent_games.forEach(game => {
            let card = document.createElement("div");
            card.className = "game-card";
            card.innerHTML = `<h3>${game.date}</h3><p>Score: ${game.score}</p>`;
            container.appendChild(card);
        });
    }
}