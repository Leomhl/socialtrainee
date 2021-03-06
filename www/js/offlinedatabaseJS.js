//1. Inicialização

// Variáveis globais
  var localDB = null; //Para a conexão com o banco de dados

//Para manter setado qual jogo o usuário está
  var materia = null; //adm, segtrab ou logistica

  //Dados da questão
  var pergunta = null;
  var resposta1 = null;
  var resposta2 = null;
  var resposta3 = null;
  var resposta4 = null;
  var correta = null; 

  //Para controle das questões do banco
  var uacc = 1; //Última acessada
  var ucad = 0; //Última cadastrada

function onInit()
{
    try {
        if (!window.openDatabase) {
            updateStatus("Erro: Seu navegador não permite banco de dados.");
        }
        else {
            initDB();
            createTables();
        }
    } 
    catch (e) {
        if (e == 2) {
            updateStatus("Erro: Versão de banco de dados inválida.");
        }
        else {
            updateStatus("Erro: Erro desconhecido: " + e + ".");
        }
        return;
    }
}

//Cria o banco
function initDB()
{
    var shortName = 'stuffDB';
    var version = '1.0';
    var displayName = 'MyStuffDB';
    var maxSize = 1048576; // Em bytes (1MB)
    localDB = window.openDatabase(shortName, version, displayName, maxSize);
}

//Cria as tabelas que o projeto usará
function createTables()
{
    var query = 'CREATE TABLE IF NOT EXISTS usuario(id INTEGER NOT NULL, nome VARCHAR NOT NULL, email VARCHAR NOT NULL, adm INTEGER, segtrab INTEGER, logistica INTEGER, pergadm INTEGER, pergsegtrab INTEGER, perglogistica INTEGER)';
    var queryadm = 'CREATE TABLE IF NOT EXISTS adm(id INTEGER NOT NULL PRIMARY KEY , pergunta VARCHAR NOT NULL, resposta1 VARCHAR NOT NULL, resposta2 VARCHAR NOT NULL, resposta3 VARCHAR NOT NULL, resposta4 VARCHAR NOT NULL, correta VARCHAR NOT NULL)';
    var querysegtrab = 'CREATE TABLE IF NOT EXISTS segtrab(id INTEGER NOT NULL PRIMARY KEY , pergunta VARCHAR NOT NULL, resposta1 VARCHAR NOT NULL, resposta2 VARCHAR NOT NULL, resposta3 VARCHAR NOT NULL, resposta4 VARCHAR NOT NULL, correta VARCHAR NOT NULL)';
    var querylogistica = 'CREATE TABLE IF NOT EXISTS logistica(id INTEGER NOT NULL PRIMARY KEY , pergunta VARCHAR NOT NULL, resposta1 VARCHAR NOT NULL, resposta2 VARCHAR NOT NULL, resposta3 VARCHAR NOT NULL, resposta4 VARCHAR NOT NULL, correta VARCHAR NOT NULL)';
    
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandler); 
            transaction.executeSql(queryadm, [], nullDataHandler, errorHandler);
            transaction.executeSql(querysegtrab, [], nullDataHandler, errorHandler);
            transaction.executeSql(querylogistica, [], nullDataHandler, errorHandler);
        });
    } 
    catch (e) {
        updateStatus("Erro: Tabelas não criadas " + e + ".");
        return;
    }
}

//Detona as tabelas
function dropTables()
{
    var query = 'drop table usuario';
    var queryadm = 'drop table adm';
    var querysegtrab = 'drop table segtrab';
    var querylogistica = 'drop table logistica';

    try {
          localDB.transaction(function(transaction){

              transaction.executeSql(query, [], nullDataHandler, errorHandler);
              transaction.executeSql(queryadm, [], nullDataHandler, errorHandler);
              transaction.executeSql(querysegtrab, [], nullDataHandler, errorHandler);
              transaction.executeSql(querylogistica, [], nullDataHandler, errorHandler);
              alert("Tabelas 'dropadas' com sucesso!");
          });
    } 
    catch (e) 
    {
        alert("Erro: drop não feito " + e + ".");
        return;
    }
}

//Detona o banco de dados
function dropDatabase()
{
    dropTables();
    var query = 'drop database stuffDB';
    try {
        localDB.transaction(function(transaction){

            transaction.executeSql(query, [], nullDataHandler, errorHandler);
            alert("Banco 'dropadas' com sucesso!");

        });
    } 
    catch (e)
    {
        // updateStatus("Erro: drop não feito " + e + ".");
        alert("Erro: drop no banco não feito " + e + ".");
        return;
    }
    
    initDB();
}

function onCreate()
{
    var nome = document.itemForm.nome.value;
    var email = document.itemForm.email.value;

    if (nome == "" || email == "") 
    {
        updateStatus("Erro: 'Nome' e 'Email' são campos obrigatórios!");
    }
    else
    {
        var query = "INSERT INTO usuario(id, nome, email, adm, segtrab, logistica, pergadm, pergsegtrab, perglogistica) VALUES(1, ?, ?, 0,0,0,1,1,1)";
    
        localDB.transaction(function(transaction){
          transaction.executeSql(query, [nome,email], nullDataHandler, errorHandler);
        });      
          updateStatus("Inserção realizada");
          alert('Cadastrado com sucesso!');
          popularTabelas();   
    }  
                      
    document.getElementById('tt2').innerHTML = "Enquanto a instalação termina... <br><br> Porque a roda de trem é de ferro e não de borracha? Por que se fosse de borracha apagaria a linha! (:";
    $("#cadastro").css("display", "none");
    $("#tt1").css("display", "none");
    $("#loading").show();
}


