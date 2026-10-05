/* =============================================================
   BIBLIOTECA DE HISTÓRIAS — campanha "Histórias de Volta"
   =============================================================
   Cada linha de HISTORIAS é um depoimento. A ordem aqui é a ordem
   em que aparecem na página.

   Campos (só "slug" e um vídeo — drive ou youtube — são obrigatórios):

   slug       endereço da página: /historias/<slug>   (ex.: "maria-joelho")
   drive      ID do arquivo no Google Drive (o trecho entre /d/ e /view no link)
   youtube    ID do vídeo no YouTube (ex.: "dQw4w9WgXcQ"). Se preenchido, o
              player passa a ser o do YouTube. Pode manter o "drive" para a capa.
   categoria  um dos ids de CATEGORIAS abaixo
   destaque   true = aparece no topo da página (os 3 primeiros com destaque)
   frase      frase de impacto do paciente. Trecho entre *asteriscos* fica dourado.
              Ex.: "Hoje eu estou sem dor e *voltando à minha vida normal.*"
   nome       nome/identificação exibido abaixo da frase (ex.: "Maria, 62 anos")
   texto      parágrafo contando a história (aparece na página da história)
   antes      lista "antes do tratamento"  ex.: ["Dor constante no ombro", "..."]
   depois     lista "depois do tratamento" ex.: ["Sem dor", "Volta à rotina"]
   capa       imagem de capa própria (ex.: "/assets/capas/maria.jpg").
              Sem capa, usa a miniatura do Drive.

   Exemplo completo:
   { slug: "joao-ombro", drive: "1AbC...", categoria: "braco", destaque: true,
     frase: "Eu nem conseguia mover o braço. *Hoje consigo.*", nome: "João, 41 anos",
     texto: "Após meses convivendo com dores...",
     antes: ["Dor constante no ombro"], depois: ["Movimento recuperado"] },

   OBS.: as categorias abaixo foram distribuídas provisoriamente — revise.
   ============================================================= */

window.CATEGORIAS = [
  { id: "movimento",   titulo: "Voltar a se movimentar",    chamada: "voltou a se movimentar",
    descricao: "Histórias de quem recuperou a liberdade de se movimentar no dia a dia." },
  { id: "atividades",  titulo: "Voltar às atividades",      chamada: "voltou às suas atividades",
    descricao: "Relatos de quem retomou o trabalho, os estudos e o que mais ama fazer." },
  { id: "vida-normal", titulo: "Voltar à vida normal",      chamada: "voltou à vida normal",
    descricao: "Depoimentos de quem deixou a dor para trás e encontrou uma nova rotina." },
  { id: "braco",       titulo: "Voltar a mover o braço",    chamada: "voltou a mover o braço",
    descricao: "Histórias de superação de quem recuperou os movimentos e a independência." },
  { id: "sem-dor",     titulo: "Voltar a viver sem dor",    chamada: "voltou a viver sem dor",
    descricao: "Relatos de pessoas que encontraram qualidade de vida em todas as idades." },
  { id: "alegria",     titulo: "Voltar à alegria de viver", chamada: "reencontrou a alegria de viver",
    descricao: "Histórias de quem reencontrou o bem-estar e vive hoje com mais leveza." },
];

