const STORAGE = "tbr-jar-prompts-v1";
const THEME = "tbr-jar-theme";
let currentPick = null;


const STARTER_PROMPTS = [
  "A book with a black and white cover",
  "A book with a colour in the title",
  "A book recommended by a celebrity",
  "A book set on a train or plane",
  "A book perfect for the current season",
  "A book featuring a royal family",
  "A classic book",
  "A book with purple on the cover",
  "A book set up in your continent",
  "A book with one word title",
  "A book from a duology",
  "A book recommended by a friend",
  "Enemies to Lovers book",
  "A book with title starting with 'M'",
  "Shortest book on TBR",
  "A book released this year",
  "A book recommended by a celebrity",
  "A book with your favourite color on the cover",
  "A novella",
  "Sci-Fi",
  "GoodReads awarded book",
  "A book published before the year you were born",
  "A book published in the 2000s",
  "A crime/mystery book",
  "A historical fiction book",
  "Odd number book from you GoodReads TBR"
];

const $ = s => document.querySelector(s);
const bookGrid = $("#bookGrid"), emptyState = $("#emptyState");
const input = $("#bookInput"), modal = $("#resultModal"), resultTitle = $("#resultTitle");

function save() { localStorage.setItem(STORAGE, JSON.stringify(prompts)); }
function escapeHtml(s) { const d=document.createElement("div"); d.textContent=s; return d.innerHTML; }

function makeStarterPrompts() {
  return STARTER_PROMPTS.map((title, index) => ({
    id: `starter-${index + 1}`,
    title: title
  }));
}
const saved = localStorage.getItem(STORAGE);

let prompts = saved
  ? JSON.parse(saved)
  : makeStarterPrompts();

function render() {
  bookGrid.innerHTML = prompts.map(b => `
    <article class="prompt-card">
      <div class="prompt-spine"></div>
      <div class="prompt-info">
        <div class="prompt-title" title="${escapeHtml(b.title)}">${escapeHtml(b.title)}</div>
      </div>
      <div class="card-actions">
        <button class="small-btn" data-action="delete" data-id="${b.id}" title="Remove">×</button>
      </div>
    </article>`).join("");

  emptyState.style.display = prompts.length ? "none" : "block";
  $("#bookCount").textContent = prompts.length;
  $("#queueCount").textContent = prompts.length;
}
function addBook(title) {
  prompts.unshift({id: crypto.randomUUID ? crypto.randomUUID() : Date.now()+Math.random(), title:title.trim()});
  save(); render(); input.value=""; input.focus(); toast("Added to your jar ✦");
}
function pickRandom() {
  if (!prompts.length) { toast("Add some TBR prompts first ✦"); return; }
  $(".jar-wrap").classList.add("shaking");
  setTimeout(()=>{
    $(".jar-wrap").classList.remove("shaking");
    currentPick = prompts[Math.floor(Math.random()*prompts.length)];
    resultTitle.textContent = currentPick.title;
    modal.classList.add("show"); modal.setAttribute("aria-hidden","false");
  }, 550);
}
function closeModal(){ modal.classList.remove("show"); modal.setAttribute("aria-hidden","true"); }
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(window.__toast); window.__toast=setTimeout(()=>t.classList.remove("show"),2200); }

$("#addForm").addEventListener("submit", e=>{e.preventDefault(); if(input.value.trim()) addBook(input.value);});
$("#drawBtn").addEventListener("click", pickRandom);
$("#againBtn").addEventListener("click", pickRandom);
$("#closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", e=>{if(e.target===modal) closeModal();});
document.addEventListener("keydown", e=>{if(e.key==="Escape") closeModal();});

bookGrid.addEventListener("click", e=>{
  const btn=e.target.closest("[data-action]"); if(!btn)return;
  const id=btn.dataset.id;
  if(btn.dataset.action==="delete"){ prompts=prompts.filter(x=>String(x.id)!==String(id)); toast("Removed from your jar"); }
  save(); render();
});
$("#clearBtn").addEventListener("click",()=>{
  if(!prompts.length)return;
  if(confirm("Remove every prompt from your jar?")){prompts=[];save();render();toast("Jar cleared");}
});
$("#themeBtn").addEventListener("click",()=>{
  const dark=document.documentElement.dataset.theme==="dark";
  document.documentElement.dataset.theme=dark?"":"dark";
  localStorage.setItem(THEME,dark?"light":"dark");
  $("#themeBtn").textContent=dark?"☾":"☀";
});
if(localStorage.getItem(THEME)==="dark"){document.documentElement.dataset.theme="dark";$("#themeBtn").textContent="☀";}
render();