function popularTabelas()
{

var administracao = 
[
  {
    //Pergunta 1
    'p':  'Existem alguns tipos de cheque, escolha qual não é um.',
    'r1': 'Cheque ao portador',
    'r2': 'Cheque tracejado',
    'r3': 'Cheque cruzado',
    'r4':'Cheque visado',
    'c':  'Cheque tracejado'
  },
  {
    //Pergunta 2
    'p':  'O endosso permite?',
    'r1': 'Transferir a posse do documento.',
    'r2': 'Proibir a transferência do documento.',
    'r3': 'Permite o descarte do documento.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Transferir a posse do documento.'
  },
  {  
    //Pergunta 3
    'p':  'Complete: O cheque nominal não à ordem?',
    'r1': 'Não pode haver ordem de pagamento.',
    'r2': 'Não se transmite por endosso.',
    'r3': 'Não é transmissível sem endosso.',
    'r4': 'É transmissível parcialmente.',
    'c':  'Não se transmite por endosso.'
  },  
  { 
    //Pergunta 4
    'p':  'Sobre o cheque cruzado:',
    'r1': 'Contém informações cruzadas de usuários.',
    'r2': 'Pode ser sacado apenas em conta.',
    'r3': 'Pode ser sacado livremente.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Pode ser sacado apenas em conta.'
  },
  { 
    //Pergunta 5
    'p':  'O cheque visado é?',
    'r1': 'Aquele que poucos têm acesso.',
    'r2': 'Aquele que o banco paga apenas em caixa.',
    'r3': 'Aquele que o banco emite um visto.',
    'r4': 'Aquele que o banco paga sem testar autenticidade.',
    'c':  'Aquele que o banco emite um visto.'
  }, 
  {
    //Pergunta 6
    'p':  'O cheque ao portador tem "problema" de segurança, qual é esse problema?',
    'r1': 'Não precisar de autenticação do banco.',
    'r2': 'Não ser assinado pelo emitente.',
    'r3': 'Não ter o nome de quem o recebe.',
    'r4': 'Não poder ser rastreado.',
    'c':  'Não ter o nome de quem o recebe.'
  },
  {
    //Pergunta 7
    'p':  'Sobre a hora extra, marque a alternativa correta:',
    'r1': 'É um adicional pago após 44h extras trabalhadas.',
    'r2': 'É pago por semestre.',
    'r3': 'De seg à sab cada hora vale 55% a mais e domingo 50%.',
    'r4': 'De seg à sab cada hora vale 50% a mais e domingo 100%.',
    'c':  'De seg à sab cada hora vale 50% a mais e domingo 100%.'
  },
  { 
    //Pergunta 8
    'p':  'O limite de hora extra por dia é de:',
    'r1': '2h',
    'r2': '4h',
    'r3': '1h',
    'r4': 'Nenhuma das anteriores.',
    'c':  '2h'
  },
  {  
    //Pergunta 9
    'p':  'A hora extra só é aceita legalmente quando?',
    'r1': 'A pessoa tem contrato por tempo definido.',
    'r2': 'A pessoa tem carteira temporária.',
    'r3': 'A pessoa tem carteira assinada.',
    'r4': 'A pessoa não tem vínculo empregatício.',
    'c':  'A pessoa tem carteira assinada.'
  },
  {
    //Pergunta 10
    'p':  'Existem quantos tipos de cheque?',
    'r1': '7',
    'r2': '5',
    'r3': '8',
    'r4': '6',
    'c':  '6'
  },
  {  
    //Pergunta 11
    'p':  'O cálculo de hora extra redonda é o mesmo das horas extras quebradas!',
    'r1': 'Está correto.',
    'r2': 'Está incorreto.',
    'r3': 'Está parcialmente correto.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Está incorreto.'
  },
  {  
    //Pergunta 12
    'p':  'Sobre a ética, é fundamental que:',
    'r1': 'As informações devem ser espalhadas.',
    'r2': 'As informações devem ser mantidas por algum tempo.',
    'r3': 'As informações confidenciais devem ser propagadas para toda a empresa.',
    'r4': 'As informações devem ser guardadas por tempo indeterminado.',
    'c':  'As informações devem ser guardadas por tempo indeterminado.'
  },
  {  
    //Pergunta 13
    'p':  'A administração é uma área:',
    'r1': 'Área peculiar.',
    'r2': 'Área gerencial menos importante.',
    'r3': 'Área de grande importância nas empresas.',
    'r4': 'Área de igual importância aos demais setores.',
    'c':  'Área de igual importância aos demais setores.'
  },
  {  
    //Pergunta 14
    'p':  'Dados de funcionários como telefone, devem ser divulgados quando?',
    'r1': 'Requisitado por alguém.',
    'r2': 'Autorizado pelo funcionário e gerentes.',
    'r3': 'Autorizado pelo gerente.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Autorizado pelo funcionário e gerentes.'
  },
  {  
    //Pergunta 15
    'p':  'Projetos da empresa devem ter sigilo desde que:',
    'r1': 'Seja exigido o mesmo.',
    'r2': 'Éticamente o ideal é que nunca sejam contados.',
    'r3': 'Haja um contrato de sigilo formalizado.',
    'r4': 'Quando a empresa não se preocupa com sigilo.',
    'c':  'Haja um contrato de sigilo formalizado.'
  },
  {
    //Pergunta 16
    'p':  'O endosso dos cheques auxiliam na segurança da transação financeira. A afirmativa está:',
    'r1': 'Correta.',
    'r2': 'Incorreta.',
    'r3': 'Parcialmente Correta.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Parcialmente Correta.'
  },
  {
    //Pergunta 17
    'p':  'A ética é:',
    'r1': 'Uma coisa dispensável.',
    'r2': 'Chave para o profissional de qualquer ramo.',
    'r3': 'Parte de uma empresa.',
    'r4': 'De uma pessoa contratada.',
    'c':  'Chave para o profissional de qualquer ramo.'
  },
  {  
    //Pergunta 18
    'p':  'Os canais de distribuição de uma empresa são:',
    'r1': 'Modos de distribuição da renda das empresas.',
    'r2': 'Modos que as empresas recebem mercadorias.',
    'r3': 'Modos que as empresas gerenciam internamente mercadorias.',
    'r4': 'Modos que as empresas escoam sua produção.',
    'c':  'Modos que as empresas escoam sua produção.'
  },
  {  
    //Pergunta 19
    'p':  'Para uma empresa de software, qual canal de distribuiçao abaixo é o correto?',
    'r1': 'Caminhão.',
    'r2': 'Avião.',
    'r3': 'Cloud.',
    'r4': 'Carro.',
    'c':  'Cloud.'
  },
  {
    //Pergunta 20
    'p':  'Quais devem ser os tipos de arquivo?',
    'r1': 'Ativo, parcial, inativo.',
    'r2': 'Ativo, ativo parcial, inativo.',
    'r3': 'Ativo, inativo, morto.',
    'r4': 'Ativo inicial, ativo parcial, inativo.',
    'c':  'Ativo, inativo, morto.'
  },
  {  
    //Pergunta 21
    'p':  'Quantos são os tipos de suporte?',
    'r1': '5',
    'r2': '6',
    'r3': '7',
    'r4': '8',
    'c':  '7'
  },
  {  
    //Pergunta 22
    'p':  'Qual o nome da tabela que controla o tempo que os documentos devem ser guardados?',
    'r1': 'Tabela documental.',
    'r2': 'Tabela de temporalidade.',
    'r3': 'Tabela administrativa.',
    'r4': 'Tabela insertiva.',
    'c':  'Tabela de temporalidade.'    
  },
  {  
    //Pergunta 23
    'p':  'O suporte textual, proporciona o armazenamento de mensagens de texto vindas de qualquer área , seja digital, cartográfica e etc.',
    'r1': 'Correto.',
    'r2': 'Incorreto.',
    'r3': 'Parcialmente correto.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Incorreto.'    
  },
  {  
    //Pergunta 24
    'p':  'Caso o documento tenha sido armazenado em um suporte informático, deve haver uma checagem de dados de quanto em quanto tempo?',
    'r1': '1 ano.',
    'r2': '8 meses.',
    'r3': '8 anos.',
    'r4': '20 anos.',
    'c':  '8 anos.'    
  },
  {  
    //Pergunta 25
    'p':  'Microfilmático pigmentado é um tipo de suporte?',
    'r1': 'Sim.',
    'r2': 'Não.',
    'r3': 'Apenas para vídeos.',
    'r4': 'Apeas para fotos.',
    'c':  'Não.'    
  },
  {  
    //Pergunta 26
    'p':  'O contrato por tempo determinado tem duração máxima de 1 ano?',
    'r1': 'Não, sua duração varia.',
    'r2': 'Sim.',
    'r3': 'Não, deve durar apenas 90 dias.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Não, sua duração varia.'    
  },
  {  
    //Pergunta 27
    'p':  'O contrato de experiência não pode ultrapassar 90 dias! Esta afirmação está?',
    'r1': 'Expressamente incorreta.',
    'r2': 'Parcialmente correta.',
    'r3': 'Correta.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Correta.'    
  },
  {  
    //Pergunta 28
    'p':  'O empregador não precisa pela lei declara na carteira de alguém que está em período de experiência! A afirmativa está?',
    'r1': 'Incorreta pois a lei não cuida de período experimental.',
    'r2': 'Correta pois só assina-se a carteira quando há contratação.',
    'r3': 'Incorreta pois o empregador não precisa assinar a carteira nunca.',
    'r4': 'Incorreta pois é necessário registrar o período de experiência na carteira de trabalho.',
    'c':  'Incorreta pois é necessário registrar o período de experiência na carteira de trabalho.'    
  },
  {  
    //Pergunta 29
    'p':  'A carga horária integral de um trabalhador pela lei deve ser de?',
    'r1': '44 horas mensais.',
    'r2': '4 horas diárias.',
    'r3': '44 horas semanais.',
    'r4': '7 horas diárias.',
    'c':  '44 horas semanais.'    
  },
  {  
    //Pergunta 30
    'p':  'A carga horária parcial de um trabalhador pela lei deve ser de?',
    'r1': '44 horas mensais.',
    'r2': '20 horas mensais até 44 horas mensais.',
    'r3': '20 horas semanais até 25 horas semanais.',
    'r4': '25 horas semanais até 44 horas semanais.',
    'c':  '20 horas semanais até 25 horas semanais.'    
  }
];


var segurancaTrabalho = 
[
  {
    //Pergunta 1
    'p':  'Não é considerado objetivo da CIPA:',
    'r1': 'Observar e relatar condições de risco.',
    'r2': 'Solicitar medidas para redução dos acidentes.',
    'r3': 'Expedir advertência aos trabalhadores.',
    'r4': 'Eliminar e/ou neutralizar os riscos existentes.',
    'c':  'Expedir advertência aos trabalhadores.'
  },
  {
    //Pergunta 2
    'p':  'Assinale a alternativa incorreta:',
    'r1': 'PCMSO: Programa de Controle Médico de Saúde Ocupacional.',
    'r2': 'CAT: Comunicação de Acidente de Trabalho.',
    'r3': 'PPRA: Programa de Prevenção de Riscos Ambulatoriais.',
    'r4': 'EPC: Equipamento de Proteção Coletiva.',
    'c':  'PPRA: Programa de Prevenção de Riscos Ambulatoriais.'
  },
  {
    //Pergunta 3
    'p':  'Quais são as principais causas dos acidentes de trabalho?',
    'r1': 'Atos inseguros e condições inseguras.',
    'r2': 'Inexistência da CIPA e do PPRA.',
    'r3': 'Atos inseguros e inexistência do Técnico de Segurança.',
    'r4': 'Atos inseguros e inexistência do Engenheiro de Segurança.',
    'c':  'Atos inseguros e condições inseguras.'
  },
   {
    //Pergunta 4
    'p': 'Analise os seguintes  instrumentos para a prevenção dos acidentes de trabalho: I-Processos educativos para o trabalhador. II-Campanhas de segurança e CIPA atuante. III-Análise dos acidentes. IV-Inspeção de segurança.',
    'r1': 'Somente I e II.',
    'r2': 'Somente II e III.',
    'r3': 'Somente II, III e IV.',
    'r4': 'I, II, III e IV.',
    'c':  'I, II, III e IV.'
  },
  {
    //Pergunta 5 
    'p':  'Quanto aos Equipamentos de Proteção Individual, cabe ao empregador: I-Ditar as normas para sua confecção. II-Exigir o seu uso. III-Adquirir o equipamento adequado para cada atividade. IV-Responsabilizar-se pela higienização e manutenção periódica. V-Orientar e treinar o trabalhador sobre o uso adequado, guarda e conservação. Assinale a alternativa correta:',
    'r1': 'I e II são verdadeiras.',
    'r2': 'II, III e IV são verdadeiras.',
    'r3': 'lI, III, IV e V são verdadeiras.',
    'r4': 'I, ll e V são verdadeiras.',
    'c':  'lI, III, IV e V são verdadeiras.'
  },
   {
    //Pergunta 6
    'p':  'LER significa:',
    'r1': 'Lesão por Esforço Repetido.',
    'r2': 'Lesão por Esforço Repetitivo.',
    'r3': 'Lesão por Estres Repetido.',
    'r4': 'Lesão por Estres Repetitivo.',
    'c':  'Lesão por Esforço Repetitivo.'
  },
   {
    //Pergunta 7
    'p':  'Se o trabalhador estiver fazendo por vontade própria algum favor para a empresa, como forma de lhe proporcionar proveito, e se acidentar. É considerado acidente de trabalho?',
    'r1': 'Sim.',
    'r2': 'Não.',
    'r3': 'Nunca.',
    'r4': 'Talvez.',
    'c':  'Sim.'
  },
   {
    //Pergunta 8
    'p':  'Estando o trabalhador em viagem para treinamento custeado pela empresa. Se acontecer um acidente, é considerado acidente de trabalho?',
    'r1': 'Sim.',
    'r2': 'Não.',
    'r3': 'Talvez.',
    'r4': 'Acidente de trabalho só acontece no trabalho ou no trajeto.',
    'c':  'Sim.'
  },
   {
    //Pergunta 9
    'p':  'Qual desses é conciderados acidente de trabalho?',
    'r1': 'Quando está se pensando na Empresa e ocorre um acidente.',
    'r2': 'Quando o horário expediente termina e ao voltar para casa ocorre um acidente.',
    'r3': 'Quando você está no horário de almoço e morre por intoxicação alimentar em casa.',
    'r4': 'Nenhum esta correto.',
    'c':  'Quando o horário expediente termina e ao voltar para casa ocorre um acidente.'
  },
   {
    //Pergunta 10
    'p':  'Para que se aplica o adicional de periculosidade?',
    'r1': 'Radiação, explosivos, inflamáveis e eletricidade.',
    'r2': 'Eletricidade de alta tensão, ambiente confinado e altura.',
    'r3': 'Explosivos, altura, pressão e ambiente poluído.',
    'r4': 'Qualquer trabalho com risco a vida e a saúde.',
    'c':  'Radiação, explosivos, inflamáveis e eletricidade.'
  },
   {
    //Pergunta 11
    'p':  'Respeqtivamente de quanto é o adcional de periculosidade no grau maximo medio e minimo:',
    'r1': '40% 30% 20%.',
    'r2': '40% 20% 10%.',
    'r3': '50% 30% 10%.',
    'r4': 'Nenhuma das anteriores.',
    'c':  '40% 20% 10%.'
  },
   {
    //Pergunta 12
    'p':  'Qual o significado da sigla CIPA?',
    'r1': 'Conselho Interno de Prevenção de Acidentes.',
    'r2': 'Comissão Interna de Prevenção de Acidentes.',
    'r3': 'Convenção Interna de Proteção Contra Acidentes.',
    'r4': 'Confederação Internacional de Profissionais Acidentados.',
    'c':  'Comissão Interna de Prevenção de Acidentes.'
  },
   {
    //Pergunta 13
    'p':   'O que significa a sigla EPI?',
    'r1': 'Equipamento para Uso Interno.',
    'r2': 'Equipamento para Uso Imediato.',
    'r3': 'Equipamento de Proteção Interno.',
    'r4': 'Equipamento de Proteção Individual.',
    'c':  'Equipamento de Proteção Individual.'
  },
   {
    //Pergunta 14
    'p':  'Para trabalhos que possam causar irritações nos olhos, desbaste em materiais que geram fagulhas, cavacos e outras lesões decorrentes da ação de radiações perigosas, devemos usar sempre:',
    'r1': 'Protetor Auricular.',
    'r2': 'Bota de borracha.',
    'r3': 'Luvas.',
    'r4': 'Óculos de Segurança.',
    'c':  'Óculos de Segurança.'
  },
   {
    //Pergunta 15
    'p':  'O que é EPC?',
    'r1': 'Estoque de Peças de Composição.',
    'r2': 'Equipamento de Proteção Composto.',
    'r3': 'Equipamento de Proteção Coletiva.',
    'r4': 'Equipamento de Proteção de Conservação.',
    'c':  'Equipamento de Proteção Coletiva.'
  },
   {
    //Pergunta 16
    'p':  'A quem cabe treinar o trabalhador sobre o uso adequado do EPI:',
    'r1': 'O Empregado.',
    'r2': 'O Empregador.',
    'r3': 'A Cipa.',
    'r4': 'A Sipat.',
    'c':  'O Empregado.'
  },
   {
    //Pergunta 17
    'p':  'A quem cabe a guarda e conservação do EPI:',
    'r1': 'O Empregado.',
    'r2': 'O Empregador.',
    'r3': 'A Cipa.',
    'r4': 'A Sipat.',
    'c':  'O Empregado.'
  },
   {
    //Pergunta 18
    'p':  'O objetivo do PCMSO é o de promover e preservar à saúde do conjunto dos seus trabalhadores. Qual o significado da sigla PMCO:',
    'r1': 'Participação no Controle Médico de Saúde Ocupacional.',
    'r2': 'Presença no Controle Médico de Saúde Ocupacional.',
    'r3': 'Programa de Controle Médico de Saúde Ocupacional.',
    'r4': 'Programa de Casos Médico de Saúde Ocupacional.',
    'c':  'Programa de Controle Médico de Saúde Ocupacional.'
  },
   {
    //Pergunta 19
    'p':  'Quais são os exames médicos que obrigatoriamente são incluídos no PCMSO:',
    'r1': 'Admissional; Periódico; Retorno ao trabalho; Mudança de função; Mudança de Cidade;Demissional.',
    'r2': 'Admissional; Periódico; Retorno ao trabalho; Mudança de função; Mudança de Cidade.',
    'r3': 'Admissional; Periódico; Retorno ao trabalho; Mudança de função; Demissional.',
    'r4': 'Admissional; Periódico; Retorno ao trabalho; Mudança de função;Mudança de Setor; Demissional.',
    'c':  'Admissional; Periódico; Retorno ao trabalho; Mudança de função; Demissional.'
  },
   {
    //Pergunta 20
    'p':  'Serão consideradas atividades ou operações insalubres aquelas que: ',
    'r1': 'Por sua natureza, condições ou métodos de trabalho, exponham os empregados a agentes nocivos à saúde, acima dos limites de pessoais fixados em razão da natureza e da intensidade do agente e do tempo de exposição aos seus efeitos.',
    'r2': 'Por sua condição ou métodos de trabalho, exponham os empregados a agentes nocivos à saúde, acima dos limites de tolerância fixados em razão da natureza e da intensidade do agente e do tempo de exposição aos seus efeitos.',
    'r3': 'Todas as respostas estão corretas.',
    'r4': 'Por sua natureza, condições ou métodos de trabalho, exponham os empregados a agentes nocivos à saúde, acima dos limites de tolerância fixados em razão da natureza e da intensidade do agente e do tempo de exposição aos seus efeitos.',
    'c':  'Por sua natureza, condições ou métodos de trabalho, exponham os empregados a agentes nocivos à saúde, acima dos limites de tolerância fixados em razão da natureza e da intensidade do agente e do tempo de exposição aos seus efeitos.'
  },
  {
    //Pergunta 21
    'p':  'Cabe às empresas:',
    'r1': 'Facilitar o exercício da fiscalização pela autoridade competente.',
    'r2': 'Cumprir e fazer cumprir as disposições legais e regulamentares sobre segurança e medicina do trabalho.',
    'r3': 'Fornecer aos empregados, gratuitamente, EPI adequado ao risco, em perfeito estado de conservação e funcionamento.',
    'r4': 'Fornecer EPI ao trabalhador compatível ao risco da atividade gratuitamente.',
    'c':  'Facilitar o exercício da fiscalização pela autoridade competente.'
  },
  {
    //Pergunta 22
    'p':  'O trabalho em condições de periculosidade assegura ao empregado um adicional de:',
    'r1': '30% (trinta por cento) sobre o salário sem os acréscimos resultantes de gratificações, prêmios ou participações nos lucros da empresa.',
    'r2': '40% (quarenta por cento) sobre o salário sem os acréscimos resultantes de gratificações, prêmios ou participações nos lucros da empresa.',
    'r3': '20% (vinte por cento) sobre o salário sem os acréscimos resultantes de gratificações, prêmios ou participações nos lucros da empresa.',
    'r4': '50% (cinquenta por cento) sobre o salário sem os acréscimos resultantes de gratificações, prêmios ou participações nos lucros da empresa.',
    'c':  '30% (trinta por cento) sobre o salário sem os acréscimos resultantes de gratificações, prêmios ou participações nos lucros da empresa.'
  },
  {
    //Pergunta 23
    'p':  'Sobre o adicional de insalubridade, escolha a resposta correta.',
    'r1': 'Todos têm o direito de receber.',
    'r2': 'Apenas quem trabalha em zona de risco tem direito de receber.',
    'r3': 'Apenas quem sofreu acidente tem direito',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Apenas quem trabalha em zona de risco tem direito de receber.'
  },
  {
    //Pergunta 24
    'p':  'A remuneração da insalubridade é dada de qual maneira?',
    'r1': 'Risco leve 20%, intermediário 30%, alto 50%.',
    'r2': 'Risco leve 15%, intermediário 25%, alto 45%.',
    'r3': 'Risco leve 5%, intermediário 15%, alto 25%.',
    'r4': 'Risco leve 10%, intermediário 20%, alto 40%.',
    'c':  'Risco leve 10%, intermediário 20%, alto 40%.'
  },
  {
    //Pergunta 25
    'p':  'São periculosas as atividades ou operações que?',
    'r1': 'Tenha contato com radiação, eletrecidade, iodo radioativo, explosivos, tóxicos e etc.',
    'r2': 'Tenha contato com documentos e canetas.',
    'r3': 'Tenha contato com produtos inodoros',
    'r4': 'Tenha contato com radiação branca.',
    'c':  'Tenha contato com radiação, eletrecidade, iodo radioativo, explosivos, tóxicos e etc.'
  },
  {
    //Pergunta 26
    'p':  'A remuneração da periculosidade é de?',
    'r1': '25%',
    'r2': '12%',
    'r3': '35%',
    'r4': '30%',
    'c':  '30%'
  },
  {
    //Pergunta 27
    'p':  'Ainda sobre a remuneração da periculosidade, responda:',
    'r1': 'É calculada em cima do salário mínimo bruto.',
    'r2': 'É calculda em cima do salário do funcionário.',
    'r3': 'É calculada em cima do rendimento mensal da empresa.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'É calculda em cima do salário do funcionário.'
  },
  {
    //Pergunta 28
    'p':  'Sobre o adicional de risco portuário, ele constitui em:',
    'r1': '20%',
    'r2': '30%',
    'r3': '40%',
    'r4': '50%',
    'c':  '40%'
  },
  {
    //Pergunta 29
    'p':  'É devido ao empregado que trabalha no porto?',
    'r1': 'Ordenado',
    'r2': 'Alinhado',
    'r3': 'Organizado',
    'r4': 'Sindicalizado',
    'c':  'Organizado'
  },
  {
    //Pergunta 30
    'p':  'O adicional para os profissionais portuários é pago quando?',
    'r1': 'Para qualquer um que trabalhe em portos.',
    'r2': 'Quando houver riscos portuários.',
    'r3': 'Quando houver algum acidente portuário.',
    'r4': 'Para qualquer profissional legalizado em qualquer porto.',
    'c':  'Quando houver riscos portuários.'
  }
];  

var logistica = 
[
  {
    //Pergunta 1
    'p':  'O que é palete?',
    'r1': 'Um equipamento logístico.',
    'r2': 'Um aparato exclusivo para caminhões.',
    'r3': 'Um equipamento usado exclusivamente para guardar a carga em local estático.',
    'r4': 'Uma máquina responsável pelos cálculos logísticos.',
    'c':  'Um equipamento logístico.'
  },
  {
    //Pergunta 2
    'p':  'O que  é logística reversa?',
    'r1': 'Cuida da parte sustentável visando apenas a poluição da água e ar.',
    'r2': 'Cuida de reverter procedimentos incorretos.',
    'r3': 'Cuida da parte sustentável de todo o processo.',
    'r4': 'Cuida quando a encomenda é entregue errada e precisa retornar.',
    'c':  'Cuida da parte sustentável de todo o processo.'
  },
  {
    //Pergunta 3
    'p':  'Os especialistas logísticos são prestadores de serviços que proveem soluções logísticas completas, abrangendo diversidade de serviços planejados e gerenciados de forma integrada. A sentença está?',
    'r1': 'Correta.',
    'r2': 'Incorreta.',
    'r3': 'Parcialmente correta.',
    'r4': 'Inconsistente.',
    'c':  'Correta.'
  },
   {
    //Pergunta 4
    'p':  'Os depósitos de distribuição são espaços em que os produtos são armazenados por longos períodos, com o objetivo de proteger as mercadorias até que sejam solicitadas, sendo reduzido o manuseio. A sentença está?',
    'r1': 'Incorreta.',
    'r2': 'Incoerente com o assunto.',
    'r3': 'Correta',
    'r4': 'Parcialmente correta.',
    'c':  'Correta.'
  },
  {
    //Pergunta 5 
    'p':  'O que é just in time?',
    'r1': 'Ter um estoque justo e equilibrado.',
    'r2': 'Ter um vasto estoque.',
    'r3': 'Ter uma reserva além do necessário.',
    'r4': 'Ter apenas o necessário.',
    'c':  'Ter apenas o necessário.'
  },
   {
    //Pergunta 6
    'p':  'Código de barras, sistemas de posicionamento global e identificação por meio de radiofrequência são tecnologias que podem ser utilizadas para o rastreamento de mercadorias.',
    'r1': 'Incorreto.',
    'r2': 'Correto.',
    'r3': 'Parcialmente correto.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Correto.'
  },
   {
    //Pergunta 7
    'p':  'São cinco os modais de transporte de carga: aéreo, rodoviário, ferroviário, aquaviário e intermodal.',
    'r1': 'Correto.',
    'r2': 'Incorreto.',
    'r3': 'Parcialmente correto.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Correto.'
  },
   {
    //Pergunta 8
    'p':  'A taxa cobrada por uma transportadora depende de certas características do item transportado, como seu valor financeiro, sua densidade e(ou) peso, sua embalagem e o risco de sua deterioração.',
    'r1': 'Correto.',
    'r2': 'Incorreto.',
    'r3': 'Parcialmente correto.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Correto.'
  },
   {
    //Pergunta 9
    'p':  'O programa 5S teve o intuito de?',
    'r1': 'Melhorar a qualidade dos produtos e produtividade.',
    'r2': 'Melhorar a qualidade de vida dos funcionários apenas.',
    'r3': 'Melhorar a qualidade de vida dos funcionários e aumentar a produtividade.',
    'r4': 'Melhorar a produtividade sem preocupar-se com limpeza.',
    'c':  'Melhorar a qualidade de vida dos funcionários e aumentar a produtividade.'
  },
   {
    //Pergunta 10
    'p':  'Sobre o computador:',
    'r1': 'É um aparato pouco utilizado.',
    'r2': 'É parte essencial porém quase nunca usada no processo logístico.',
    'r3': 'É parte essencial do processo de logística do século XXI.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'É parte essencial do processo de logística do século XXI.'
  },
   {
    //Pergunta 11
    'p':  'O container?',
    'r1': 'Abriga carga a ser transportada e é essencial para a logística.',
    'r2': 'Abriga apenas alguns tipos de carga e são usados em larga escala apenas maritimamente.',
    'r3': 'Abriga todo tipo de carga mesmo perecível sem conter refrigeração.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Abriga carga a ser transportada e é essencial para a logística.'
  },
   {
    //Pergunta 12
    'p':  'Sobre a logística integrada, responda:',
    'r1': 'Não deve preocupar-se com efieiência e sim com custos.',
    'r2': 'Deve preocupar-se com custos, eficiência e melhora de resultados.',
    'r3': 'Deve preocupar-se com custos, ineficiência e reução de resultados.',
    'r4': 'Deve preocupar-se com prazos, eficiência e melhora gradativa de resultados.',
    'c':  'Deve preocupar-se com custos, eficiência e melhora de resultados.'
  },
   {
    //Pergunta 13
    'p':  'O modal de transporte aeroviário é o:',
    'r1': 'Mais indicado por baixo custo e facilidades.',
    'r2': 'Menos indicado pela demora no transporte.',
    'r3': 'Mais indicado em situações emergenciais ou de curto prazo para entrega.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Mais indicado em situações emergenciais ou de curto prazo para entrega.'
  },
   {
    //Pergunta 14
    'p':  'O modal de transporte rodoviário no Brasil é:',
    'r1': 'Pouco utilizado por sua ineficiência e altos custos.',
    'r2': 'Altamente utilizado e hoje é um dos mais baratos no país.',
    'r3': 'Usado porém apenas para transporte de cargas específicas.',
    'r4': 'Muito utilizado apesar do alto custo de manutenção.',
    'c':  'Altamente utilizado e hoje é um dos mais baratos no país.'
  },
   {
    //Pergunta 15
    'p':  'Sobre o modal de transporte dutoviário:',
    'r1': 'É o mais rápido para transporte de pessoas.',
    'r2': 'É o mais rápido par transporte de fluidos.',
    'r3': 'É o mais rápido para o transporte de outros dutos.',
    'r4': 'É o mais rápido para o transporte de mercadorias refrigeradas.',
    'c':  'É o mais rápido par transporte de fluidos.'
  },
   {
    //Pergunta 16
    'p':  'Apesar do modal ferroviário não estar em alta no Brasil, ele:',
    'r1': 'É um modal excelente indiscutivelmente para transporte de carga em massa.',
    'r2': 'É um modal bom para tranporte porém um dos mais caros.',
    'r3': 'É um modal de transporte ruim e barato.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'É um modal excelente indiscutivelmente para transporte de carga em massa.'
  },
   {
    //Pergunta 17
    'p':  'No quesito frequência de funcionamento, qual é o modal mais eficiente?',
    'r1': 'Aeroviário.',
    'r2': 'Ferroviário.',
    'r3': 'Rodoviário.',
    'r4': 'Dutoviário.',
    'c':  'Dutoviário.'
  },
   {
    //Pergunta 18
    'p':  'Em média, qual é o custo do transporte de cargas na logística?',
    'r1': '50%',
    'r2': '20%',
    'r3': '37%',
    'r4': '60%',
    'c':  '60%'
  },
   {
    //Pergunta 19
    'p':  'Sobre a empilhadeira:',
    'r1': 'Carrega qualquer tipo de carga sem palete.',
    'r2': 'Necessita que a mercadoria esteja em palete.',
    'r3': 'Não é mais utilizada.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Necessita que a mercadoria esteja em palete.'
  },
   {
    //Pergunta 20
    'p':  'A logística abrange:',
    'r1': 'Transportar, organizar, empacotar e entregar.',
    'r2': 'Cuidar, avaliar, transportar, entregar.',
    'r3': 'Cuidar, transportar, assegurar e entregar.',
    'r4': 'Assegurar, transportar, entregar.',
    'c':  'Assegurar, transportar, entregar.'
  },
  {
    //Pergunta 21
    'p':  'Sobre o armazém, responda:',
    'r1': 'A rua é o local que o caminhão descarrega as cargas no armazém.',
    'r2': 'As ruas são os corredores do armazém.',
    'r3': 'Os vãos são similares às docas.',
    'r4': 'Docas não são conceitos contidos no armazém.',
    'c':  'As ruas são os corredores do armazém.'
  },
  {
    //Pergunta 22
    'p':  'As esteiras são fundamentais para o processo logístico. A afirmação está?',
    'r1': 'Correta.',
    'r2': 'Incorreta.',
    'r3': 'Parcialmente correta.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Correta.'
  },
  {
    //Pergunta 23
    'p':  'O programa 5S contém no seu escopo a limpeza do ambiente alegando gerar produtividade. Essa afirmativa é correta?',
    'r1': 'Correta.',
    'r2': 'Incorreta.',
    'r3': 'Parcialmente correta.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Correta.'
  },
  {
    //Pergunta 23
    'p':  'O S5 do programa 5S fala sobre disciplina, para isso deve-se:',
    'r1': 'Treinar funcionários.',
    'r2': 'Obrigar que haja obediência.',
    'r3': 'Treinar gerando compreensão do bem coletivo.',
    'r4': 'Nenhuma das anteriores.',
    'c':  'Treinar gerando compreensão do bem coletivo.'
  },
  {
    //Pergunta 24
    'p':  'A embarcação do tipo Reefer serve para?',
    'r1': 'Carga viva.',
    'r2': 'Carga seca.',
    'r3': 'Carga refrigerada.',
    'r4': 'Carga automotiva.',
    'c':  'Carga refrigerada.'
  },
  {
    //Pergunta 25
    'p':  'O Bulk Carrier é especializado em carregar cargas?',
    'r1': 'Refrigeradas.',
    'r2': 'Líquidas.',
    'r3': 'Sólidas.',
    'r4': 'Vivas.',
    'c':  'Sólidas.'
  },
  {
    //Pergunta 26
    'p':  'Full container é especializado em carga de?',
    'r1': 'Containers.',
    'r2': 'Metal para containers.',
    'r3': 'Cargas em geral.',
    'r4': 'Carga automotiva.',
    'c':  'Containers.'
  },
  {
    //Pergunta 27
    'p':  'A embarcação Tanker é especializada em?',
    'r1': 'Carga sólida a granel.',
    'r2': 'Carga líquida a granel.',
    'r3': 'Carga refrigerada em geral.',
    'r4': 'Carga de tanques de guerra.',
    'c':  'Carga líquida a granel.'
  },
  {
    //Pergunta 28
    'p':  'A embarcação Ro-Ro é especializada em que tipo de carga?',
    'r1': 'Automotiva com locomoção própria.',
    'r2': 'Automotiva sem locomoção própria.',
    'r3': 'Carga necessitada de transporte por guindaste.',
    'r4': 'Carga automotiva como peças e acessórios.',
    'c':  'Automotiva com locomoção própria.'
  },
  {
    //Pergunta 29
    'p':  'O módulo de um armazém é?',
    'r1': 'Um corredor.',
    'r2': 'Um planejamento.',
    'r3': 'O sistema do computador.',
    'r4': 'Estante.',
    'c':  'Estante.'
  },
  {
    //Pergunta 30
    'p':  'O nível quando se trata de organização de armazéns é?',
    'r1': 'A altura dos módulos.',
    'r2': 'Altura de entrada das docas.',
    'r3': 'Prateleira dos módulos.',
    'r4': 'Andar gerencial.',
    'c':  'Prateleira dos módulos.'
  }
];       
    localDB.transaction(function(transaction){
      var i = 0;
      for(i; i<30; i++){
          transaction.executeSql('INSERT INTO adm (pergunta, resposta1, resposta2, resposta3, resposta4, correta) VALUES (?, ?, ? ,?, ?, ?)', [administracao[i].p, administracao[i].r1, administracao[i].r2, administracao[i].r3, administracao[i].r4, administracao[i].c], nullDataHandler, errorHandler); 
          transaction.executeSql('INSERT INTO segtrab (pergunta, resposta1, resposta2, resposta3, resposta4, correta) VALUES (?, ?, ? ,?, ?, ?)', [segurancaTrabalho[i].p, segurancaTrabalho[i].r1, segurancaTrabalho[i].r2, segurancaTrabalho[i].r3, segurancaTrabalho[i].r4, segurancaTrabalho[i].c], nullDataHandler, errorHandler);              
          transaction.executeSql('INSERT INTO logistica (pergunta, resposta1, resposta2, resposta3, resposta4, correta) VALUES (?, ?, ? ,?, ?, ?)', [logistica[i].p, logistica[i].r1, logistica[i].r2, logistica[i].r3, logistica[i].r4, logistica[i].c], nullDataHandler, errorHandler);                                 
      }
    });             
      
    //Tempo para que dê tempo de popular as tabelas e só depois trocar de tela
    var pausa = setInterval(function(){chamatela('home.html'); clearInterval(pausa); }, 6000);  
} 

