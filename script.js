const rootElement = document.getElementById("root");

const fetchUrl = (url) => fetch(url).then((res) => res.json());

const skeletonComponent = () => `
    <h1>Rick and Morty app</h1>
    <p id="selected-card"></p>
    <div class="characters" style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; background-color: lightgreen"></div>
    <div class="buttons style="position: fixed; bottom: 0; right: 0;"></div>
`;

const characterComponent = (characterData) => `
    <div class="char card text-center border-success" style="max-width: 15rem;">
        <img src=${characterData.image} class="card-img-top">
        <div class="card-body text-success">
          <h4>${characterData.id}</h4>
          <h2 class="card-title">${characterData.name}</h2>
          <h3>appears in: ${characterData.episode.length} episodes</h3>
        </div>
    </div>
`;

const selectedCharacterComponent = (characterData) => {
    let episodesArray = [];

    characterData.episode.forEach((epUrl) => {
        episodesArray.push(epUrl.substring(40));
    });

    return ` 
        <h2>${characterData.name}</h2>
        <h3>${characterData.status}</h3>
        <h4>${characterData.gender}</h4>
        <h5>${characterData.species}</h5>
        <h6>Episodes: ${episodesArray.join(", ")}</h6>
    `;
};

const buttonComponent = (id, text) => `<button id=${id} class="btn btn-outline-info">${text}</button>`;

const buttonEventComponent = (id, url) => {
  const buttonElement = document.querySelector(`#${id}`);
  buttonElement.addEventListener("click", () => {
    rootElement.innerHTML = "LOADING...";
    fetchUrl(url).then((data) => {
      makeDomFromData(data, rootElement);
      const selectedCharElement = document.getElementById("selected-card");
      /* const charElements = document.querySelectorAll(".char");

      charElements.forEach((charElement) =>
        charElement.addEventListener("click", () => {
          const selectedId = Number(charElement.querySelector("h4").innerText);
          const selectedChar = data.results.find((char) => char.id === selectedId);
          selectedCharElement.innerHTML = selectedCharacterComponent(selectedChar);
        })
      ); */
    });
  });
};

const makeDomFromData = (data, rootElement) => {
  rootElement.innerHTML = skeletonComponent();

  const charactersElement = document.querySelector(".characters");
  const buttonsElement = document.querySelector(".buttons");

  const info = data.info;
  const characters = data.results;

  characters.forEach((character) => {
    charactersElement.insertAdjacentHTML("beforeend", characterComponent(character));
  });

  if (info.prev) {
    buttonsElement.insertAdjacentHTML("beforeend", buttonComponent("prev", `<span class="material-icons">arrow_back</span>`));
    buttonEventComponent("prev", info.prev);
  }
  if (info.next) {
    buttonsElement.insertAdjacentHTML("beforeend", buttonComponent("next", `<span class="material-icons">arrow_forward</span>`));
    buttonEventComponent("next", info.next);
  }
};

const init = () => {
  fetchUrl("https://rickandmortyapi.com/api/character").then((data) => {
    makeDomFromData(data, rootElement);

    const selectedCharElement = document.getElementById("selected-card");

    /* const charElements = document.querySelectorAll(".char");
    charElements.forEach((charElement) =>
      charElement.addEventListener("click", () => {
        const selectedId = Number(charElement.querySelector("h4").innerText);
        const selectedChar = data.results.find((char) => char.id === selectedId);
        selectedCharElement.innerHTML = selectedCharacterComponent(selectedChar);
      })
    ); */
  });
};

init();
