
var arregloElementos =[];
var crono ='';

  $( function() {      
      
    // Animar el título
    tituloOn( $('h1') );
      
      
    // Iniciar el juego
    $('button').on('click', function() {
        reiniciarJuego();
        $('button').text('Restart');        
    });    
  });
    
    
  // Animar el título
  function tituloOn(elemento) {
      $(elemento).animate(
        {
          color: '#DCFF0E'
        }, 500, function() { 
            tituloOff(elemento);
      });
   }

  function tituloOff(elemento) {
    $(elemento).animate(
      {
        color: '#FFFE'
      }, 500, function() {
        tituloOn(elemento);
      });
    }
    
  //Reiniciar la partida
  function reiniciarJuego() {

    $('.elemento').remove();
    $('#score-text').text('0');
    $('#movimientos-text').text('0');
    $('.panel-tablero').css('width','70%');
    $('.panel-score').css('width','27%');
    $('.panel-tablero').show();
    $('.time').show();
    $('.titulo-over').remove();

    // Llenar el tablero / eliminar repetidas 
    llenarTablero();
   
    while ( combinaciones() ) {
      borrarElementos('sinAnimacion');
      llenarTablero('sinAnimacion');
    }
    
    // verificar el tablero 
    setInterval(function() {
        if(combinaciones('on'))
           borrarElementos();
    },1500);  
  }
    
  // Crear elementos 
  function llenarTablero(sinAnimacion) {
    for ( var j = 1; j < 8; j++ ) {
      var faltantes = $('.col-'+ j +' .elemento').length;
      faltantes = 7 - faltantes;
                            
      for ( var i = 0; i < faltantes; i++ ) {
        var elemento = $( elementoAzar() )
        .draggable({
          containment: '.panel-tablero',
          stack: '.elemento',
          revert: 'invalid',
        })
        .droppable({
          drop: function(event, ui) {              
            // Intercambiar figuras
            var src = $(ui.draggable).attr('src');
            $(ui.draggable).attr('src', $(this).attr('src'));
            $(this).attr('src',src) ;

            // Animar
            $(ui.draggable).animate({
              top: '0px', left: '0px'
            }, 400);
                    
            crono = setInterval(buscarfichas(), 2000);    

            //Cambiar el numero de movimientos        
            $('#movimientos-text').text( parseInt( $("#movimientos-text").text() ) + 1 );
          }
        })

        // Agregarlo a la columna correspondiente
        .appendTo($('.col-' + j ) );

        // Agregar efecto de caida 
        if ( sinAnimacion != 'sinAnimacion' ) {
          $(elemento).css('top', "-600px").animate({top: "0px"}, 800);
        }
      }
    }
  }
     
  // Crea figuras del juego 
  function elementoAzar() {
    var n = Math.floor(Math.random()*4+1);
    var elemento = "<img src='image/" + n + ".png' class= 'elemento'>";
    return elemento;
  }
    
  // Sumar puntuación 
  function combinaciones(juego) {
    var elementoCumple = [];
    var col = $('.panel-tablero div');    
    
    // Verificar combinaciones 
    revisarVertical(col,elementoCumple);        
    revisarHorizontal(col,elementoCumple);
      
    // Puntuación
    if ( juego == 'on') {
      $("#score-text").text( parseInt( $("#score-text").text() ) + elementoCumple.length * 100);   
    }
      
    // Eliminar elementos
    $(elementoCumple).each(function(i,item) {
      $(item).addClass('eliminar');
    });     
      
    if ( elementoCumple.length != 0 ) {
      return true;
    }
    else 
      return false; 
  }    
       
  // funciones para evaluar posibles ombinaciones a nivel horizontal y guardar aquellos que cumplen para ser borrados    
  function revisarVertical(col, elementoCumple) {
    var elemento, elementosEvaluados = [];
              
    for (var i = 0; i< 7; i++ ) {
      elemento = $(col[i]).find(':first-child')[0];
      var iguales = 0;
          
      // Evaluar combinaciones que cumplen como columna
      for(var j = 2; j<8; j++) {
        var evaluado = $(col[i]).find(":nth-child("+ j + ")")[0];
            
        // Comparar elementos iguales
        if ( $(elemento).attr('src') == $(evaluado).attr('src') ) {
          elementosEvaluados.push($(evaluado));
          iguales++;
        }
        else {
          if (iguales >1) {
            elementosEvaluados.forEach(function(element) {
              elementoCumple.push($(element));
              });
              
              elementoCumple.push($(elemento));
          }                
          elementosEvaluados=[];
          elemento = evaluado;
          iguales = 0;
        }            
      }

      if (iguales >1) {
        elementosEvaluados.forEach(function(element) {
          elementoCumple.push($(element));
          });
          
          elementoCumple.push($(elemento));
          elementosEvaluados=[];
      }
    } 
  }   

  function  revisarHorizontal(col, elementoCumple) {
    var elemento, elementosEvaluados = [];
            
    for (var i = 1; i< 8; i++ ) {
        // Primer elemento de la fila
        elemento = $(col[0]).find(':nth-child('+i+')')[0];
        var iguales = 0;
          
        // Evaluar combinaciones
        for(var j = 0; j<8; j++) {
          var evaluado = $(col[j]).find(":nth-child("+ i + ")")[0];
              
          // Comparar si ambos elementos son los mismos
          if ( $(elemento).attr('src') == $(evaluado).attr('src') ){
            elementosEvaluados.push($(evaluado));
            iguales++
          }
          else {
            if (iguales >1) {
              elementosEvaluados.forEach(function(element) {
                elementoCumple.push($(element));
              });
              
              elementoCumple.push($(elemento));
            }
            elementosEvaluados=[];
            elemento = evaluado;
            iguales = 0;
          }                
        }           
         
        if (iguales >2) {
          elementosEvaluados.forEach(function(element) {
            elementoCumple.push($(element)[0]);
          });
        
          elementoCumple.push($(elemento));
          elementosEvaluados=[];
        }
    }
  }

  // Eliminar elementos 
  function borrarElementos(sinAnimacion) {
    if (sinAnimacion != 'sinAnimacion') {
      $('.eliminar').hide('explode',800, function() {
        $(this).remove();
        llenarTablero();
      });            
    } 
    else
      $('.eliminar').remove(); 
  }

  function buscarfichas() {
    if (combinaciones('on'))
      borrarElementos();
    else
      clearInterval(crono);
  } 
 