// 3. Funções de tratamento e status.
// Tratando erros

errorHandler = function(transaction, error)
{
    updateStatus("Erro: " + error.message);
    return true;
}

nullDataHandler = function(transaction, results)
{
}

// Funções de update
function updateStatus(status)
{
    document.getElementById('status').innerHTML = status;
}


//***********#########################****#################********#####*******


// Daqui para baixo foi personalizado para as necessidades do projeto

// ### Testa se o registro do usuário existe, se exitir chama a home ###
function onTest(){
    
    var query = "SELECT * FROM usuario where id=1;";
    
    try {
        localDB.transaction(function(transaction){
        
            transaction.executeSql(query, [], function(transaction, results){
                var len = results.rows.length;
               
               // Caso encontre algum registro
                if(len == 1)
                {
                    chamahome();
                }

                // Caso não encontre nenhum registro
                if(len == 0)
                {
                    chamatela('cadastro.html');
                }
   
            }, function(transaction, error){
                 updateStatus("Erro: " + error.code + "<br>Mensagem: " + error.message);
            });
        });
    } 
    catch (e) {
        // updateStatus("Error: SELECT não realizado " + e + ".");
        chamahome();
    }
}

//Para iniciar a tela de splash
function startIndex()
{
    onInit();
    onTest();
}

