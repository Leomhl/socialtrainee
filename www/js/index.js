 function vibrar()
 {
	navigator.notification.vibrate(1000);
  }
  
 
  function sair()
  { 
    navigator.app.exitApp();

  }
  
  
  function chamahome()
  {	  
 	  setInterval(function(){window.open('home.html')}, 3000);  
	  
  }

  function splash()
  {

    navigator.splashscreen.show();
  }
  
  
    function chamatela(tela)
    {	  
 		window.open(tela);  
	  
  }
  