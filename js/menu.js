function calc_width(children, parentWidth, $){
  var totalWidth = 0;
  var lastIndex = 0;
  var previous = null;
  var scroll = false;
  
  for(var i in children){
    if(typeof(children[i].clientWidth) != 'undefined'){
      totalWidth += children[i].offsetWidth;
      
      var link = $('a', children[i])[0]; 
      
      $(link).css('width', $(link).width() + 1);
      
      if(totalWidth > parentWidth && previous){
        if(!lastIndex) lastIndex = previous;
        $(children[i]).animate({'width' : 'toggle'}, 0);
        
        if( $('a', children[i]).hasClass('active') ){
          scroll = true;
        }
      }

      previous = i;
    }
  }
  
  return {'index' : lastIndex, 'width': totalWidth, 'scroll' : scroll};
}

function showChildren(width, left, children, $, totalWidth, i, aT){
  if(!totalWidth) var totalWidth = 0;
  if(!i) var i = 0;
  if(typeof(aT) == 'undefined') var aT = 250; //just a way to quickly change the animation speed
  
  var child = children[i++];
  var w = $(child).width();
  
  if(i >= children.length){ //basecase of recursion 
    $(child).animate({'width' : 'toggle'}, aT, 'linear');
    return;
  }
  
  if(left < 0){
    left += w;
    totalWidth -= w;
    
    $(child).animate({'width' : 'toggle'}, aT, 'linear', showChildren(width, left, children, $, totalWidth, i));
   
  }
  else if(totalWidth + w > width){
      totalWidth += w;
      $(child).animate({'width' : 'toggle'}, aT, 'linear', showChildren(width, left, children, $, totalWidth, i));
  } else {
    totalWidth += w;
    if($(child).css('display') == 'none'){
      $(child).animate({'width' : 'toggle'}, aT, 'linear', showChildren(width, left, children, $, totalWidth, i));
    } else {
      showChildren(width, left, children, $, totalWidth, i);
    }
  }    
}

function getFullWidth(obj){
  var children = obj.children;
  var overallWidth = 0;
  
  for(var i=0; i<children.length; i++){
    overallWidth += children[i].clientWidth + 10;
  }
  
  return overallWidth;
}

(function($){
  $(document).ready(function(){
    /* Handle the main (top) menu */
    var menu = $('#navigation ul.menu');
    
    if(menu.size()){
      var realmenu = menu[0];
      $(realmenu).addClass('main-menu');
      //$(realmenu).wrap('<div class="hider"></div>');
      var hiderWidth = $('#navigation').width();
      var params = calc_width(realmenu.children, hiderWidth, $);
      var index = params.index;
      if(index > 0){
        //add a scroll button
        $(realmenu).parent().append('<div class="scrollButton"><a href="javascript:void()" title="More Links">&nbsp;&nbsp;&nbsp;&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;</a></>');
        $(realmenu).parent().prepend('<div class="scrollBackButton"><a href="javascript:void()" title="More Links">&nbsp;&nbsp;&nbsp;&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;</a></div>');
        $('.scrollBackButton').hide();
        
        $('.scrollButton').click(function(e){
          $(this).hide();
          showChildren(hiderWidth, hiderWidth - params.width,  $(realmenu).children(), $);
          $('.scrollBackButton').show();
        });
        
        $('.scrollBackButton').click(function(e){
          $(this).hide();
          showChildren(hiderWidth, 0, $(realmenu).children(), $);
          $('.scrollButton').show();
        });
        
        //scroll to active tab if necessary
        if(params.scroll){
          $('.scrollButton').hide();
          showChildren(hiderWidth, hiderWidth - params.width, $(realmenu).children(), $, 0, 0, 0);
          $('.scrollBackButton').show();
        }
      }
    }
    
    //Handle the footer menu
    var footer = $('#footer-nav ul.menu')[0];
    var container = $('#footer-nav')[0];
    if(footer){
        var width = getFullWidth(footer);
        $(footer).css('width', width);

        if(width > $(container).width()){
          $('<div class="footerScrollButton"><a href="javascript:void(0)" title="More Links">&nbsp;&nbsp;&nbsp;&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;</a></div>').insertAfter(container);
          $('<div class="footerScrollBackButton"><a href="javascript:void(0)" title="More Links">&nbsp;&nbsp;&nbsp;&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;</a></div>').insertBefore(container);
          
          $('.footerScrollBackButton').hide();
          
          $('.footerScrollBackButton').click(function(){
            $(footer).animate({'left' : '0'}, 200);
            $(this).hide();
            $('.footerScrollButton').show();
          });
          
          $('.footerScrollButton').click(function(){
            $(footer).animate({'left' : $(container).width() - width + 5}, 200);
            $(this).hide();
            $('.footerScrollBackButton').show();
          });
        }
    }  

  });
})(jQuery); //shoots self in head for doing this