//Cara iniciar a tela de informações
function startInformacoes()
{
    onInit();
    onSelection();
}

//Para iniciar a tela home
function startHome()
{
    onInit();
    nome();
}

//Inicia o jogo
function startJogo(mat)
{
     switch(mat)
      {
          case 'adm':
               materia = 'adm';
              break;
          case 'segtrab': 
               materia = 'segtrab';
               break;
          case 'logistica': 
               materia = 'logistica';
              break;   
      }
   
    onInit();
    jogoPontos(); // carrega a pontuação na tela do jogo
    uAcessadauCadastrada(); //retorna a última pergunta acessada

    //Para conseguir carregar as perguntas
    var pausa = setInterval(function(){ carregaPerg(); clearInterval(pausa); }, 600);    
}

//Exibe na view de informações os dados do banco
function updateInformations(id, nome, email, adm, segtrab, logistica)
{
    document.getElementById('nome').innerHTML = '<hr>Nome: <br>'+nome;
    document.getElementById('email').innerHTML = '<hr>Email: <br>'+email;
    document.getElementById('adm').innerHTML = '<hr>Pontos Administração: '+adm;
    document.getElementById('segtrab').innerHTML = 'Pontos Seg Trabalho: '+segtrab;
    document.getElementById('logistica').innerHTML = 'Pontos Logística: '+logistica;
}

