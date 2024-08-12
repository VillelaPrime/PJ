let pesquisa = document.querySelector("button")

async function obterToken(){
    // Verificar se já existe um token no localStorage
    const tokenSalvo = localStorage.getItem('token');
    if (tokenSalvo) {
        return tokenSalvo;
    }

    const response = await fetch('api/tokenget');

    const data = await response.json();
    const token = data['token'];

    // Salvar o token no localStorage
    localStorage.setItem('token', token);

    return token;
}

async function pesquisar() {
    document.body.querySelector('#parcelamentos').innerHTML = ''
    let consulta = document.querySelector("input").value
    await consultar(removerPontuacaoCNPJ(consulta));
}


async function consultar(cnpj) {

    const response = await fetch(`https://villela-pro-6405962cedab.herokuapp.com/api/consultar/${cnpj}/`)

    const data = await response.json();

    parcelamentos(data);
    /*prev(data["id"], token,data["cnpj"],data["razao"],);
    nao_prev(data["id"], token,data["cnpj"],data["razao"],);8?*/

}

async function parcelamentos(data) {
    try {
        console.log(data)
        if (data.length==0){
            const modalContent = `
               <dialog id="modal" class="modal">
                   <div class="modal-content">
                       <p>Nenhum Parcelamento Encontrado</p>
                       <button id="closeButton">Fechar</button>
                   </div>
               </dialog>
           `;

            // Adicionar o modal ao corpo do documento
            document.body.insertAdjacentHTML('beforeend', modalContent);

            // Obter referências aos elementos do modal
            const modal = document.getElementById('modal');
            const closeButton = modal.querySelector('.close');
            const closeDialogButton = modal.querySelector('#closeButton');

            // Função para fechar o modal
            function fecharModal() {
                // Fechar o modal
                modal.close();
                modal.remove()
            }

            // Adicionar evento de clique ao botão de fechar
            closeDialogButton.addEventListener('click', fecharModal);

            // Exibir o modal
            modal.showModal();

        }else{

            for (lista of data)  {

                if ((lista["SituacaoDoParcelamento"] === "DEFERIDO E CONSOLIDADO" || lista["SituacaoDoParcelamento"] === "AGUARDANDO DEFERIMENTO") && lista["QtdeDeParcelasConcedidas"] > 12) {

                    let prima;
                    let primo;
                    let cnpj = lista['CpfCnpjDoOptante']
                    let data_parcelamento = lista['MesAnoDoRequerimentoDoParcelamento']
                    let ModalidadeDoParcelamento = lista['TipoDeParcelamento']
                    let nome_empresa = lista['NomeDoOptante']
                    let qnt_parcelas = lista['QtdeDeParcelasConcedidas']
                    let valor_consolidado = lista['ValorConsolidado']
                    let valor_principal = lista['ValorDoPrincipal']
                    let valor_parcelas;
                    let qnt_parcelas_reducao;
                    if (lista['TipoDeParcelamento'].indexOf("TRANSACAO EXCEPCIONAL") !== -1){
                        if(lista['TipoDeParcelamento'].indexOf("DEBITOS PREVIDENCIARIOS") !== -1) {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.04))/48
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.04))/48')
                        } else {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.04))/(qnt_parcelas-12)
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.04))/(qnt_parcelas-12)')
                        }

                    } else if (lista['ModalidadeDoParcelamento'].indexOf("TRANSACAO EXTRAORDINARIA") !== -1){
                        if (lista['TipoDeParcelamento'].indexOf("PREVIDENCIARIO") !== -1) {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.01))/48
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.01))/48')
                        } else {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.01))/(qnt_parcelas-12)
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.01))/(qnt_parcelas-12)')
                        }
                    } else if (lista['TipoDeParcelamento'].indexOf("EDITAL") !== -1){
                        if (lista['TipoDeParcelamento'].indexOf("PREVIDENCIARIO") !== -1) {
                            if (lista['ModalidadeDoParcelamento'].indexOf("PEQUENO PORTE") !== -1) {
                                valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/48
                                prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/48')
                            } else {
                                valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/54
                                prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/54')
                            }
                        } else {
                            if (lista['ModalidadeDoParcelamento'].indexOf("PEQUENO PORTE") !== -1) {
                                valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/(qnt_parcelas-12)
                                prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/(qnt_parcelas-12)')
                            } else {
                                valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/(qnt_parcelas-6)
                                prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/(qnt_parcelas-6)')
                            }
                        }
                    } else if (lista['TipoDeParcelamento'].indexOf("CONVENCIONAL") !== -1 || lista['TipoDeParcelamento'].indexOf("PARCELAMENTO DA RECUPERACAO JUDICIAL") !== -1){
                        if (lista['TipoDeParcelamento'].indexOf("NAO PREVIDENCIARIA") !== -1) {
                            valor_parcelas = valor_consolidado/qnt_parcelas
                            prima = console.log('valor_parcelas = valor_principal/qnt_parcelas')
                        } else {
                            valor_parcelas = valor_consolidado/60
                            prima = console.log('valor_parcelas = valor_principal/60')
                        }
                    } else if (lista['TipoDeParcelamento'].indexOf("PERT") !== -1) {
                        if (lista['TipoDeParcelamento'].indexOf("DEBITOS PREVIDENCIARIOS") !== -1) {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.15))/60
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.15))/60')
                        } else {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.15))/qnt_parcelas
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.15))/qnt_parcelas')
                        }
                    }



                    if (lista["TipoDeParcelamento"].indexOf("PREVIDENCIARIO") !== -1 || lista["ModalidadeDoParcelamento"].indexOf("PREVIDENCIARIO") !== -1) {
                        qnt_parcelas_reducao = 60
                    } else {
                        qnt_parcelas_reducao = 145
                    }

                    inserirTabelas(cnpj, data_parcelamento, ModalidadeDoParcelamento, nome_empresa, qnt_parcelas, valor_consolidado, valor_principal, valor_parcelas, qnt_parcelas_reducao)


                }
                if(verificaSituacaoDoParcelamentoParcelamento(data)) {
                    const modalContent = `
                       <dialog id="modal" class="modal">
                           <div class="modal-content">
                               <p>Nenhum Parcelamento Ativo</p>
                               <button id="closeButton">Fechar</button>
                           </div>
                       </dialog>
                   `;

                    // Adicionar o modal ao corpo do documento
                    document.body.insertAdjacentHTML('beforeend', modalContent);

                    // Obter referências aos elementos do modal
                    const modal = document.getElementById('modal');
                    const closeButton = modal.querySelector('.close');
                    const closeDialogButton = modal.querySelector('#closeButton');

                    // Função para fechar o modal
                    function fecharModal() {
                        // Fechar o modal
                        modal.close();
                        modal.remove()
                    }

                    // Adicionar evento de clique ao botão de fechar
                    closeDialogButton.addEventListener('click', fecharModal);

                    // Exibir o modal
                    modal.showModal();
                }



            }
        }

    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
    }

}

