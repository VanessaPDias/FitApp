import * as seguranca from "../seguranca/seguranca.js";
import * as configuracoes from "../configuracoes.js";

export async function carregar(caminhoPaginaInterna, titulo) {
    //faz fetch da pagina mestra, tranforma a resposta em texto e guarda na const 
    const paginaMestra = await fetch("/paginaMestra/paginaMestra.html");
    const conteudoDaPaginaMestra = await paginaMestra.text();

    //faz fetch da pagina interna(pagina informada no parametro) tranforma a resposta em texto e guarda na const
    const paginaInterna = await fetch("/" + caminhoPaginaInterna);
    const conteudoPaginaInterna = await paginaInterna.text();

    //tranforma o texto da pagina mestra em Html
    const parser = new DOMParser();
    const paginaMestraHtml = parser.parseFromString(conteudoDaPaginaMestra, "text/html");

    //encontra o titulo da pagina mestra e concatena o titulo que veio como parametro na funcao
    paginaMestraHtml.querySelector("title").innerHTML = "FitApp - " + titulo;


    // adiciona o nome do usuario no cabeçalho
    paginaMestraHtml.querySelector("#cabecalho-nome").innerHTML = seguranca.pegarNomeDoUsuario();


    const imagem = seguranca.pegarImagemDoUsuario();

    if (imagem) {
        paginaMestraHtml.querySelector("#cabecalho-imagem-perfil").src = `${configuracoes.urlDaApi}/` + imagem;
    }

    //coloca o conteudo da pagina interna dentro da tag <main> da pagina mestra
    paginaMestraHtml.querySelector("#container-conteudo").innerHTML = conteudoPaginaInterna;

    //adiciona o elemento lang no HTML da pagina criada
    document.documentElement.setAttribute("lang", "pt-BR");

    //substitui o conteudo html da pagina criada pelo conteudo da pagina mestra
    document.documentElement.innerHTML = paginaMestraHtml.documentElement.innerHTML;

    document.querySelector("#cabecalho-sair").onclick = fazerLogout;

    const usuario = seguranca.pegarUsuarioDoToken();

    configurarPaginaMestraPorPerfil(usuario.perfil);
}

function fazerLogout() {
    seguranca.removerDadosDoUsuario();
    window.location.href = "/index.html";
}

function configurarPaginaMestraPorPerfil(perfil) {
    const configuracaoDosPerfis = [
        {
            perfil: "assinante",
            home: "/dashboard/dashboard.html",
            menuLateral: [
                { nome: "Início", icone: "bi-house-door", id: "#inicio", link: `/dashboard/dashboard.html#inicio` },
                { nome: "Medidas", icone: "bi-rulers", id: "#medidas", link: "/medidas/medidas.html#medidas" },
                { nome: "Relatórios", icone: "bi-clipboard-data", id: "#relatorios", link: "/historicoDeMedidasAssinante/historicoDeMedidasAssinante.html#relatorios" }
            ],
            menuCabecalho: [
                { nome: "Meu Perfil", icone: "bi-person", id: "#meuPerfil", link: "../perfilAssinante/perfil.html#meuPerfil" },
            ],
        },
        {
            perfil: "administrador",
            home: "/assinantes/assinantes.html",
            menuLateral: [
                { nome: "Assinantes", icone: "bi-people", id: "#assinantes", link: "/assinantes/assinantes.html#assinantes" },
                { nome: "Nutricionistas", icone: "bi-people", id: "#nutricionistas", link: "/nutricionistas/nutricionistas.html#nutricionistas" },
                { nome: "Personal Trainers", icone: "bi-people", id: "#personalTrainers", link: "/personalTrainers/personalTrainers.html#personalTrainers" },
                { nome: "Planos", icone: "bi-card-checklist", id: "#planos", link: "/planos/planos.html#planos" },
                { nome: "Mensagens", icone: "bi-envelope", id: "#mensagens", link: "/mensagens/mensagens.html#mensagens" },
            ]
        },
        {
            perfil: "nutricionista",
            home: "/pacientes/pacientes.html",
            menuLateral: [
                { nome: "Pacientes", icone: "bi-people", id: "#pacientes", link: "/pacientes/pacientes.html#pacientes" },
                { nome: "Mensagens", icone: "bi-envelope", id: "#mensagens", link: "/mensagens/mensagens.html#mensagens" }
            ],
            menuCabecalho: [
                { nome: "Meu Perfil", icone: "bi-person", id: "#meuPerfil", link: "../perfilNutricionista/perfilNutricionista.html#meuPerfil" },
            ],
        }
    ];

    const configuracaoDoPerfil = configuracaoDosPerfis.find(m => m.perfil == perfil);

    const logoCabecalho = document.querySelector("#logo-cabecalho");

    const aLogo = document.createElement("a");
    aLogo.classList.add("link-dark", "text-decoration-none", "d-none", "d-sm-block");
    aLogo.href = configuracaoDoPerfil.home;
    aLogo.innerHTML = `<span class="fw-bold fs-5"><img src="/img/dumbbell.png" class="me-2" alt="logo-coracao" width="40"
       height="40">FitApp</span>`

    logoCabecalho.append(aLogo);

    const logoCabecalhoOffCanvas = document.querySelector("#logo-cabecalho-off-canvas");

    const aLogoOffCanvas = document.createElement("a");
    aLogoOffCanvas.classList.add("d-block", "d-sm-none", "link-dark", "text-decoration-none");
    aLogoOffCanvas.href = configuracaoDoPerfil.home;
    aLogoOffCanvas.innerHTML = `FitApp`

    logoCabecalhoOffCanvas.append(aLogoOffCanvas);


    const menuLateral = document.querySelector("#menu-lateral");
    const menuLateralOffCanvas = document.querySelector("#menu-offCanvas");

    const menuSelecionado = new URL(window.location.href).hash;

        configuracaoDoPerfil.menuLateral.forEach(item => {
            const a = document.createElement("a");
            a.href = item.link;
            a.classList.add("list-group-item", "list-group-item-action", "lista-menu-lateral", "border-0", "item-menu", "fw-semibold");
            a.innerHTML = `<i class="bi ${item.icone} fs-4 me-2"></i>${item.nome}`;

            const aOffCanvas = document.createElement("a");
            aOffCanvas.href = item.link;
            aOffCanvas.classList.add("list-group-item", "list-group-item-action", "lista-menu-offcanvas", "border-0", "item-menu", "fw-semibold");
            aOffCanvas.innerHTML = `<i class="bi ${item.icone} fs-1 me-2"></i>${item.nome}`

            if(item.id == menuSelecionado) {
                a.classList.add("active");
                aLogoOffCanvas.classList.add("active");
            }

            menuLateral.appendChild(a);
            menuLateralOffCanvas.appendChild(aOffCanvas);
        });

    const menuCabecalho = document.querySelector("#menu-cabecalho");

    if (configuracaoDoPerfil.menuCabecalho) {
        const liSeparador = document.createElement("li");
        liSeparador.innerHTML = `<hr class="dropdown-divider">`;

        menuCabecalho.prepend(liSeparador);

        configuracaoDoPerfil.menuCabecalho.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `<a class="dropdown-item" href="${item.link}"><i
                class="bi ${item.icone} me-2"></i>${item.nome}</a>`;

            menuCabecalho.prepend(li);
        });
    }
}