// Para exibir no informações os dados que estão no banco
function onSelection()
{
    var id = 1;
    query = "SELECT * FROM usuario where id=?;";
    try {
        localDB.transaction(function(transaction){
        
            transaction.executeSql(query, [id], function(transaction, results){
            
                var row = results.rows.item(0);
                
                updateInformations(row['id'], row['nome'], row['email'], row['adm'], row['segtrab'], row['logistica']);
                
            }, function(transaction, error){
                updateStatus("Erro: " + error.code + "<br>Mensagem: " + error.message);
            });
        });
    } 
    catch (e) {
        updateStatus("Error: SELECT não realizado " + e + ".");
    }   
}

// Zera os pontos de todos os jogos
function zerarPts()
{
    var confirmacao = confirm('Deseja excluir todos os pontos já feitos?');

    if(confirmacao)
    {
        var query = "update usuario set adm=0, segtrab=0, logistica=0, pergadm=1, pergsegtrab=1, perglogistica=1;";
        
        try 
        {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [], function(transaction, results){
                    
                    if (!results.rowsAffected)
                    {
                        updateStatus("Erro: os pontos não foram zerados!");
                    }
                    else 
                    {
                        updateStatus("Pontos zerados!");
                        onSelection();
                    }
                }, errorHandler);
            });
        } 
        catch (e) {
            updateStatus("Erro: UPDATE não realizado " + e + ".");
        }
    }
}

