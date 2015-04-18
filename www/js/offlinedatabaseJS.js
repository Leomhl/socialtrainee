//1. Inicialização

// Variáveis globais
  var localDB = null; //Para a conexão com o banco de dados

//Para manter setado qual jogo o usuário está
  var materia = null; //adm, segTrab ou logistica


  //Dados da questão
  var pergunta = null;
  var resposta1 = null;
  var resposta2 = null;
  var resposta3 = null;
  var resposta4 = null;
  var correta = null; 


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

function initDB(){

    var shortName = 'stuffDB';
    var version = '1.0';
    var displayName = 'MyStuffDB';
    var maxSize = 65536; // Em bytes (64)
    localDB = window.openDatabase(shortName, version, displayName, maxSize);
}

function createTables(){

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
            updateStatus("Conexão com o BD: OK!");
        });
    } 
    catch (e) {
        updateStatus("Erro: Tabelas não criadas " + e + ".");
        return;
    }
}


function dropTables(){

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
            // updateStatus("Usuário 'dropado' com sucesso!");
            alert("Tabelas 'dropadas' com sucesso!");

        });
    } 
    catch (e) {
        // updateStatus("Erro: drop não feito " + e + ".");
        alert("Erro: drop não feito " + e + ".");
        return;
    }
}

function dropDatabase(){
    dropTables();
    var query = 'drop database stuffDB';
    try {
        localDB.transaction(function(transaction){

            transaction.executeSql(query, [], nullDataHandler, errorHandler);
            alert("Banco 'dropadas' com sucesso!");

        });
    } 
    catch (e) {
        // updateStatus("Erro: drop não feito " + e + ".");
        alert("Erro: drop no banco não feito " + e + ".");
        return;
    }

    initDB();
}

//2. Query e visualização de Update


// function onUpdate(){
//     var id = document.itemForm.id.value;
//     var nome = document.itemForm.nome.value;
//     var email = document.itemForm.email.value;
//     if (nome == "" || email == "") {
//         updateStatus("'Nome' e 'Email' são campos obrigatórios!");
//     }
//     else {
//         var query = "update usuario set nome=?, email=? where id=?;";
//         try {
//             localDB.transaction(function(transaction){
//                 transaction.executeSql(query, [nome, email, id], function(transaction, results){
//                     if (!results.rowsAffected) {
//                         updateStatus("Erro: Update não realizado.");
//                     }
//                     else {
//                         updateForm("", "", "");
//                         updateStatus("Update realizado:" + results.rowsAffected);
//                         // queryAndUpdateOverview();
//                     }
//                 }, errorHandler);
//             });
//         } 
//         catch (e) {
//             updateStatus("Erro: UPDATE não realizado " + e + ".");
//         }
//     }
// }


function onCreate(){
    var nome = document.itemForm.nome.value;
    var email = document.itemForm.email.value;


    if (nome == "" || email == "") {
        updateStatus("Erro: 'Nome' e 'Email' são campos obrigatórios!");
    }
    else {
            var query = "INSERT INTO usuario(id, nome, email, adm, segtrab, logistica, pergadm, pergsegtrab, perglogistica) VALUES(1, ?, ?, 0,0,0,0,0,0)";
        
            localDB.transaction(function(transaction){
              transaction.executeSql(query, [nome,email], nullDataHandler, errorHandler);
            });      
              updateStatus("Inserção realizada");
              alert('Cadastrado com sucesso!');
              chamatela('home.html');
          }                  
}

function onSelect(htmlLIElement){
    var id = htmlLIElement.getAttribute("id");
    query = "SELECT * FROM usuario where id=?;";
    try {
        localDB.transaction(function(transaction){
        
            transaction.executeSql(query, [id], function(transaction, results){
            
                var row = results.rows.item(0);
                
                updateForm(row['id'], row['nome'], row['email']);
                
            }, function(transaction, error){
                updateStatus("Erro: " + error.code + "<br>Mensagem: " + error.message);
            });
        });
    } 
    catch (e) {
        updateStatus("Error: SELECT não realizado " + e + ".");
    }
   
}


