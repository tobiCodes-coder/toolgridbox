import { renderHeader } from '../../components/header/header.js';
import { renderFooter } from '../../components/footer/footer.js';
import { tools } from '../../data/tools.js';


const categories = ['All', 'Image', 'Text', 'Developer', 'Design', 'PDF'];

function renderCards(filtered) {

    if (filtered.length === 0) {

        return `
            <div class="no-tools">

                <div class="no-tools-icon">🔍</div>

                <h3>No tools found</h3>

                <p>
                    Try another keyword or choose a different category.
                </p>

            </div>
        `;

    }

    return filtered.map(tool => `
        <a href="${tool.url}" class="tool-card">

            <i class="icon">${tool.icon}</i>

            <h3>${tool.name}</h3>

            <p>${tool.desc}</p>

        </a>
    `).join("");

}

const toolsContent = `
<div class="page-content">

    <section class="tools-page">

        <h1>All Tools</h1>
        <p class="tools-subtitle">
            Fast, free and privacy-friendly online tools.
        </p>

        <div class="search-box">

    <svg
        class="search-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">

        <circle cx="11" cy="11" r="8"></circle>

        <path d="M21 21l-4.35-4.35"></path>

    </svg>

        <input
          type="text"
          id="toolSearch"
          class="tool-search"
          placeholder="Search tools..."
          >

        </div>

      <div class="tools-topbar">

    <span class="results-count" id="resultsCount">
        ${tools.length} Tools
    </span>

</div>

        <div class="categories" id="categoryBar">

          ${categories.map((cat, i) => `
          <span
            class="cat${i === 0 ? " active" : ""}"
            data-cat="${cat}">
            ${cat}
          </span>
          `).join("")}

        </div>

        <div class="tool-grid" id="toolGrid">

            ${renderCards(tools)}

        </div>

    </section>

</div>
`;

document.querySelector("#app").innerHTML = `
    ${renderHeader()}
    ${toolsContent}
    ${renderFooter()}
`;

const categoryBar = document.querySelector("#categoryBar");
const toolGrid = document.querySelector("#toolGrid");
const toolSearch = document.querySelector("#toolSearch");
const resultsCount = document.querySelector("#resultsCount");

let activeCategory = "All";
let searchText = "";

function updateTools() {

    let filtered = tools;

    if (activeCategory !== "All") {

        filtered = filtered.filter(
            tool => tool.category === activeCategory
        );

    }

    if (searchText !== "") {

        filtered = filtered.filter(tool =>

            tool.name
                .toLowerCase()
                .includes(searchText)

            ||

            tool.desc
                .toLowerCase()
                .includes(searchText)

        );

    }

    toolGrid.innerHTML = renderCards(filtered);
    resultsCount.textContent =
    `${filtered.length} Tool${filtered.length !== 1 ? "s" : ""}`;

}

categoryBar.addEventListener("click", (e) => {

    const cat = e.target.closest(".cat");

    if (!cat) return;

    categoryBar
        .querySelectorAll(".cat")
        .forEach(item => item.classList.remove("active"));

    cat.classList.add("active");

    activeCategory = cat.dataset.cat;

    updateTools();

});

toolSearch.addEventListener("input", e => {

    searchText = e.target.value.toLowerCase().trim();

    updateTools();

});