//Insere asquestões criadas na tela de configurações no banco de dados
function insertQuestionsInDB()
{ 
    
    var pergunta  = document.itemForm.pergunta.value;
    var resposta1 = document.itemForm.resposta1.value;
    var resposta2 = document.itemForm.resposta2.value;
    var resposta3 = document.itemForm.resposta3.value;
    var resposta4 = document.itemForm.resposta4.value;
    var curso     = document.itemForm.jogo.value;
    var correta   = document.itemForm.mySelect.value;
    
    if(pergunta == 'drop' || pergunta == 'Drop')
    {
        dropTables();
        createTables();
        updateStatus("As tabelas foram excluídas e recriadas!");
        document.itemForm.pergunta.value = "";
    }
    else if(pergunta == 'dropdb' || pergunta == 'Dropdb')
    {
      dropDatabase();
    }
    else
    {
        if(pergunta.length < 1)
            alert('Informe a pergunta!');   
        else
        if(resposta1.length < 1)
            alert('Informe a resposta 1!'); 
        else
            if(resposta2.length < 1)
                alert('Informe a resposta 2!'); 
        else
            if(resposta3.length < 1)
                alert('Informe a resposta 3!');
        else
            if(resposta4.length < 1)
                alert('Informe a resposta 4!');
        else
        {   
            if(curso == 'Administração')
            {
                var query = "insert into adm (pergunta, resposta1, resposta2, resposta3, resposta4, correta) VALUES (?, ?, ?, ?, ?, ?);";
            }
            else if(curso == 'Segurança do trabalho')
            {
                var query = "insert into segtrab (pergunta, resposta1, resposta2, resposta3, resposta4, correta) VALUES (?, ?, ?, ?, ?, ?);";
            }
            else if(curso =='Logística')
            {
                var query = "insert into logistica (pergunta, resposta1, resposta2, resposta3, resposta4, correta) VALUES (?, ?, ?, ?, ?, ?);";
            }

            
            try {
                localDB.transaction(function(transaction){
                    transaction.executeSql(query, [pergunta,resposta1,resposta2,resposta3,resposta4,correta], function(transaction, results)
                    {
                        if (!results.rowsAffected)
                        {
                            updateStatus("Erro: Inserção não realizada");
                        }
                        else
                        {
                            updateStatus("Inserção realizada, linha id: " + results.insertId);
                            alert('Cadastrado com sucesso!');

                            //Limpa o select de pergunta correta
                            limparSelect("mySelect");

                            //Limpa todos os campos da tela
                            document.itemForm.pergunta.value = "";
                            document.itemForm.resposta1.value = "";
                            document.itemForm.resposta2.value = "";
                            document.itemForm.resposta3.value = "";
                            document.itemForm.resposta4.value = "";

                            document.itemForm.selectedIndex = 0;

                        }
                    }, errorHandler);
                });
            } 
            catch (e)
            {
                updateStatus("Erro: INSERT não realizado " + e + ".");
            }
        }
    }    
}

