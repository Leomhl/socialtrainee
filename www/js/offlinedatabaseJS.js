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
    try {
        localDB.transaction(function(transaction){

            transaction.executeSql(query, [], nullDataHandler, errorHandler);
            // updateStatus("Usuário 'dropado' com sucesso!");
            alert("Usuário 'dropado' com sucesso!");

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
                        queryAndUpdateOverview();
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
        dateStatus("O usuário cadastrado foi excluído!");
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