window.HISTORIAS = [
  { slug: "depoimento-10", drive: "1eS-nl0hEALH4H0VbLcsqwv45vn1_IqUC", categoria: "movimento", destaque: true },
  { slug: "depoimento-20", drive: "1IS4wYlqnaoiG32CJGAqsOEKQ292dpLTJ", categoria: "atividades", destaque: true },
  { slug: "depoimento-18", drive: "1YEhHg_R-gO5vmTtglBwU_luKthqVPGhv", categoria: "vida-normal", destaque: true },
  { slug: "depoimento-13", drive: "1sYIc1VosZSCGjcblnTKz_76SrOu26boG", categoria: "braco" },
  { slug: "depoimento-6", drive: "1Y2cqN4JaP6XtRfthRxEYUGysw3hLrbTi", categoria: "sem-dor" },
  { slug: "depoimento-11", drive: "19-WcG9fwLLtn5yw4F46HhUjiDTij2Ax_", categoria: "alegria" },
  { slug: "depoimento-14", drive: "1tSVFZtCzzT0HXO8da6mWnC5N9dbPxps0", categoria: "movimento" },
  { slug: "depoimento-3", drive: "1s6-4fMUeNedMP2LZRyTaPpXeAz9JdEZA", categoria: "atividades" },
  { slug: "depoimento-7", drive: "1PkI-9LaLVO32uPhuoetdtzMdQUwqRrEB", categoria: "vida-normal" },
  { slug: "depoimento-5", drive: "1pvTsbM0eEqf6qrL6rQlmEZrtyje14rEi", categoria: "braco" },
  { slug: "depoimento-9", drive: "1_RPq5iXx6ejrgj5Jj1nrjrbK96koJDPy", categoria: "sem-dor" },
  { slug: "depoimento-12", drive: "1pHT6Mgc9u_I294J09kA1uc8n5i_1ddfu", categoria: "alegria" },
  { slug: "depoimento-15", drive: "14yIN4olmw5TDJwTDo7cptBcp1cqDxgL_", categoria: "movimento" },
  { slug: "depoimento-17", drive: "1DVFwOrs9JOJMbJKmVUv6EeLfPgc4S0lp", categoria: "atividades" },
  { slug: "depoimento-19", drive: "11RdFbhPdUGkvvDIGeuouIOM-3NXT84dq", categoria: "vida-normal" },
  { slug: "depoimento-21", drive: "11dSq6K1b9QMMzst_fJ7Kg27tuUKyr2WU", categoria: "braco" },
  { slug: "depoimento-22", drive: "120g9--ZdIlf6XEZuyh0FqjxJJHDx0c-z", categoria: "sem-dor" },
  { slug: "depoimento-23", drive: "1xJhmO10AlO2SpVYd61S00NZ2DNk8Rdil", categoria: "alegria" },
  { slug: "depoimento-24", drive: "1JH4EMbJY43tE1NjWbwakGiLqXAkJbvHh", categoria: "movimento" },
  { slug: "depoimento-25", drive: "1AhSUEKJJJHDbREnUIYaClSC8y_9aVVpB", categoria: "atividades" },
  { slug: "depoimento-26", drive: "1VTUzwJMcCaIWi6hL15T259qKYXL7bd3M", categoria: "vida-normal" },
  { slug: "depoimento-27", drive: "1Q9V6OhknLjMkaufnQoZL9zWVd_DT1dp0", categoria: "braco" },
  { slug: "depoimento-28", drive: "19wOTDRXP62111onbWFlJl3x6zHj-vLPk", categoria: "sem-dor" },
  { slug: "depoimento-29", drive: "11Qir_2WfLh6bzREf_r0_CLiuvOP2LZwJ", categoria: "alegria" },
  { slug: "depoimento-30", drive: "10FUqlXaygWPiErGH4Z3ZBT3SgdMWXiV8", categoria: "movimento" },
  { slug: "depoimento-31", drive: "1Tb2e_P-ZumNHYsys_cgKqFPtEPkiiVu6", categoria: "atividades" },
  { slug: "depoimento-32", drive: "1LXpEajpuRWKjgOhJqDzyl9coFPkoWgQl", categoria: "vida-normal" },
  { slug: "depoimento-33", drive: "1TkcwX4UqMV7j1FGLioQ1EE8GfEhWNFtn", categoria: "braco" },
  { slug: "depoimento-34", drive: "1cWk4O-67QObn8EGl6d3GXopZzTGwTx5m", categoria: "sem-dor" },
  { slug: "depoimento-35", drive: "15l2bLBYIBEmw3IPJNqn4DmMaNpHWRTka", categoria: "alegria" },
  { slug: "depoimento-37", drive: "1MeSgbyS3W_11a7OLiEpVcE96scpCAHYc", categoria: "movimento" },
  { slug: "depoimento-39", drive: "1cbx2s-svko6G9zZkeSKonemMjqF9p-am", categoria: "atividades" },
  { slug: "depoimento-40", drive: "1PA1J-7Dfs6XRDPesgPRDVf9iFvlI7_eg", categoria: "vida-normal" },
  { slug: "depoimento-41", drive: "1G0ZPvYyfRv77hEeSo4iAfmEA-wpLHknH", categoria: "braco" },
  { slug: "depoimento-42", drive: "1aJRalbNeWb8rvoxvMaAD5S9O4ySNVhHi", categoria: "sem-dor" },
  { slug: "depoimento-43", drive: "14XiYmNztPUAy7BpTbGoHZb3ZIEUADcpN", categoria: "alegria" },
  { slug: "depoimento-44", drive: "1sksQD6OTEzlS6D9wzkOKjZmoh1VHkwwu", categoria: "movimento" },
  { slug: "depoimento-38", drive: "1X8DQqAPzG-ratPnXRvAHoLJ-Vmhp1fS_", categoria: "atividades" },
  { slug: "depoimento-1", drive: "1b7v7_Y6NMx7ImK6cYW8EZVFYfyoCxBLU", categoria: "vida-normal" },
  { slug: "depoimento-2", drive: "1T3R6nnBTdwg1Ifv7IRVWT0vFCXxK5_gm", categoria: "braco" },
  { slug: "depoimento-8", drive: "12Wzc9FgRcRlJJHTVQgI7p4nd0NUbOaya", categoria: "sem-dor" },
  { slug: "depoimento-36", drive: "1wLmXj0bFltBrzTOTCfeX0ieZzwqtysRZ", categoria: "alegria" },
  { slug: "depoimento-4", drive: "1h7dI3e2QuO0d8myy8uOhXVVkf0srGKrb", categoria: "movimento" },
  { slug: "depoimento-16", drive: "1vkNEE5XE3XaxwCDAfVzBApwQ3xMnOVs3", categoria: "atividades" },
];