function popularTabelas()
{

var administracao = 
[
  {
    //Pergunta 1
    'p':   'Existem alguns tipos de cheque, escolha qual não é um.',
    'r1': 'Cheque ao portador',
    'r2': 'Cheque tracejado',
    'r3': 'Cheque cruzado',
    'r4':'Cheque visado',
    'c':  'Cheque tracejado'
  },
  {
    //Pergunta 2
    'p':   'O endosso permite?',
    'r1': 'Transferir a posse do documento',
    'r2': 'Proibir a transferência do documento',
    'r3': 'Permite o descarte do documento',
    'r4': 'Nenhuma das anteriores',
    'c':  'Transferir a posse do documento'
  },
  {  
    //Pergunta 3
    'p':   'Complete: O cheque nominal não à ordem?',
    'r1': 'Não pode haver ordem de pagamento',
    'r2': 'Não se transmite por endosso',
    'r3': 'Não é transmissível sem endosso',
    'r4': 'É transmissível parcialmente',
    'c':  'Não se transmite por endosso'
  },  
  { 
    //Pergunta 4
    'p':   'Sobre o cheque cruzado',
    'r1': 'Contém informações cruzadas de usuários',
    'r2': 'Pode ser sacado apenas em conta',
    'r3': 'Pode ser sacado livremente',
    'r4': 'Nenhuma das anteriores',
    'c':  'Pode ser sacado apenas em conta'
  },
  { 
    //Pergunta 5
    'p':   'O cheque visado é?',
    'r1': 'Aquele que poucos têm acesso',
    'r2': 'Aquele que o banco paga apenas em caixa',
    'r3': 'Aquele que o banco emite um visto',
    'r4': 'Aquele que o banco paga sem testar autenticidade',
    'c':  'Aquele que o banco emite um visto'
  }, 
  {
    //Pergunta 6
    'p':   'O cheque ao portador tem "problema" de segurança, qual é esse problema?',
    'r1': 'Não precisar de autenticação do banco',
    'r2': 'Não ser assinado pelo emitente ',
    'r3': 'Não ter o nome de quem o recebe',
    'r4': 'Não poder ser rastreado',
    'c':  'Não ter o nome de quem o recebe'
  },
  {
    //Pergunta 7
    'p':   'Sobre a hora extra, marque a alternativa correta.',
    'r1': 'É um adicional pago após 44h extras trabalhadas',
    'r2': 'É pago por semestre',
    'r3': 'De seg à sab cada hora vale 55% a mais e domingo 50%',
    'r4': 'De seg à sab cada hora vale 50% a mais e domingo 100%',
    'c':  'De seg à sab cada hora vale 50% a mais e domingo 100%'
  },
  { 
    //Pergunta 8
    'p':   'O limite de hora extra por dia é de:',
    'r1': '2h',
    'r2': '4h',
    'r3': '1h',
    'r4': 'Nenhuma das anteriores',
    'c':  '2h'
  },
  {  
    //Pergunta 9
    'p':   'A hora extra só é aceita legalmente quando?',
    'r1': 'A pessoa tem contrato por tempo definido',
    'r2': 'A pessoa tem carteira temporária',
    'r3': 'A pessoa tem carteira assinada',
    'r4': 'A pessoa não tem vínculo empregatício',
    'c':  'A pessoa tem carteira assinada'
  },
  {
    //Pergunta 10
    'p':   'Existem quantos tipos de cheque?',
    'r1': '7',
    'r2': '5',
    'r3': '8',
    'r4': '6',
    'c':  '6'
  },
  {  
    //Pergunta 11
    'p':   'O cálculo de hora extra redonda é o mesmo das horas extras quebradas!',
    'r1': 'Está correto',
    'r2': 'Está incorreto',
    'r3': 'Está parcialmente correto',
    'r4': 'Nenhuma das anteriores',
    'c':  'Está incorreto'
  },
  {  
    //Pergunta 12
    'p':   'Sobre a ética, é fundamental que:',
    'r1': 'As informações devem ser espalhadas',
    'r2': 'As informações devem ser mantidas por algum tempo',
    'r3': 'As informações confidenciais devem ser propagadas para toda a empresa',
    'r4': 'As informações devem ser guardadas por tempo indeterminado',
    'c':  'As informações devem ser guardadas por tempo indeterminado'
  },
  {  
    //Pergunta 13
    'p':   'A administração é uma área:',
    'r1': 'Área peculiar',
    'r2': 'Área gerencial menos importante',
    'r3': 'Área de grande importância nas empresas',
    'r4': 'Área de igual importância aos demais setores',
    'c':  'Área de igual importância aos demais setores'
  },
  {  
    //Pergunta 14
    'p':   'Dados de funcionários como telefone, devem ser divulgados quando?',
    'r1': 'Requisitado por alguém',
    'r2': 'Autorizado pelo funcionário e gerentes',
    'r3': 'Autorizado pelo gerente',
    'r4': 'Nenhuma das anteriores',
    'c':  'Autorizado pelo funcionário e gerentes'
  },
  {  
    //Pergunta 15
    'p':   'Projetos da empresa devem ter sigilo desde que:',
    'r1': 'Seja exigido o mesmo',
    'r2': 'Éticamente o ideal é que nunca sejam contados',
    'r3': 'Haja um contrato de sigilo formalizado',
    'r4': 'Quando a empresa não se preocupa com sigilo',
    'c':  'Haja um contrato de sigilo formalizado'
  },
  {
    //Pergunta 16
    'p':   'O endosso dos cheques auxiliam na segurança da transação financeira. A afirmativa está:',
    'r1': 'Correta',
    'r2': 'Incorreta',
    'r3': 'Parcialmente Correta',
    'r4': 'Nenhuma das anteriores',
    'c':  'Parcialmente Correta'
  },
  {
    //Pergunta 17
    'p':   'A ética é:',
    'r1': 'Uma coisa dispensável',
    'r2': 'Chave para o profissional de qualquer ramo',
    'r3': 'Parte de uma empresa',
    'r4': 'De uma pessoa contratada',
    'c':  'Chave para o profissional de qualquer ramo'
  },
  {  
    //Pergunta 18
    'p':   'Os canais de distribuição de uma empresa são:',
    'r1': 'Modos de distribuição da renda das empresas',
    'r2': 'Modos que as empresas recebem mercadorias',
    'r3': 'Modos que as empresas gerenciam internamente mercadorias',
    'r4': 'Modos que as empresas escoam sua produção',
    'c':  'Modos que as empresas escoam sua produção'
  },
  {  
    //Pergunta 19
    'p':  'Para uma empresa de software, qual canal de distribuiçao abaixo é o correto?',
    'r1': 'Caminhão',
    'r2': 'Avião',
    'r3': 'Cloud',
    'r4': 'Carro',
    'c':  'Cloud'
  },
  {
    //Pergunta 20
    'p':  'Quais devem ser os tipos de arquivo?',
    'r1': 'Ativo, parcial, inativo',
    'r2': 'Ativo, ativo parcial, inativo',
    'r3': 'Ativo, inativo, morto',
    'r4': 'Ativo inicial, ativo parcial, inativo',
    'c':  'Ativo, inativo, morto'
  },
  {  
    //Pergunta 21
    'p':  'Quantos são os tipos de suporte?',
    '1r1':'5',
    'r2': '6',
    'r3': '7',
    'r4': '8',
    'c':  '7'
  },
  {  
    //Pergunta 22
    'p':  'Qual o nome da tabela que controla o tempo que os documentos devem ser guardados?',
    'r1': 'Tabela documental',
    'r2': 'Tabela de temporalidade',
    'r3': 'Tabela administrativa',
    'r4': 'Tabela insertiva',
    'c':  'Tabela de temporalidade'    
  },
  {  
    //Pergunta 23
    'p':  'O suporte textual, proporciona o armazenamento de mensagens de texto vindas de qualquer área , seja digital, cartográfica e etc.',
    'r1': 'Correto',
    'r2': 'Incorreto',
    'r3': 'Parcialmente correto',
    'r4': 'Nenhuma das anteriores',
    'c':  'Incorreto'    
  },
  {  
    //Pergunta 24
    'p':  'Caso o documento tenha sido armazenado em um suporte informático, deve haver uma checagem de dados de quanto em quanto tempo?',
    'r1': '1 ano',
    'r2': '8 meses',
    'r3': '8 anos',
    'r4': '20 anos',
    'c':  '8 anos'    
  },
  {  
    //Pergunta 25
    'p':  'Microfilmático pigmentado é um tipo de suporte?',
    'r1': 'Sim',
    'r2': 'Não',
    'r3': 'Apenas para vídeos',
    'r4': 'Apeas para fotos',
    'c':  'Não'    
  },
  {  
    //Pergunta 26
    'p':  'O contrato por tempo determinado tem duração máxima de 1 ano?',
    'r1': 'Não, sua duração varia',
    'r2': 'Sim',
    'r3': 'Não, deve durar apenas 90 dias',
    'r4': 'Nenhuma das anteriores',
    'c':  'Não, sua duração varia'    
  },
  {  
    //Pergunta 27
    'p':  'O contrato de experiência não pode ultrapassar 90 dias! Esta afirmação está?',
    'r1': 'Expressamente incorreta',
    'r2': 'Parcialmente correta',
    'r3': 'Correta',
    'r4': 'Nenhuma das anteriores',
    'c':  'Correta'    
  },
  {  
    //Pergunta 28
    'p':  'O empregador não precisa pela lei declara na carteira de alguém que está em período de experiência! A afirmativa está?',
    'r1': 'Incorreta pois a lei não cuida de período experimental',
    'r2': 'Correta pois só assina-se a carteira quando há contratação',
    'r3': 'Incorreta pois o empregador não precisa assinar a carteira nunca',
    'r4': 'Incorreta pois é necessário registrar o período de experiência na carteira de trabalho',
    'c':  'Incorreta pois é necessário registrar o período de experiência na carteira de trabalho'    
  },
  {  
    //Pergunta 29
    'p':  'A carga horária integral de um trabalhador pela lei deve ser de?',
    'r1': '44 horas mensais',
    'r2': '4 horas diárias',
    'r3': '44 horas semanais',
    'r4': '7 horas diárias',
    'c':  '44 horas semanais'    
  },
  {  
    //Pergunta 30
    'p':  'A carga horária parcial de um trabalhador pela lei deve ser de?',
    'r1': '44 horas mensais',
    'r2': '20 horas mensais até 44 horas mensais',
    'r3': '20 horas semanais até 25 horas semanais',
    'r4': '25 horas semanais até 44 horas semanais',
    'c':  '20 horas semanais até 25 horas semanais'    
  }
];


var segurancaTrabalho = 
[
  {
    //Pergunta 1
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
  {
    //Pergunta 2
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
  {
    //Pergunta 3
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 4
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
  {
    //Pergunta 5 
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 6
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 7
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 8
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 9
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 10
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 11
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 12
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 13
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 14
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 15
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 16
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 17
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 18
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 19
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 20
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  }
];  

var logistica = 
[
  {
    //Pergunta 1
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
  {
    //Pergunta 2
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
  {
    //Pergunta 3
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 4
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
  {
    //Pergunta 5 
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 6
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 7
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 8
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 9
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 10
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 11
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 12
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 13
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 14
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 15
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 16
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 17
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 18
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 19
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  },
   {
    //Pergunta 20
    'p':   '',
    'r1': '',
    'r2': '',
    'r3': '',
    'r4': '',
    'c':  ''
  }
];  
      
 
    try {
        localDB.transaction(function(transaction){
           
          for(i=0; i<=29;i++)
          {  
            var queryAdm= "INSERT INTO adm(pergunta, resposta1,resposta2,resposta3,resposta4,correta) VALUES("+"'"+administracao[i].p+"','"+ administracao[i].r1+"','"+ administracao[i].r2+"','"+administracao[i].r3+"','"+administracao[i].r4+"','"+administracao[i].c+"')";
            transaction.executeSql(queryAdm, [], nullDataHandler, errorHandler); 
            
             // var querysegtb= "INSERT INTO segtrab(pergunta, resposta1,resposta2,resposta3,resposta4,correta) VALUES("+"'"+segurancaTrabalho[i].p+"','"+ segurancaTrabalho[i].r1+"','"+ segurancaTrabalho[i].r2+"','"+segurancaTrabalho[i].r3+"','"+segurancaTrabalho[i].r4+"','"+segurancaTrabalho[i].c+"')";
             
             // transaction.executeSql(querysegtb, [], nullDataHandler, errorHandler); 
            
             // var querylog= "INSERT INTO logistica(pergunta, resposta1,resposta2,resposta3,resposta4,correta) VALUES("+"'"+logistica[i].p+"','"+ logistica[i].r1+"','"+ logistica[i].r2+"','"+logistica[i].r3+"','"+logistica[i].r4+"','"+logistica[i].c+"')";
             // transaction.executeSql(querylog, [], nullDataHandler, errorHandler); 
            
            
          }
updateStatus("Cadastrado com sucesso!");
        });
    } 
    catch (e) {
        updateStatus("Erro: Tabelas não criadas " + e + ".");
        return;
    }

}
// function queryAndUpdateOverview(){

//     //Remove as linhas existentes para inserção das novas
//     var dataRows = document.getElementById("itemData").getElementsByClassName("data");
    
//     while (dataRows.length > 0) {
//         row = dataRows[0];
//         document.getElementById("itemData").removeChild(row);
//     };
    
//     //Realiza a leitura no banco e cria novas linhas na tabela.
//     var query = "SELECT * FROM usuario;";
//     try {
//         localDB.transaction(function(transaction){
        
//             transaction.executeSql(query, [], function(transaction, results){
//                 for (var i = 0; i < results.rows.length; i++) {
                
//                     var row = results.rows.item(i);
//                     var li = document.createElement("li");
//                     li.setAttribute("id", row['id']);
//                     li.setAttribute("class", "data");
//                     li.setAttribute("onclick", "onSelect(this)");
                    
//                     var liText = document.createTextNode(row['nome'] + " x "+ row['email']+ " x " + row['id']);
//                     li.appendChild(liText);
                    
//                     document.getElementById("itemData").appendChild(li);
//                 }
//             }, function(transaction, error){
//                 updateStatus("Erro: " + error.code + "<br>Mensagem: " + error.message);
//             });
//         });
//     } 
//     catch (e) {
//         updateStatus("Error: SELECT não realizado " + e + ".");
//     }
// }

// 3. Funções de tratamento e status.

// Tratando erros

errorHandler = function(transaction, error){
    updateStatus("Erro: " + error.message);
    return true;
}

nullDataHandler = function(transaction, results){
}

// Funções de update

function updateForm(id, nome, email){
    document.itemForm.id.value = id;
    document.itemForm.nome.value = nome;
    document.itemForm.email.value = email;
}

function updateStatus(status){
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

function startIndex()
{
    onInit();
    onTest();
}

function startInformacoes()
{
    onInit();
    onSelection();
}

function startHome()
{
    onInit();
    nome();
}

function startAdmJogo()
{
    materia = 'adm';
    onInit();
    jogoPontos(); // carrega a pontuação na tela do jogo
    uAcessada(); //retorna a última pergunta acessada
    //exibePerg(); //Insere no select as respostas
    
    
}


//Exibe na view de informações os dados do banco
function updateInformations(id, nome, email, adm, segtrab, logistica){
    document.getElementById('nome').innerHTML = '<hr>Nome: <br>'+nome;
    document.getElementById('email').innerHTML = '<hr>Email: <br>'+email;
    document.getElementById('adm').innerHTML = '<hr>Pontos Administração: '+adm;
    document.getElementById('segtrab').innerHTML = 'Pontos Seg Trabalho: '+segtrab;
    document.getElementById('logistica').innerHTML = 'Pontos Logística: '+logistica;
}

// Para exibir no informações os dados que estão no banco
function onSelection(){
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

        var query = "update usuario set adm=0, segtrab=0, logistica=0;";
        
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

function insertQuestionsInDB()
{ 
    
    var pergunta  = document.itemForm.pergunta.value;
    var resposta1 = document.itemForm.resposta1.value;
    var resposta2 = document.itemForm.resposta2.value;
    var resposta3 = document.itemForm.resposta3.value;
    var resposta4 = document.itemForm.resposta4.value;
    var curso     = document.itemForm.value;//erro aqui
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

function loadDelete()
{
  var curso = document.deleteForm.jogoExcluir.value;

  if(curso != "Clique aqui para selecionar")
  {
     limparSelect("perguntaExcluir");
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
        catch (e) {
            updateStatus("Error: SELECT não realizado " + e + ".");
        }
    }
}

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
        catch (e) {
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


function jogoPontos() //Para informar os pontos que estão no DB na view do jogo
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
                  case 'segTrab':
                      document.getElementById('pontos').innerHTML = results.rows.item(0).segTrab+" Pontos";   
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


function uAcessada()//Retorna a última pergunta acessada
{

   switch(materia)
          {
            case 'adm':
              var query = 'select * from usuario where id = 1';  
              break;
            case 'segtrab':
               var query = 'select * from usuario where id = 1';  
              break;
            case 'logistica':
               var query = 'select * from usuario where id = 1';  
              break;   
          }
    


   

    localDB.transaction(queryDB); 
    localDB.executeSql('SELECT * FROM DEMO', [], querySuccess);
    alert(querysucess);

   //      {
   //         if(materia == 'adm')
   //            return results.rows.item(0).pergadm; 
   //          if(materia == 'segtrab')
   //              return results.rows.item(0).pergsegtrab;  
   //          if(materia == 'logistica')
   //              return results.rows.item(0).perglogistica;    
   //      });        
   


}