//Encarregada de carregar as questões para a exclusão na tela de configurãções
function loadDelete()
{
  var curso = document.deleteForm.jogoExcluir.value;

  if(curso != "Clique aqui para selecionar")
  {
     limparSelect("perguntaExcluir", true);
      var query = 'select pergunta from '+curso; 
      
        try {
            localDB.transaction(function(transaction){
            
                transaction.executeSql(query, [], function(transaction, results){

                    // Carrega no select de questões para excluir as questões do curso (adm, segtrab, logist.)
                    for(i=0;i<results.rows.length;i++)
                    {
                        insertQuestionsSelect(results.rows.item(i).pergunta, "perguntaExcluir");
                    }
                    
                }, function(transaction, error){
                    updateStatus("Erro: " + error.code + "<br>Mensagem: " + error.message);
                });
            });
        } 
        catch (e)
        {
            updateStatus("Error: SELECT não realizado " + e + ".");
        }
    }
}

//Exclui a questão selecionada na tela de configurações
function deleteQuestion()
{

  var curso = document.deleteForm.jogoExcluir.value;
  var pergunta = document.deleteForm.perguntaExcluir.value;

    if(curso == "Toque aqui para selecionar")
    {
        alert('Selecione qual é o curso!');
    }
    else
    if(pergunta == "Toque aqui para selecionar")
    {
          alert('Selecione qual é a pergunta a ser excluída!');
    }
    else
    { 
    
        var query = "delete from "+curso+" where pergunta=?;";
        try {
            localDB.transaction(function(transaction){
            
                transaction.executeSql(query, [pergunta], function(transaction, results){
                    if (!results.rowsAffected) {
                        updateStatus("Erro: Delete não realizado.");
                    }
                    else {
                        alert('Questão excluída com sucesso!');
                        updateStatus("Qestão excluída com sucesso!");
                        limparSelect("perguntaExcluir");
                        document.deleteForm.jogoExcluir.selectedIndex = 0;
                    }
                }, errorHandler);
            });
        } 
        catch (e)
        {
            updateStatus("Erro: DELETE não realizado " + e + ".");
            alert('O campo do jogo ou o  da pergunta não foi selecionado!');
        }
    }
}

//Põe o nome da pessoa na tela de home
function nome()
{
    var query = 'select nome from usuario'; 
  
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], function(transaction, results){

        if(results.rows.length > 0)
        {
            document.getElementById('nome').innerHTML = results.rows.item(0).nome+", ";   
        }
        else
        {
            document.getElementById('nome').innerHTML = ", ";
        }
                
            }, function(transaction, error){
               updateStatus('Nome do usuário não encontrado no BD!');
            });
        });
}

//Para informar os pontos que estão no DB na view do jogo
function jogoPontos() 
{
    
    var query = 'select '+materia+' from usuario where id = 1';  
    
    localDB.transaction(function(transaction){
        transaction.executeSql(query, [], function(transaction, results){
          if(results.rows.length > 0)
          {
              switch(materia)
              {
                  case 'adm':
                      document.getElementById('pontos').innerHTML = results.rows.item(0).adm+" Pontos";   
                      break;
                  case 'segtrab':
                      document.getElementById('pontos').innerHTML = results.rows.item(0).segtrab+" Pontos";   
                       break;
                  case 'logistica': 
                      document.getElementById('pontos').innerHTML = results.rows.item(0).logistica+" Pontos";   
                      break;   
              }
          }
          else
          {
              document.getElementById('pontos').innerHTML = "0 Pontos";
          } 
        }, function(transaction, error){
           updateStatus('Pontuação do usuário não encontrada!');
        });
    });
}