//parcelamentos();



function inserirTabelas(cnpj, data, modalidade, nome_empresa, qnt_parcelas, valor_consolidado, valor_principal, valor_parcelas, qnt_parcelas_reducao) {
    let reducao = (valor_consolidado-valor_principal)*0.85
    let principal_assessoria = valor_consolidado-reducao
    let entrada = (principal_assessoria*0.06)
    let primeiro_ano =  entrada/12
    let parcelas_restantes = (principal_assessoria-entrada)/(qnt_parcelas_reducao-12)
    let fluxo_mensal = valor_parcelas - primeiro_ano
    let fluxo_anual = fluxo_mensal*12
    let html = `
    <table class="sem-villela" cellspacing="0" cellpadding="5">
        <thead>
            <tr>
                <th class="nome-empresa">${nome_empresa}</th>
                <th class="end cnpj">${formatarCNPJ(cnpj)}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="tipo-parcelamento" colspan="2">${modalidade}</td>
            </tr>
            <tr class="data-parcelamento">
                <td class="start">DATA PARCELAMENTO</td>
                <td class="end">${data}</td>
            </tr>
            <tr class="valor-consolidado">
                <td class="start">VALOR CONSOLIDADO</td>
                <td class="end">R$ ${formatarNumero(valor_consolidado)}</td>
            </tr>
            <tr class="valor-principal">
                <td class="start">VALOR PRINCIPAL</td>
                <td class="end">R$ ${formatarNumero(valor_principal)}</td>
            </tr>
            <tr class="num-parcelas">
                <td class="start">Nº PARCELAS TOTAL</td>
                <td class="end">${qnt_parcelas}</td>
            </tr>
            <tr class="valor-parcela">
                <td class="start">VALOR PARCELA APROX. APÓS O PEDÁGIO</td>
                <td class="end">R$ ${formatarNumero(valor_parcelas)}</td>
            </tr>
        </tbody>
    </table>

    <table class="com-villela" cellspacing="0" cellpadding="5">
        <thead>
            <tr>
                <th colspan="2">CONDIÇÕES APÓS ASSESSORIA DA VILLELA BRASIL BANK</th>
            </tr>
        </thead>
        <tbody>
            <tr class="valor-reducao">
                <td class="start">REDUÇÃO DE ATÉ</td>
                <td class="end">R$ ${formatarNumero(reducao)}</td>
            </tr>
            <tr class="valor-consolidado-villela">
                <td class="start">VALOR APROX. APÓS ASSESSORIA</td>
                <td class="end">R$ ${formatarNumero(principal_assessoria)}</td>
            </tr>
            <tr class="valor-parcela-villela">
                <td class="start">Nº PARCELAS ATÉ</td>
                <td class="end">${qnt_parcelas_reducao}</td>
            </tr>
            <tr class="primeiro-ano-villela">
                <td class="start">1ª a 12ª</td>
                <td class="end">R$ ${formatarNumero(primeiro_ano)}</td>
            </tr>
            <tr class="parcelas-restantes-villela">
                <td class="start">13ª a ${qnt_parcelas_reducao}ª</td>
                <td class="end">R$ ${formatarNumero(parcelas_restantes)}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th>ECONOMIA MENSAL</th>
                <th>R$ ${formatarNumero(fluxo_mensal)}</td>
            </tr>
            <tr>
                <th>ECONOMIA NO 1º ANO</th>
                <th>R$ ${formatarNumero(fluxo_anual)}</td>
            </tr>
        </tfoot>
    </table>
    <img src="fundo.png" alt="">
    `
    document.body.querySelector('#parcelamentos').innerHTML += html
}


