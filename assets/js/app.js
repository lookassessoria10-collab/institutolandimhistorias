/* =============================================================
   Histórias de Volta — Instituto Landim
   Monta a página a partir de config.js e historias.js.
   Para editar conteúdo, NÃO é preciso mexer neste arquivo.
   ============================================================= */
(() => {
  "use strict";

  const C = window.CONFIG;
  const CATEGORIAS = window.CATEGORIAS;
  const HISTORIAS = window.HISTORIAS.filter(h => h.slug && (h.drive || h.youtube));
  const categoria = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const porSlug = new Map(HISTORIAS.map(h => [h.slug, h]));
  const ICONES = "/assets/img/icones.svg";
  const POR_PAGINA = 12;
  const semMovimento = matchMedia("(prefers-reduced-motion: reduce)");

  // Lista atual da biblioteca (usada para navegar no player). Redefinida na página inicial.
  let filtradas = () => HISTORIAS;

  /* ---------- utilidades ---------- */
  const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, ch =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  const fraseHTML = s => esc(s).replace(/\*(.+?)\*/g, "<em>$1</em>");
  const semMarcas = s => String(s ?? "").replace(/\*/g, "");
  const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
  const icone = (nome, classe = "icone") =>
    `<svg class="${classe}" aria-hidden="true"><use href="${ICONES}#${nome}"></use></svg>`;
  const linkWhatsApp = texto => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(texto)}`;
  const urlHistoria = h => `/historias/${encodeURIComponent(h.slug)}`;
  const tituloCategoria = h => categoria[h.categoria]?.titulo ?? "História de Volta";
  const chamada = h => categoria[h.categoria]?.chamada ?? "voltou a viver sem dor";
  const tituloTexto = h => (h.frase ? semMarcas(h.frase) : tituloCategoria(h));
  const tituloHTML = h => (h.frase
    ? `“${fraseHTML(h.frase)}”`
    : `Uma história de quem <em>${esc(chamada(h))}</em>`);

  function capa(h, largura = 640) {
    if (h.capa) return h.capa;
    if (h.drive) return `https://drive.google.com/thumbnail?id=${encodeURIComponent(h.drive)}&sz=w${largura}`;
    return `https://i.ytimg.com/vi/${encodeURIComponent(h.youtube)}/hqdefault.jpg`;
  }

  // O YouTube tem prioridade: quando o campo "youtube" for preenchido, o player troca sozinho.
  function urlPlayer(h, { autoplay = true } = {}) {
    if (h.youtube) {
      return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(h.youtube)}?rel=0&playsinline=1${autoplay ? "&autoplay=1" : ""}`;
    }
    return `https://drive.google.com/file/d/${encodeURIComponent(h.drive)}/preview`;
  }

  const iframe = (h, opcoes) =>
    `<iframe src="${urlPlayer(h, opcoes)}" title="${esc(`Depoimento: ${tituloTexto(h)}`)}" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen></iframe>`;

  function imagem(h, { largura = 640, classe = "card__img", prioridade = false, adiar = true } = {}) {
    const carga = prioridade ? 'fetchpriority="high"' : adiar ? 'loading="lazy"' : "";
    return `<img class="${classe}" src="${capa(h, largura)}" alt="" width="360" height="640" decoding="async" ${carga} referrerpolicy="no-referrer">`;
  }

  /* ---------- card de vídeo ---------- */
  function card(h, { variante = "grade", prioridade = false, adiar = true } = {}) {
    const temFrase = Boolean(h.frase);
    const texto = temFrase
      ? `<span class="card__frase">“${fraseHTML(h.frase)}”</span>`
      : `<span class="card__frase card__frase--categoria">${esc(tituloCategoria(h))}</span>`;
    return `<a class="card card--${variante}${temFrase ? " card--frase" : ""}" href="${urlHistoria(h)}" data-slug="${esc(h.slug)}" aria-label="Assistir: ${esc(tituloTexto(h))}">
      ${imagem(h, { largura: variante === "mini" ? 400 : 640, prioridade, adiar })}
      <span class="card__sombra"></span>
      ${temFrase && variante === "grade" ? `<span class="card__selo">${esc(tituloCategoria(h))}</span>` : ""}
      <span class="card__play">${icone("play")}</span>
      <span class="card__texto">${texto}${h.nome ? `<span class="card__nome">${esc(h.nome)}</span>` : ""}</span>
      ${variante === "destaque" ? '<img class="card__marca" src="/assets/img/logo-landim-claro.png" alt="" width="806" height="170" loading="lazy">' : ""}
    </a>`;
  }

  /* ---------- player em janela (modal) ---------- */
  const modal = $("#modal");
  let contexto = [];
  let indice = 0;

  function montarModal() {
    if (!modal) return;
    modal.innerHTML = `
      <div class="modal__caixa">
        <button class="modal__fechar" type="button" aria-label="Fechar">${icone("fechar")}</button>
        <div class="modal__video" id="modal-video"></div>
        <div class="modal__info">
          <p class="sobretitulo" id="modal-categoria"></p>
          <h2 class="modal__titulo" id="modal-titulo"></h2>
          <p class="modal__nome" id="modal-nome"></p>
          <div class="modal__acoes">
            <a class="botao botao--primario" id="modal-wa" target="_blank" rel="noopener">Quero entender meu caso ${icone("seta")}</a>
            <a class="botao botao--contorno" id="modal-pagina">Ver página</a>
            <button class="botao botao--texto" type="button" id="modal-compartilhar">${icone("compartilhar")} Compartilhar</button>
          </div>
          <div class="modal__nav" id="modal-nav">
            <button class="botao botao--icone" type="button" id="modal-anterior" aria-label="História anterior">${icone("seta-esq")}</button>
            <span id="modal-posicao"></span>
            <button class="botao botao--icone" type="button" id="modal-proxima" aria-label="Próxima história">${icone("seta")}</button>
          </div>
        </div>
      </div>`;

    $(".modal__fechar", modal).addEventListener("click", () => modal.close());
    $("#modal-anterior").addEventListener("click", () => mostrar(indice - 1));
    $("#modal-proxima").addEventListener("click", () => mostrar(indice + 1));
    modal.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") mostrar(indice - 1);
      if (e.key === "ArrowRight") mostrar(indice + 1);
    });
    // Para o vídeo ao fechar
    modal.addEventListener("close", () => { $("#modal-video").innerHTML = ""; });

    // Fechar ao clicar fora — fallback para navegadores sem suporte a closedby (Safari)
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      modal.addEventListener("click", e => {
        if (e.target !== modal) return;
        const r = modal.getBoundingClientRect();
        const dentro = r.top <= e.clientY && e.clientY <= r.bottom && r.left <= e.clientX && e.clientX <= r.right;
        if (!dentro) modal.close();
      });
    }
  }

  function mostrar(i) {
    indice = (i + contexto.length) % contexto.length;
    const h = contexto[indice];
    $("#modal-video").innerHTML = iframe(h);
    $("#modal-categoria").textContent = tituloCategoria(h);
    $("#modal-titulo").innerHTML = tituloHTML(h);
    $("#modal-nome").textContent = h.nome ?? "";
    $("#modal-wa").href = linkWhatsApp(C.mensagens.entenderCaso);
    $("#modal-pagina").href = urlHistoria(h);
    $("#modal-compartilhar").dataset.compartilhar = h.slug;
    $("#modal-posicao").textContent = `${indice + 1} de ${contexto.length}`;
    $("#modal-nav").hidden = contexto.length < 2;
  }

  function abrirModal(slug, lista) {
    contexto = lista.length ? lista : HISTORIAS;
    mostrar(Math.max(0, contexto.findIndex(h => h.slug === slug)));
    if (!modal.open) modal.showModal();
  }

  /* ---------- compartilhar ---------- */
  const aviso = $("#aviso");
  let avisoTempo;
  function avisar(texto) {
    // Dentro do player aberto, o aviso precisa estar no dialog para aparecer por cima
    (modal?.open ? modal : document.body).append(aviso);
    aviso.textContent = texto;
    aviso.classList.add("aviso--visivel");
    clearTimeout(avisoTempo);
    avisoTempo = setTimeout(() => aviso.classList.remove("aviso--visivel"), 2600);
  }

  async function compartilhar(h) {
    const url = new URL(urlHistoria(h), location.origin).href;
    if (navigator.share) {
      try { await navigator.share({ title: "Histórias de Volta · Instituto Landim", text: tituloTexto(h), url }); } catch { /* cancelado */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      avisar("Link da história copiado!");
    } catch {
      window.prompt("Copie o link da história:", url);
    }
  }

  /* ---------- carrossel (destaques no celular) ---------- */
  function iniciarCarrossel(trilho, pontos) {
    const itens = [...trilho.children];
    if (itens.length < 2) return;
    pontos.innerHTML = itens.map((_, i) =>
      `<button type="button" aria-label="Ir para a história ${i + 1} de ${itens.length}"></button>`).join("");
    const botoes = [...pontos.children];
    const marcar = i => botoes.forEach((b, j) => b.setAttribute("aria-current", String(i === j)));
    marcar(0);

    botoes.forEach((b, i) => b.addEventListener("click", () => {
      const item = itens[i];
      trilho.scrollTo({
        left: item.offsetLeft - (trilho.clientWidth - item.clientWidth) / 2,
        behavior: semMovimento.matches ? "auto" : "smooth",
      });
    }));

    if ("onscrollsnapchange" in HTMLElement.prototype) {
      trilho.addEventListener("scrollsnapchange", e => {
        const i = itens.indexOf(e.snapTargetInline);
        if (i >= 0) marcar(i);
      });
    } else {
      const observador = new IntersectionObserver(entradas => {
        entradas.forEach(en => { if (en.isIntersecting) marcar(itens.indexOf(en.target)); });
      }, { root: trilho, threshold: 0.6 });
      itens.forEach(item => observador.observe(item));
    }
  }

  /* ---------- página inicial ---------- */
  function iniciarInicio() {
    const usadas = new Set();

    // Etapa 1 — destaques
    const destaques = HISTORIAS.filter(h => h.destaque).slice(0, 3);
    destaques.forEach(h => usadas.add(h));
    const trilho = $("#destaques");
    trilho.dataset.contexto = "";
    trilho.innerHTML = destaques.map((h, i) =>
      `<li>${card(h, { variante: "destaque", prioridade: i === 0, adiar: false })}</li>`).join("");
    iniciarCarrossel(trilho, $("#destaques-pontos"));

    // Etapa 2 — categorias
    $("#categorias").innerHTML = CATEGORIAS.map(c => {
      const lista = HISTORIAS.filter(h => h.categoria === c.id);
      if (!lista.length) return "";
      const h = lista.find(x => !x.destaque) ?? lista[0];
      usadas.add(h);
      return `<li class="categoria">
        <a class="categoria__midia" href="${urlHistoria(h)}" data-slug="${esc(h.slug)}" data-categoria="${c.id}" aria-label="Assistir uma história: ${esc(c.titulo)}">
          ${imagem(h, { largura: 480 })}
          <span class="card__sombra"></span>
          <span class="card__play">${icone("play")}</span>
          ${h.frase ? `<span class="card__texto"><span class="card__frase">“${fraseHTML(h.frase)}”</span></span>` : ""}
        </a>
        <div class="categoria__corpo">
          <h3>${esc(c.titulo)}</h3>
          <p>${esc(c.descricao)}</p>
          <a class="link-seta" href="#biblioteca" data-filtro="${c.id}">Ver ${plural(lista.length, "história", "histórias")} ${icone("seta")}</a>
        </div>
      </li>`;
    }).join("");

    // Biblioteca com filtros
    const parametro = new URLSearchParams(location.search).get("categoria");
    let filtro = categoria[parametro] ? parametro : "todas";
    let limite = POR_PAGINA;
    const grade = $("#grade");
    const filtros = $("#filtros");
    const mais = $("#carregar-mais");
    grade.dataset.contexto = "";
    filtradas = () => (filtro === "todas" ? HISTORIAS : HISTORIAS.filter(h => h.categoria === filtro));

    const contagem = id => (id === "todas" ? HISTORIAS.length : HISTORIAS.filter(h => h.categoria === id).length);
    filtros.innerHTML = [{ id: "todas", titulo: "Todas" }, ...CATEGORIAS]
      .filter(c => contagem(c.id))
      .map(c => `<button class="filtro" type="button" data-filtro="${c.id}" aria-pressed="false">${esc(c.titulo)} <span>${contagem(c.id)}</span></button>`)
      .join("");

    function desenhar() {
      const lista = filtradas();
      grade.innerHTML = lista.slice(0, limite).map(h => `<li>${card(h)}</li>`).join("");
      mais.hidden = lista.length <= limite;
      $("#contador").textContent = plural(lista.length, "história", "histórias");
      filtros.querySelectorAll(".filtro").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.filtro === filtro)));
    }
    desenhar();

    mais.addEventListener("click", () => {
      const lista = filtradas();
      const inicio = limite;
      limite += POR_PAGINA;
      grade.insertAdjacentHTML("beforeend", lista.slice(inicio, limite).map(h => `<li>${card(h)}</li>`).join(""));
      grade.children[inicio]?.querySelector("a")?.focus({ preventScroll: true });
      mais.hidden = lista.length <= limite;
    });

    document.addEventListener("click", e => {
      const alvo = e.target.closest("[data-filtro]");
      if (!alvo) return;
      filtro = alvo.dataset.filtro;
      limite = POR_PAGINA;
      desenhar();
      if (alvo.tagName === "A") {
        e.preventDefault();
        $("#biblioteca").scrollIntoView({ behavior: semMovimento.matches ? "auto" : "smooth" });
      }
    });

    // Etapa 4 — histórias que já inspiram
    const inspiram = $("#inspiram");
    inspiram.dataset.contexto = "";
    inspiram.innerHTML = HISTORIAS.filter(h => !usadas.has(h)).slice(0, 4)
      .map(h => `<li>${card(h, { variante: "mini" })}</li>`).join("");
  }

  /* ---------- página de cada história ---------- */
  const blocoAntesDepois = h => `
    <div class="antes-depois">
      <p class="sobretitulo">Antes / depois da rotina</p>
      <div class="antes-depois__grade">
        <div class="ad ad--antes">
          ${icone("antes", "ad__icone")}
          <h2>Antes</h2>
          <ul>${(h.antes ?? []).map(i => `<li>${esc(i)}</li>`).join("")}</ul>
        </div>
        <div class="ad ad--depois">
          ${icone("depois", "ad__icone")}
          <h2>Depois</h2>
          <ul>${(h.depois ?? []).map(i => `<li>${esc(i)}</li>`).join("")}</ul>
        </div>
      </div>
    </div>`;

  const blocoIdentificou = () => `
    <div class="identificou">
      <h2>Você se identificou com esta história?</h2>
      <p>Converse com a nossa equipe e entenda quais caminhos são possíveis para o seu caso.</p>
      <ul class="identificou__canais">
        <li><a data-wa="agendar" href="#">${icone("whatsapp")} WhatsApp</a></li>
        <li><a href="tel:${C.telefoneLink}">${icone("telefone")} ${esc(C.telefone)}</a></li>
      </ul>
    </div>`;

  function iniciarHistoria() {
    const caminho = location.pathname.match(/^\/historias\/([^/?#]+)/);
    const slug = decodeURIComponent(caminho?.[1] ?? new URLSearchParams(location.search).get("h") ?? "");
    const h = porSlug.get(slug);
    const alvo = $("#historia-conteudo");

    if (!h) {
      document.title = "História não encontrada · Instituto Landim";
      alvo.innerHTML = `
        <div class="historia__vazia">
          <p class="sobretitulo">Histórias de Volta</p>
          <h1 class="titulo">Não encontramos esta história.</h1>
          <p>Ela pode ter mudado de endereço. Que tal conhecer todas as histórias da campanha?</p>
          <a class="botao botao--primario" href="/#historias">Ver histórias ${icone("seta")}</a>
        </div>`;
      return;
    }

    const cat = categoria[h.categoria];
    document.title = `${tituloTexto(h)} · Histórias de Volta · Instituto Landim`;
    $('meta[name="description"]').content = h.texto
      ? semMarcas(h.texto).slice(0, 155)
      : `Assista à história real de quem ${chamada(h)} com o cuidado do Instituto Landim.`;

    alvo.innerHTML = `
      <div class="historia__cabeca">
        <nav class="migalhas" aria-label="Você está em">
          <a href="/#historias">Histórias de Volta</a>
          ${cat ? `<span aria-hidden="true">/</span><a href="/?categoria=${cat.id}#biblioteca">${esc(cat.titulo)}</a>` : ""}
        </nav>
        <p class="sobretitulo">Histórias reais</p>
        <h1 class="historia__frase">${tituloHTML(h)}</h1>
        ${h.nome ? `<p class="historia__nome">${esc(h.nome)}</p>` : ""}
      </div>
      <div class="historia__video">
        <div class="player">${iframe(h, { autoplay: false })}</div>
      </div>
      <div class="historia__corpo">
        <p class="historia__resumo">${h.texto ? esc(h.texto) : "Assista ao depoimento e conheça a jornada de quem passou pelo cuidado do Instituto Landim. Cada caso é único — e o primeiro passo é entender o seu."}</p>
        <div class="acoes">
          <a class="botao botao--primario" data-wa="entenderCaso" href="#">Quero entender meu caso ${icone("seta")}</a>
          <button class="botao botao--contorno" type="button" data-compartilhar="${esc(h.slug)}">${icone("compartilhar")} Compartilhar</button>
        </div>
      </div>
      <div class="historia__extra">${h.antes?.length || h.depois?.length ? blocoAntesDepois(h) : blocoIdentificou()}</div>`;

    const relacionadas = [
      ...HISTORIAS.filter(x => x !== h && x.categoria === h.categoria),
      ...HISTORIAS.filter(x => x !== h && x.categoria !== h.categoria),
    ].slice(0, 4);
    const grade = $("#grade-relacionadas");
    grade.dataset.contexto = "";
    grade.innerHTML = relacionadas.map(x => `<li>${card(x)}</li>`).join("");
    $("#relacionadas").hidden = false;
  }

  /* ---------- blocos comuns: chamada final e rodapé ---------- */
  function renderChamada() {
    const alvo = $("#cta");
    if (!alvo) return;
    const fotos = HISTORIAS.filter(h => h.destaque).slice(0, 3);
    alvo.outerHTML = `
      <section class="secao secao--cta" id="contato">
        <div class="container">
          <div class="cta">
            <div class="cta__fotos" aria-hidden="true">${fotos.map(h => imagem(h, { largura: 400, classe: "" })).join("")}</div>
            <div class="cta__texto">
              <p class="cta__frase">Mais vida.<br>Menos dor.<br><em>Sempre com você.</em></p>
              <p class="cta__tags">Histórias reais.<br>Pessoas reais.<br>Movimento real.</p>
            </div>
            <div class="cta__acao">
              <p class="cta__pergunta">Vamos juntos para o seu próximo passo?</p>
              <a class="botao botao--ouro botao--grande" data-wa="agendar" href="#">Falar com a equipe ${icone("seta")}</a>
              <ul class="cta__canais">
                <li><a data-wa="agendar" href="#">${icone("whatsapp")} WhatsApp</a></li>
                <li><a href="tel:${C.telefoneLink}">${icone("telefone")} Ligar</a></li>
                <li><a href="${C.mapa}" target="_blank" rel="noopener">${icone("local")} Como chegar</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>`;
  }

  function renderRodape() {
    const alvo = $("#rodape");
    if (!alvo) return;
    alvo.innerHTML = `
      <div class="container rodape__grade">
        <div class="rodape__marca">
          <img src="/assets/img/logo-landim-completo-claro.png" alt="Instituto Landim — Ortopedia, Intervenção em Dor e Medicina Regenerativa" width="975" height="299" loading="lazy">
          <p class="manuscrito manuscrito--claro" aria-hidden="true">Mais vida em todas as fases.</p>
        </div>
        <div>
          <h2 class="rodape__titulo">Fale com a gente</h2>
          <ul class="rodape__lista">
            <li><a data-wa="agendar" href="#">${icone("whatsapp")} WhatsApp</a></li>
            <li><a href="tel:${C.telefoneLink}">${icone("telefone")} ${esc(C.telefone)}</a></li>
            <li><a href="mailto:${C.email}">${icone("email")} ${esc(C.email)}</a></li>
            <li><a href="${C.instagram}" target="_blank" rel="noopener">${icone("instagram")} ${esc(C.instagramUsuario)}</a></li>
          </ul>
        </div>
        <div>
          <h2 class="rodape__titulo">Onde estamos</h2>
          <p class="rodape__endereco">${C.enderecoLinhas.map(esc).join("<br>")}</p>
          <a class="link-seta link-seta--claro" href="${C.mapa}" target="_blank" rel="noopener">${icone("local")} Abrir no mapa</a>
        </div>
      </div>
      <div class="container rodape__legal">
        <p>${esc(C.responsavelTecnico)}</p>
        <p>Os depoimentos refletem experiências individuais de pacientes. Os resultados variam de pessoa para pessoa e este conteúdo não substitui uma consulta médica.</p>
        <p>© ${new Date().getFullYear()} Instituto Landim · <a href="${C.site}" target="_blank" rel="noopener">institutolandim.com.br</a></p>
      </div>`;
  }

  /* ---------- links do WhatsApp / config ---------- */
  function ligarLinks() {
    document.querySelectorAll("[data-wa]").forEach(a => {
      a.href = linkWhatsApp(C.mensagens[a.dataset.wa] ?? C.mensagens.agendar);
      a.target = "_blank";
      a.rel = "noopener";
    });
    document.querySelectorAll("[data-link]").forEach(a => {
      if (C[a.dataset.link]) a.href = C[a.dataset.link];
    });
  }

  /* ---------- menu do celular e topo ---------- */
  function iniciarTopo() {
    const botao = $(".topo__abrir");
    const menu = $("#menu");
    const definir = aberto => {
      botao.setAttribute("aria-expanded", String(aberto));
      botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
      $("use", botao).setAttribute("href", `${ICONES}#${aberto ? "fechar" : "menu"}`);
      document.body.classList.toggle("menu-aberto", aberto);
    };
    botao.addEventListener("click", () => definir(botao.getAttribute("aria-expanded") !== "true"));
    menu.addEventListener("click", e => { if (e.target.closest("a")) definir(false); });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && document.body.classList.contains("menu-aberto")) { definir(false); botao.focus(); }
    });

    const topo = $(".topo");
    const marcar = () => topo.classList.toggle("topo--rolou", scrollY > 8);
    addEventListener("scroll", marcar, { passive: true });
    marcar();
  }

  /* ---------- eventos globais ---------- */
  document.addEventListener("click", e => {
    const botao = e.target.closest("[data-compartilhar]");
    if (botao) {
      const h = porSlug.get(botao.dataset.compartilhar);
      if (h) compartilhar(h);
      return;
    }

    const link = e.target.closest("a[data-slug]");
    if (!link || !modal || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    let lista;
    if (link.dataset.categoria) lista = HISTORIAS.filter(h => h.categoria === link.dataset.categoria);
    else {
      const grupo = link.closest("[data-contexto]");
      if (grupo?.id === "grade") lista = filtradas();
      else if (grupo) lista = [...grupo.querySelectorAll("a[data-slug]")].map(a => porSlug.get(a.dataset.slug));
      else lista = HISTORIAS;
    }
    abrirModal(link.dataset.slug, lista);
  });

  // Capa que não carregou: mostra o fundo da marca no lugar
  document.addEventListener("error", e => {
    if (e.target instanceof HTMLImageElement) e.target.classList.add("sem-capa");
  }, true);

  /* ---------- início ---------- */
  const pagina = document.body.dataset.pagina;
  if (pagina === "inicio") iniciarInicio();
  if (pagina === "historia") iniciarHistoria();
  renderChamada();
  renderRodape();
  montarModal();
  ligarLinks();
  iniciarTopo();
})();
