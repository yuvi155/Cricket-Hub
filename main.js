const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const playername = document.getElementById("cricketername").value.trim();

  // Clear previous data
  const fields = ["playerimg","name","dob","birthplace","bat","bowl","height","team",
                  "batodirank","batt20rank","battestrank","bowlodirank","bowlt20rank","bowltestrank","bio"];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if(el.tagName === "IMG") el.src = "./image/logo.png";
    else el.innerHTML = "";
  });

  const imageResultsDiv = document.getElementById("imageResults");
  imageResultsDiv.innerHTML = "";
  imageResultsDiv.style.display = "flex";
  imageResultsDiv.style.flexWrap = "wrap";
  imageResultsDiv.style.justifyContent = "center";

  try {
    // Fetch player info from Cricbuzz API
    const searchRes = await fetch(`https://unofficial-cricbuzz.p.rapidapi.com/players/search?plrN=${playername}`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "unofficial-cricbuzz.p.rapidapi.com",
        "x-rapidapi-key": "b6de29b671msh656afd628389116p121a33jsn8db112d6b133"
      }
    });
    const searchData = await searchRes.json();

    if(!searchData.player || searchData.player.length === 0){
      alert("Player not found!");
      return;
    }

    const id = searchData.player[0].id;

    const infoRes = await fetch(`https://unofficial-cricbuzz.p.rapidapi.com/players/get-info?playerId=${id}`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "unofficial-cricbuzz.p.rapidapi.com",
        "x-rapidapi-key": "b6de29b671msh656afd628389116p121a33jsn8db112d6b133"
      }
    });
    const data = await infoRes.json();

    // Populate player info
    document.getElementById("name").innerHTML = `<b>Full Name:</b> ${data.name}`;
    document.getElementById("dob").innerHTML = `<b>DOB:</b> ${data.DoB}`;
    document.getElementById("birthplace").innerHTML = `<b>Birth Place:</b> ${data.birthPlace}`;
    document.getElementById("bat").innerHTML = `<b>Bat:</b> ${data.bat}`;
    document.getElementById("bowl").innerHTML = `<b>Bowl:</b> ${data.bowl}`;
    document.getElementById("height").innerHTML = `<b>Height:</b> ${data.height}`;
    document.getElementById("team").innerHTML = `<b>Teams:</b> ${data.teams[0] || "N/A"}`;
    document.getElementById("bio").innerHTML = `<b>Biography:</b> ${data.bio}`;

    // Rankings
    document.getElementById("batodirank").innerHTML = `<b>Rank(Bat):</b> <b>Best(ODI):</b> ${data.currRank.bat.odiBestRank} <b>Current Rank:</b> ${data.currRank.bat.odiRank}`;
    document.getElementById("batt20rank").innerHTML = `<b>Rank(Bat):</b> <b>Best(T20):</b> ${data.currRank.bat.t20BestRank} <b>Current Rank:</b> ${data.currRank.bat.t20Rank}`;
    document.getElementById("battestrank").innerHTML = `<b>Rank(Bat):</b> <b>Best(Test):</b> ${data.currRank.bat.testBestRank} <b>Current Rank:</b> ${data.currRank.bat.testRank}`;
    document.getElementById("bowlodirank").innerHTML = `<b>Rank(Bowl):</b> <b>Best(ODI):</b> ${data.currRank.bowl.odiBestRank} <b>Current Rank:</b> ${data.currRank.bowl.odiRank}`;
    document.getElementById("bowlt20rank").innerHTML = `<b>Rank(Bowl):</b> <b>Best(T20):</b> ${data.currRank.bowl.t20BestRank} <b>Current Rank:</b> ${data.currRank.bowl.t20Rank}`;
    document.getElementById("bowltestrank").innerHTML = `<b>Rank(Bowl):</b> <b>Best(Test):</b> ${data.currRank.bowl.testBestRank} <b>Current Rank:</b> ${data.currRank.bowl.testRank}`;

    // Fetch images using Google CSE
    const googleUrl = `https://www.googleapis.com/customsearch/v1?q=${playername}&cx=d7b9b493ae7de4efd&searchType=image&num=10&key=AIzaSyC8XuPiq3JyHJwtvL5FvppNJ5wB33ZRYN0`;

    const imgRes = await fetch(googleUrl);
    const imgData = await imgRes.json();

    if(imgData.items && imgData.items.length > 0){
      // First image above player info
      const playerImg = document.getElementById("playerimg");
      playerImg.src = imgData.items[0].link;
      playerImg.style.width = "220px";
      playerImg.style.height = "220px";
      playerImg.style.objectFit = "cover";
      playerImg.style.borderRadius = "12px";
      playerImg.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
      playerImg.style.marginBottom = "20px";

      // Remaining images in gallery
      imgData.items.forEach(img => {
        const imgEl = document.createElement("img");
        imgEl.src = img.link;
        imgEl.alt = img.title || "Player Image";
        imgEl.style.width = "150px";
        imgEl.style.height = "150px";
        imgEl.style.objectFit = "cover";
        imgEl.style.margin = "5px";
        imgEl.style.borderRadius = "10px";
        imgEl.style.boxShadow = "0 3px 6px rgba(0,0,0,0.2)";
        imageResultsDiv.appendChild(imgEl);
      });
    } else {
      console.warn("No images returned from Google CSE");
    }

  } catch (err) {
    alert("Something went wrong! Try again.");
    console.error(err);
  }
});
