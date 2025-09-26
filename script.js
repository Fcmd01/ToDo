import './style.css';

const modal = document.querySelector("#modal");
const botaoCriar = document.querySelector("#botaoCriar");
const botaoVoltar = document.querySelector("#botaoVoltar");
const form = document.querySelector("#form");
const lista = document.querySelector("#lista");

const modalConfirmacao = document.querySelector("#modalConfirmacao");
const btnNao = document.querySelector("#btnNao");
const btnSim = document.querySelector("#btnSim");

const modalConcluir = document.querySelector("#modalConcluir");
const btnNaoConcluir = document.querySelector("#btnNaoConcluir");
const btnSimConcluir = document.querySelector("#btnSimConcluir");

const relogio = document.querySelector("#relogio");
const btnTema = document.querySelector("#btnTema");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let indexParaExcluir = null;
let indexParaConcluir = null;
let filtroAtual = "Todas";

//função array para adicioar tarefas a lista
function renderizarTarefas() {
  lista.innerHTML = "";
  tarefas.forEach((tarefa, index) => {
    if (filtroAtual !== "Todas" && tarefa.status !== filtroAtual) return;
    const row = document.createElement("tr");
    row.className = tarefa.status === "Concluída" ? "border-b opacity-70 line-through" : "border-b";
    row.innerHTML = `
      <td class="py-3">${tarefa.titulo}</td>
      <td>${tarefa.descricao}</td>
      <td>${tarefa.data}</td>
      <td class="status">${tarefa.status}</td>
      <td>
        <div class="flex justify-end gap-2 flex-wrap">
          <button data-index="${index}" type="button" class="btn-excluir bg-red-400 dark:bg-red-700 text-white px-3 py-1 rounded hover:bg-red-500 dark:hover:bg-red-800">Excluir</button>
          <button data-index="${index}" type="button" class="btn-concluir bg-green-400 dark:bg-green-700 text-white px-3 py-1 rounded hover:bg-green-500 dark:hover:bg-green-800">Concluir</button>
        </div>
      </td>
    `;
    lista.appendChild(row);
  });
}

//função hora
function atualizarRelogio() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  relogio.textContent = `${h}:${m}:${s}`;
}


// Tema inicial
if(localStorage.getItem("tema")==="light") document.documentElement.classList.add("dark");


// Abrir/fechar modal adicionar tarefa
botaoCriar.addEventListener("click", () => { modal.classList.remove("hidden"); modal.classList.add("flex"); });
botaoVoltar.addEventListener("click", () => { modal.classList.add("hidden"); modal.classList.remove("flex"); });

// Salvar tarefa
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const titulo = document.querySelector("#titulo").value.trim();
  const descricao = document.querySelector("#descricao").value.trim();
  if (!titulo) { alert("Digite um título para a tarefa."); return; }
  tarefas.push({ titulo, descricao, data: new Date().toLocaleDateString("pt-BR"), status: "Pendente" });
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  renderizarTarefas();
  form.reset();
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

// Delegação eventos excluir/concluir
lista.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-excluir")) {
    indexParaExcluir = e.target.dataset.index;
    modalConfirmacao.classList.remove("hidden");
    modalConfirmacao.classList.add("flex");
  }
  if (e.target.classList.contains("btn-concluir")) {
    indexParaConcluir = e.target.dataset.index;
    modalConcluir.classList.remove("hidden");
    modalConcluir.classList.add("flex");
  }
});

// Modal excluir
btnNao.addEventListener("click", () => { modalConfirmacao.classList.add("hidden"); modalConfirmacao.classList.remove("flex"); indexParaExcluir=null; });
btnSim.addEventListener("click", () => {
  if (indexParaExcluir!==null){ tarefas.splice(indexParaExcluir,1); localStorage.setItem("tarefas",JSON.stringify(tarefas)); indexParaExcluir=null; }
  modalConfirmacao.classList.add("hidden"); modalConfirmacao.classList.remove("flex");
  renderizarTarefas();
});

// Modal concluir
btnNaoConcluir.addEventListener("click", () => { modalConcluir.classList.add("hidden"); modalConcluir.classList.remove("flex"); indexParaConcluir=null; });
btnSimConcluir.addEventListener("click", () => {
  if(indexParaConcluir!==null){ tarefas[indexParaConcluir].status="Concluída"; localStorage.setItem("tarefas",JSON.stringify(tarefas)); indexParaConcluir=null; }
  modalConcluir.classList.add("hidden"); modalConcluir.classList.remove("flex");
  renderizarTarefas();
});

// Filtro de status
document.querySelectorAll(".filtroStatus").forEach(btn => {
  btn.addEventListener("click", () => { filtroAtual = btn.dataset.status; renderizarTarefas(); });
});

// Tema dark/light
btnTema.addEventListener("click", () => {
  const html = document.documentElement;
  html.classList.toggle("dark");
  localStorage.setItem("tema", html.classList.contains("dark")?"dark":"light");
});

// Relógio digital
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// Render inicial
renderizarTarefas();
