const wrapper = document.querySelector(".wrapper"),
  searchInput = wrapper.querySelector("input"),
  volume = wrapper.querySelector(".word i"),
  infoText = wrapper.querySelector(".info-text"),
  synonyms = wrapper.querySelector(".synonyms .list"),
  removeIcon = wrapper.querySelector(".search span");
let audio;

// Function to handle API response from dictionary API
function data(result, word) {
  if (result.title) {
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
  } else {
    wrapper.classList.add("active");
    let definitions = result[0].meanings[0].definitions[0],
      phonetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;
    document.querySelector(".word p").innerText = result[0].word;
    document.querySelector(".word span").innerText = phonetics;
    document.querySelector(".meaning span").innerText = definitions.definition;
    document.querySelector(".example span").innerText = definitions.example;
    audio = new Audio(result[0].phonetics[0].audio);
    if (definitions.synonyms[0] == undefined) {
      synonyms.parentElement.style.display = "none";
    } else {
      synonyms.parentElement.style.display = "block";
      synonyms.innerHTML = "";
      for (let i = 0; i < Math.min(5, definitions.synonyms.length); i++) {
        let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]}</span>`;
        synonyms.insertAdjacentHTML("beforeend", tag);
      }
    }
  }
}

// Function to fetch data from dictionary API
function fetchApi(word) {
  wrapper.classList.remove("active");
  infoText.style.color = "#000";
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Word not found");
      }
      return response.json();
    })
    .then((result) => {
      data(result, word); // Handle API response data
      // After fetching API response, store the word in the database
      return fetch("/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word: word }),
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error storing word");
      }
      return response.json();
    })
    .catch((error) => {
      infoText.innerHTML = `Error: ${error.message}`;
    });
}

// Event listener for search input
searchInput.addEventListener("keyup", (e) => {
  let word = e.target.value.trim();
  if (e.key === "Enter" && word) {
    fetchApi(word);
  }
});

// Event listener for volume icon
volume.addEventListener("click", () => {
  volume.style.color = "#4D59FB";
  if (audio) {
    audio.play();
    setTimeout(() => {
      volume.style.color = "#999";
    }, 800);
  }
});

// Event listener for remove icon
removeIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  wrapper.classList.remove("active");
  infoText.style.color = "#9A9A9A";
  infoText.innerHTML =
    "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});

// Initial function call to fetch data
fetchApi("initial");
