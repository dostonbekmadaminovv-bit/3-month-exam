const modeBtn = document.querySelector("#mode-btn");
const modeImg = document.querySelector("#mode-img");
const modeText = document.querySelector("#mode-text");
const filterIcon = document.querySelector("#fIcon");

const filterBtn = document.querySelector("#filter-btn");
const regionOptions = document.querySelector("#region-options");
const searchInput = document.querySelector("#searchInput");
const countriesContainer = document.querySelector(".countries");

const bodyEl = document.body;
let selectedRegion = "all";

// Dark / Light rejimini qo‘llash
function applyMode(mode) {
  const isDark = mode === "dark";

  bodyEl.classList.toggle("dark-mode", isDark);

  modeImg.src = isDark ? "./images/sunrise.svg" : "./images/moon.svg";
  modeImg.style.filter = isDark ? "brightness(0) invert(1)" : "none";
  modeText.textContent = isDark ? "Light Mode" : "Dark Mode";

  filterIcon.src = isDark
    ? "./images/filter-icon-dark.svg"
    : "./images/filter-icon-light.svg";
}

const savedMode = localStorage.getItem("mode") || "light";
applyMode(savedMode);

modeBtn.addEventListener("click", () => {
  const newMode = bodyEl.classList.contains("dark-mode") ? "light" : "dark";

  localStorage.setItem("mode", newMode);
  applyMode(newMode);
});

filterBtn.addEventListener("click", () => {
  regionOptions.classList.toggle("hidden");
});

function updateUi(countries) {
  countriesContainer.innerHTML = "";

  countries.forEach((country) => {
    countriesContainer.innerHTML += `
      <div class="country" data-region="${country.region}">
        <img src="${country.flag}" alt="${country.name}">
        <h2>${country.name}</h2>
        <h3>Capital: ${country.capital}</h3>
        <p>Region: ${country.region}</p>
        <p>Subregion: ${country.subregion}</p>
        <p>Population: ${country.population}</p>
        <p>Area: ${country.area} km</p>
      </div>
    `;
  });

  filterCountries();
}

// Qidiruv va region bo‘yicha filter
function filterCountries() {
  const searchText = searchInput.value.toLowerCase().trim();
  const countryCards = document.querySelectorAll(".country");

  countryCards.forEach((country) => {
    const countryName = country.querySelector("h2").textContent.toLowerCase();
    const countryRegion = country.dataset.region;

    const matchesRegion =
      selectedRegion === "all" || countryRegion === selectedRegion;
    const matchesSearch = countryName.includes(searchText);

    country.classList.toggle("hidden", !(matchesRegion && matchesSearch));
  });
}

document.querySelectorAll(".region-options p").forEach((region) => {
  region.addEventListener("click", () => {
    selectedRegion = region.dataset.region;
    filterCountries();
    regionOptions.classList.add("hidden");
  });
});

searchInput.addEventListener("input", filterCountries);

async function getCountries() {
  try {
    const response = await fetch(
      "https://countries-api-steel-theta.vercel.app/api/countries",
    );

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`Server xatosi: ${response.status} ${text}`);
    }

    const data = JSON.parse(text);
    const countries = Array.isArray(data)
      ? data
      : (data.countries ?? data.data ?? data.results);

    if (!Array.isArray(countries)) {
      throw new Error("API javobida davlatlar arrayi topilmadi");
    }

    updateUi(countries);
  } catch (error) {
    console.error("Davlatlarni yuklashda xatolik:", error);
    countriesContainer.innerHTML = `<p>Xato: ${error.message}</p>`;
  }
}

getCountries();
