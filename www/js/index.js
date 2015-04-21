//################## Nativo ##################

// Vibra o aparelho
function vibrar()
{
	navigator.notification.vibrate(1000);
} 

// Sai do aplicativo
function sair()
{ 
  navigator.app.exitApp();

}

//################## Implementadas ##################

//Chama a tela de home logo após o splash screen da index (inseri junto ao js do BD)
function chamahome()
{	  
	setInterval(function(){window.open('home.html')}, 3000);  
  
}

// Chama qualquer tela
function chamatela(tela)
{	  
  window.open(tela);   
}

// Para a tela de configurações, adiciona as perguntas no select, id é o id do campo
function insertSelected()
{
	var x = document.getElementById("mySelect"); //retorna o objeto select
	var options = x.getElementsByTagName("option"); //pega a lista de options do select

	var pergunta  = document.itemForm.pergunta.value;
	var resposta1 = document.itemForm.resposta1.value;
	var resposta2 = document.itemForm.resposta2.value;
	var resposta3 = document.itemForm.resposta3.value;
	var resposta4 = document.itemForm.resposta4.value;
	
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
		if (x.selectedIndex >= 0)
		{

			x.remove(0);

			var y=document.createElement('option'); //cria um novo elemento option
			y.text = resposta1; //seta o texto do elemento option
			y.value=resposta1; //seta o valor do elemento option
			x.add(y,null); // adiciona um novo option no fim da lista para navegadores complacentes

			var w=document.createElement('option'); //cria um novo elemento option
			w.text = resposta2 //seta o texto do elemento option
			w.value = resposta2; //seta o valor do elemento option
			x.add(w,null); // adiciona um novo option no fim da lista para navegadores complacentes

			var k=document.createElement('option'); //cria um novo elemento option
			k.text = resposta3; //seta o texto do elemento option
			k.value=resposta3; //seta o valor do elemento option
			x.add(k,null); // adiciona um novo option no fim da lista para navegadores complacentes

			var z=document.createElement('option'); //cria um novo elemento option
			z.text = resposta4; //seta o texto do elemento option
			z.value=resposta4; //seta o valor do elemento option
			x.add(z,null); // adiciona um novo option no fim da lista para navegadores complacentes
		}
	}
}

// Insere no select as perguntas da disciplina para a exclusão
function insertQuestionsSelect(valor, idCampo)
{
	var x = document.getElementById(idCampo); //retorna o objeto select
	var options = x.getElementsByTagName("option"); //pega a lista de options do select

	var z=document.createElement('option'); //cria um novo elemento option
	z.text = valor; //seta o texto do elemento option
	z.value= valor; //seta o valor do elemento option
	x.add(z,null); // adiciona um novo option no fim da lista para navegadores complacentes
}

//Limpa o campo select e insere um valor inicial
 function limparSelect(idCampo){
    // vamos obter o elemento select
    var elem = document.getElementById(idCampo);    

    // vamos excluir todas as opções
    if(elem.options.length > 0)
	{
		elem.options.length = 0;
		 insertQuestionsSelect("Toque aqui para selecionar", idCampo);
	}
        
  }  

//Gera a animação agráfica para as imagens de erro e acerto da tela de jogo
function efeitosAcertou()
{

	var acertou = $("#imgAcerto");
	acertou.show();
	acertou.animate({"left": "25%"}, 1500);
	acertou.delay(500).animate({"left": "100%"}, 800, null, function(){$("#imgAcerto").css("display", "none")});

}


function efeitosErrou()
{
	var errou = $("#imgErro");
	errou.show();
	errou.animate({"left": "25%"}, 1500);
	// vibrar();
	errou.delay(500).animate({"left": "100%"}, 800, null, function(){$("#imgErro").css("display", "none");});
	
}


function sairJogo()//Para sair do jogo
{
	var confirmacao = confirm('Deseja sair do jogo?');

	if(confirmacao)
		chamatela('home.html');
	else
		exit;
}