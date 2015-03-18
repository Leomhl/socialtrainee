//1. Inicialização

var localDB = null;

function onInit(){
    try {
        if (!window.openDatabase) {
            updateStatus("Erro: Seu navegador não permite banco de dados.");
        }
        else {
            initDB();
            // dropTables();
            createTables();

            // queryAndUpdateOverview();

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
    var maxSize = 65536; // Em bytes
    localDB = window.openDatabase(shortName, version, displayName, maxSize);
}

function createTables(){

    var query = 'CREATE TABLE IF NOT EXISTS usuario(id INTEGER NOT NULL PRIMARY KEY, nome VARCHAR NOT NULL, email VARCHAR NOT NULL, adm INTEGER, segtrab INTEGER, logistica INTEGER);';
    var queryadm = 'CREATE TABLE IF NOT EXISTS adm(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, pergunta VARCHAR NOT NULL, resposta1 VARCHAR NOT NULL, resposta2 VARCHAR NOT NULL, resposta3 VARCHAR NOT NULL, resposta4 VARCHAR NOT NULL, correta VARCHAR NOT NULL);';
    var querysegtrab = 'CREATE TABLE IF NOT EXISTS segtrab(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, pergunta VARCHAR NOT NULL, resposta1 VARCHAR NOT NULL, resposta2 VARCHAR NOT NULL, resposta3 VARCHAR NOT NULL, resposta4 VARCHAR NOT NULL, correta VARCHAR NOT NULL);';
    var querylogistica = 'CREATE TABLE IF NOT EXISTS logistica(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, pergunta VARCHAR NOT NULL, resposta1 VARCHAR NOT NULL, resposta2 VARCHAR NOT NULL, resposta3 VARCHAR NOT NULL, resposta4 VARCHAR NOT NULL, correta VARCHAR NOT NULL);';
    
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
        updateStatus("Erro: Data base 'usuario' não criada " + e + ".");
        return;
    }
}


function dropTables(){

    var query = 'drop table usuario;';
    var queryadm = 'drop table adm;';
    var querysegtrab = 'drop table segtrab;';
    var querylogistica = 'drop table logistica;';
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

//2. Query e visualização de Update


function onUpdate(){
    var id = document.itemForm.id.value;
    var nome = document.itemForm.nome.value;
    var email = document.itemForm.email.value;
    if (nome == "" || email == "") {
        updateStatus("'Nome' e 'Email' são campos obrigatórios!");
    }
    else {
        var query = "update usuario set nome=?, email=? where id=?;";
        try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [nome, email, id], function(transaction, results){
                    if (!results.rowsAffected) {
                        updateStatus("Erro: Update não realizado.");
                    }
                    else {
                        updateForm("", "", "");
                        updateStatus("Update realizado:" + results.rowsAffected);
                        // queryAndUpdateOverview();
                    }
                }, errorHandler);
            });
        } 
        catch (e) {
            updateStatus("Erro: UPDATE não realizado " + e + ".");
        }
    }
}

function onDelete(){
    // var id = document.itemForm.id.value;
    var id=1;
    var query = "delete from usuario where id=?;";
    try {
        localDB.transaction(function(transaction){
        
            transaction.executeSql(query, [id], function(transaction, results){
                if (!results.rowsAffected) {
                    updateStatus("Erro: Delete não realizado.");
                }
                else {
                    updateForm("", "", "");
                    updateStatus("Linhas deletadas:" + results.rowsAffected);
                    queryAndUpdateOverview();
                }
            }, errorHandler);
        });
    } 
    catch (e) {
        updateStatus("Erro: DELETE não realizado " + e + ".");
    }
    
}

function onCreate(){
    var nome = document.itemForm.nome.value;
    var email = document.itemForm.email.value;

    if(nome == 'drop' || nome == 'Drop')
    {
        dropTables();
        createTables();
        updateStatus("As tabelas foram excluídas e recriadas!");
    }
    else
    {
        if (nome == "" || email == "") {
            updateStatus("Erro: 'Nome' e 'Email' são campos obrigatórios!");
        }
        else {
            var query = "insert into usuario (id, nome, email, adm, segtrab, logistica) VALUES (1, ?, ?, 0, 0, 0);";
            try {
                localDB.transaction(function(transaction){
                    transaction.executeSql(query, [nome, email], function(transaction, results){
                        if (!results.rowsAffected) {
                            updateStatus("Erro: Inserção não realizada");
                        }
                        else {
                            updateForm("", "", "");
                            updateStatus("Inserção realizada, linha id: " + results.insertId);
                            alert('Cadastrado com sucesso!');
                            chamatela('home.html');
                            queryAndUpdateOverview();

                        }
                    }, errorHandler);
                });
            } 
            catch (e) {
                updateStatus("Erro: INSERT não realizado " + e + ".");
            }
        }
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

function queryAndUpdateOverview(){

    //Remove as linhas existentes para inserção das novas
    var dataRows = document.getElementById("itemData").getElementsByClassName("data");
    
    while (dataRows.length > 0) {
        row = dataRows[0];
        document.getElementById("itemData").removeChild(row);
    };
    
    //Realiza a leitura no banco e cria novas linhas na tabela.
    var query = "SELECT * FROM usuario;";
    try {
        localDB.transaction(function(transaction){
        
            transaction.executeSql(query, [], function(transaction, results){
                for (var i = 0; i < results.rows.length; i++) {
                
                    var row = results.rows.item(i);
                    var li = document.createElement("li");
                    li.setAttribute("id", row['id']);
                    li.setAttribute("class", "data");
                    li.setAttribute("onclick", "onSelect(this)");
                    
                    var liText = document.createTextNode(row['nome'] + " x "+ row['email']+ " x " + row['id']);
                    li.appendChild(liText);
                    
                    document.getElementById("itemData").appendChild(li);
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




// Daqui para baixo foi personalizado para as necessidades do projeto


// ### Testa se o registro do usuário existe, se exitir chama a home ###
function onTest(){
    // var id = htmlLIElement.getAttribute("id");
    // var id= 1;
    query = "SELECT * FROM usuario where id=1;";
    
    try {
        localDB.transaction(function(transaction){
        
            transaction.executeSql(query, [], function(transaction, results){
                var len = results.rows.length;
                // var row = results.rows.item(0);
                // updateForm(row['id'], row['nome'], row['email']);
               
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
     // dropTables();
    onTest();
}

function startInformacoes()
{
    onInit();
     // dropTables();
    onSelection();
}

function startHome()
{
    onInit();
    nome();
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
    var curso     = document.itemForm.jogo.value;
    var correta   = document.itemForm.mySelect.value;
    
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

                        document.itemForm.jogo.selectedIndex = 0;

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
      
        try {
            localDB.transaction(function(transaction){
            
                transaction.executeSql(query, [], function(transaction, results){


                    // Carrega no select de questões para excluir as questões do curso (adm, segtrab, logist.)
                   // alert(results.rows.item(0).nome);
                     
                  document.getElementById('nome').innerHTML = results.rows.item(0).nome+",";

                    
                }, function(transaction, error){
                   document.home.nome.value = ",";
                });
            });
        } 
        catch (e) {
            document.home.nome.value = ",";
        }
    

}
