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
