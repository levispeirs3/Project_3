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