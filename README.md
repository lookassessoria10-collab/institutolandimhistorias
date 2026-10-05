# Histórias de Volta — Instituto Landim

Landing page da campanha **Histórias de Volta** (biblioteca de depoimentos em vídeo).
Site estático: HTML + CSS + JavaScript puro, sem build. Pronto para GitHub + Vercel.

## Estrutura

```
index.html              Página da campanha (entrada, categorias, biblioteca, conte sua história)
historia.html           Página de cada história  →  /historias/<slug>
vercel.json             Faz /historias/<slug> abrir historia.html
assets/js/historias.js  ← BIBLIOTECA: categorias e lista de vídeos (edite aqui)
assets/js/config.js     ← CONTATOS: WhatsApp, telefone, endereço, mensagens (edite aqui)
assets/js/app.js        Lógica da página (não precisa mexer)
assets/css/estilo.css   Visual
assets/img/             Logos, ícones, favicon e imagem de compartilhamento
```

## Adicionar um depoimento novo

1. Suba o vídeo na pasta do Drive e deixe o compartilhamento como
   **"Qualquer pessoa com o link – Leitor"**.
2. Copie o ID do link (`https://drive.google.com/file/d/ESTE_TRECHO/view`).
3. Em `assets/js/historias.js`, adicione uma linha em `HISTORIAS`:

```js
{ slug: "maria-joelho", drive: "ID_DO_DRIVE", categoria: "movimento",
  frase: "Hoje eu estou sem dor e *voltando à minha vida normal.*", nome: "Maria, 62 anos" },
```

O trecho entre `*asteriscos*` fica dourado. Os outros campos (`texto`, `antes`, `depois`,
`destaque`, `capa`) estão explicados no topo do arquivo.

## Trocar do Drive para o YouTube

Basta acrescentar o campo `youtube` em cada história — o player troca sozinho:

```js
{ slug: "maria-joelho", drive: "ID_DO_DRIVE", youtube: "ID_DO_YOUTUBE", ... },
```

Mantenha o `drive` enquanto quiser usar a miniatura do Drive como capa (as miniaturas do
YouTube de vídeos verticais vêm com faixas pretas). Para não depender mais do Drive,
salve as capas em `assets/capas/` e use o campo `capa: "/assets/capas/maria.jpg"`.

## Links úteis para anúncios

- Abrir a biblioteca já filtrada: `/?categoria=braco#biblioteca`
  (ids: `movimento`, `atividades`, `vida-normal`, `braco`, `sem-dor`, `alegria`)
- Página de uma história: `/historias/depoimento-10`

## Publicar na Vercel

1. Suba esta pasta para um repositório no GitHub.
2. Na Vercel: **Add New → Project → Import** o repositório.
   Framework Preset: **Other**. Sem build command, sem output directory.
3. Depois de ter o domínio final, troque o `og:image` de `index.html` e `historia.html`
   para o endereço completo (ex.: `https://historias.institutolandim.com.br/assets/img/og-historias-de-volta.jpg`)
   — o WhatsApp e o Facebook só mostram a imagem de prévia com o endereço completo.

## Testar localmente

As páginas usam caminhos absolutos (`/assets/...`), então abra com um servidor, não com
duplo clique. Com Node instalado: `npx vercel dev` ou `npx serve .` (no `serve`, a
página de história funciona por `/historia.html?h=depoimento-10`).