//Retorna a última pergunta acessada pelo usuário gravada no banco
function uAcessadauCadastrada()
{

   switch(materia)
        {
          case 'adm':
            var query1 = 'select pergadm from usuario where id = 1';  
            var query2 = 'select id from adm order by id desc limit 1';
            break;
          case 'segtrab':
             var query1 = 'select pergsegtrab from usuario where id = 1';  
             var query2 = 'select id from segtrab order by id desc limit 1';
            break;
          case 'logistica':
             var query1 = 'select perglogistica from usuario where id = 1';
             var query2 = 'select id from logistica order by id desc limit 1';  
            break;   
        } 

        localDB.transaction(function(transaction){

            transaction.executeSql(query1, [], function(transaction, results)
            {
               var len = results.rows.length;
               
               // Caso encontre algum registro
                if(len == 1)
                {
                     switch(materia)
                    {
                      case 'adm':
                        var valor = results.rows.item(0).pergadm;
                         //Infelizmente a linha abaixo é uma gambiarra que precisei fazer para receber dados assíncronos
                         // do sqlite por não ter conseguido ajuda com as requisições assíncronas a tempo. 
                        var pausa = setInterval(function(){uacc = valor; clearInterval(pausa); }, 200);
                    
                        break;
                      case 'segtrab':
                         var valor = results.rows.item(0).pergsegtrab;  
                         //Infelizmente a linha abaixo é uma gambiarra que precisei fazer para receber dados assíncronos
                         // do sqlite por não ter conseguido ajuda com as requisições assíncronas a tempo. 
                         var pausa = setInterval(function(){uacc = valor; clearInterval(pausa); }, 200);

                        break;
                      case 'logistica':
                         var valor = results.rows.item(0).perglogistica; 
                          //Infelizmente a linha abaixo é uma gambiarra que precisei fazer para receber dados assíncronos
                         // do sqlite por não ter conseguido ajuda com as requisições assíncronas a tempo. 
                         var pausa = setInterval(function(){uacc = valor; clearInterval(pausa); }, 200);

                        break;   
                    } 
                }
                 
            }, function(transaction, error){
                 updateStatus("Erro: " + error.code + "<br>Mensagem: " + error.message);
            
            });

        //Transação para a última acessada
        transaction.executeSql(query2, [], function(transaction, results)
            {
               var len = results.rows.length;
               
               // Caso encontre algum registro
                if(len == 1)
                {
                     switch(materia)
                    {
                      case 'adm':
                        var vl = results.rows.item(0).id;
                         //Infelizmente a linha abaixo é uma gambiarra que precisei fazer para receber dados assíncronos
                         // do sqlite por não ter conseguido ajuda com as requisições assíncronas a tempo. 
                        var pausa = setInterval(function(){ucad = vl;  clearInterval(pausa); }, 200);
                    
                        break;
                      case 'segtrab':
                         var vl = results.rows.item(0).id;  
                         //Infelizmente a linha abaixo é uma gambiarra que precisei fazer para receber dados assíncronos
                         // do sqlite por não ter conseguido ajuda com as requisições assíncronas a tempo. 
                         var pausa = setInterval(function(){ucad = vl; clearInterval(pausa); }, 200);

                        break;
                      case 'logistica':
                         var vl = results.rows.item(0).id; 
                          //Infelizmente a linha abaixo é uma gambiarra que precisei fazer para receber dados assíncronos
                         // do sqlite por não ter conseguido ajuda com as requisições assíncronas a tempo. 
                         var pausa = setInterval(function(){ucad = vl; clearInterval(pausa); }, 200);

                        break;   
                    } 
                }

                 
            }, function(transaction, error){
                 updateStatus("Erro: " + error.code + "<br>Mensagem: " + error.message);
            });
        });
}

//para controlar a pontuação do jogo
function pontos(flag)
{
    if(flag)
    {
        var arrayPts = document.getElementById('pontos').innerHTML;//Pego na tela os pontos
        arrayPts = arrayPts.split(' ');//separo os números da paravra 'Pontos'
        var pontos = parseInt(arrayPts[0]);
        var pts = (pontos + 10) + ' Pontos';//Adiciono mais pontos
    }
    else
    {
        var arrayPts = document.getElementById('pontos').innerHTML;
        arrayPts = arrayPts.split(' ');
        var pontos = parseInt(arrayPts[0]);

        if(pontos < 12)
        {
           var pts = 0 + ' Pontos';
        }
        else
        {
          var  pts = (pontos - 12) + ' Pontos';
            
        }
        
    }
        var arrayPts = pts;
        arrayPts = arrayPts.split(' ');
        pontos = arrayPts[0];
   
        localDB.transaction(function(transaction){
           
         switch(materia)
              {
                  case 'adm':
                      var query = 'update usuario set adm = ? where id = 1';
                      break;
                  case 'segtrab':
                      var query = 'update usuario set segtrab = ? where id = 1';   
                      break;
                  case 'logistica': 
                      var query = 'update usuario set logistica = ? where id = 1';      
                      break;   
              }

            transaction.executeSql(query, [pontos], nullDataHandler, errorHandler); 
            document.getElementById('pontos').innerHTML = pts;//Exibo na tela
            
        });
}

//Busca a pergunta no banco, usa a seguinte regra:
//checa no cadastro do usuário qual foi a última questão respondida e retorna
//a próxima questão. Sempre quando a questão for corrigida é gravado no banco a id daquela questão
function carregaPerg()
{
    if(uacc <= ucad)
    {
      switch(materia)
      {
        case 'adm':
            var query = 'select * from adm where id = '+uacc;  
            break;
        case 'segtrab':
            var query = 'select * from segtrab where id = '+uacc;  
            break;
        case 'logistica':
            var query = 'select * from logistica where id = '+uacc;
            break;   
      } 

      localDB.transaction(function(transaction){

          transaction.executeSql(query, [], function(transaction, results)
          {
              var p = results.rows.item(0).pergunta;
              var r1 = results.rows.item(0).resposta1;
              var r2 = results.rows.item(0).resposta2;
              var r3 = results.rows.item(0).resposta3;
              var r4 = results.rows.item(0).resposta4;
              var c = results.rows.item(0).correta;

              //Infelizmente a linha abaixo é uma gambiarra que precisei fazer para receber dados assíncronos
              // do sqlite por não ter conseguido ajuda com as requisições assíncronas a tempo. 
              var pausa = setInterval(function(){
                 document.getElementById('pergunta').innerHTML = p; 
                 limparSelect('respostas');

                 insertQuestionsSelect(r1,'respostas');
                 insertQuestionsSelect(r2,'respostas');
                 insertQuestionsSelect(r3,'respostas');
                 insertQuestionsSelect(r4,'respostas');
                 correta = c;
                  
                  clearInterval(pausa); 
                      }, 700);   

          }, function(transaction, error){
               updateStatus("Erro: " + error.code + "<br>Mensagem: " + error.message);
          
         });
      });  
                          
    }else if(uacc > ucad && ucad != 0)
    {
        alert('O jogo terminou! Aproveite para jogar as outras modalidades ou pessa para alguém cadastrar mais perguntas (: .');
        chamatela('informacoes.html');
    }

    if (ucad == 0)
      alert('Provavelmente houve um erro na instalação do aplicativo. Tente reinstalá-lo para corrigir o problema ou saia e volte ao aplicativo.');
}

//Corrige se a resposta informada está correta
function corrigir()
{
    var resposta = document.principal.respostas.value;

    if(resposta == 'Toque aqui para selecionar')
        alert('Selecione uma resposta!');
    else
      if(resposta == correta)
      {
         pontos(1);
         efeitosAcertou();
      }else
      {
         pontos(0);
         efeitosErrou();  
      }

    limparSelect('respostas');
    document.getElementById('pergunta').innerHTML = "";

    if(uacc > ucad)
    {
        alert('O jogo terminou! Aproveite para jogar as outras modalidades ou pessa para alguém cadastrar mais perguntas (: .');
        chamatela('informacoes.html');
    }else
      
    atualizaUltAcessada();
    carregaPerg();
}

//Grava no banco a última questão acessada
function atualizaUltAcessada()
{
   if(uacc == 0)
    uacc = uacc + 2;
   else
    uacc = uacc +1;

    var pausa = setInterval(function(){
               
      localDB.transaction(function(transaction){
        switch(materia)
        {
          case 'adm':
            transaction.executeSql('update usuario set pergadm = ?', [uacc], nullDataHandler, errorHandler);
            break;
          case 'segtrab':
            transaction.executeSql('update usuario set pergsegtrab = ? ', [uacc], nullDataHandler, errorHandler);  
            break;
          case 'logistica':
             transaction.executeSql('update usuario set perglogistica = ? ', [uacc], nullDataHandler, errorHandler);
            break;   
        }
      });
    clearInterval(pausa); 
    }, 800);      
}