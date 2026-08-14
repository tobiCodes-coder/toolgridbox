import { renderHeader } from '../../components/header/header.js';
import { renderFooter } from '../../components/footer/footer.js';
import { tools } from '../../data/tools.js';


const categories = ['All', 'Image', 'Text', 'Developer', 'Design', 'PDF'];

function renderCards(filtered) {
  if (filtered.length === 0) {
    return '<p class="no-tools">No tools in this category yet.</p>';
  }

  return filtered.map(tool => `
    <a href="${tool.url}" class="tool-card">
      <i class="icon">${tool.icon}</i>
      <h3>${tool.name}</h3>
      <p>${tool.desc}</p>
    </a>
  `).join('');
}

const toolsContent = `
<div class="page-content">

    <section class="tools-page">

        <h1>All Tools</h1>

        <input
            id="toolSearch"
            class="tool-search"
            type="text"
            placeholder="Search tools..."
        >

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