function formatarNumero(numero) {
    // Converte o número para string e arredonda para duas casas decimais
    const numeroFormatado = parseFloat(numero).toFixed(2);
  
    // Divide em parte inteira e decimal
    const partes = numeroFormatado.split('.');
    const parteInteira = partes[0];
    const parteDecimal = partes[1];
  
    // Formata a parte inteira adicionando um ponto a cada três dígitos da direita para a esquerda
    const parteInteiraFormatada = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
    // Retorna a parte inteira e decimal formatadas
    return parteInteiraFormatada + ',' + parteDecimal;
}

function formatarCNPJ(cnpj) {
    // Remove caracteres não numéricos
    const numerosCNPJ = cnpj.replace(/\D/g, '');
  
    // Formata o CNPJ com máscara
    return numerosCNPJ.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
}

function removerPontuacaoCNPJ(cnpj) {
    // Remove caracteres não numéricos
    return cnpj.replace(/\D/g, '');
}

function minhaFuncaoDeRedimensionamento() {
    let valor = document.querySelector("#parcelamentos > table.sem-villela > thead > tr > th.nome-empresa").getBoundingClientRect().width

    document.querySelectorAll(".com-villela  td.start").forEach(function(celula) {
        celula.style.width = `${valor}px`; // Altere para o valor de largura desejado
    });
    
}

function minhaFuncaoDeObservacao(mutationsList, observer) {
    function procurarTag() {
        // Selecione a tag que você está procurando
        var minhaTag = document.querySelector("#parcelamentos > table.sem-villela > thead > tr > th.nome-empresa");
        // Verifique se a tag existe
        if (minhaTag) {
          console.log('A tag foi encontrada:', minhaTag);
          clearInterval(intervalId); // Pare o intervalo após encontrar a tag
          minhaFuncaoDeRedimensionamento()
        } else {
          console.log('A tag não foi encontrada ainda...');
        }
    }
      
    var intervalId = setInterval(procurarTag, 100);
}

var alvo = document.querySelector('body');

var observer = new MutationObserver(minhaFuncaoDeObservacao);

var configuracaoObservador = { childList: true, subtree: true };

observer.observe(alvo, configuracaoObservador);

// Inicia a observação do nó-alvo com as opções


// Adicione um ouvinte de evento para o evento "resize" na janela (window)
window.addEventListener("resize", minhaFuncaoDeRedimensionamento);

// Certifique-se de que a função seja executada quando a página for carregada
// para lidar com a primeira renderização

  
  
  
