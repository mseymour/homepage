$(document).ready(function( data ) {
  
  var autosearch = $('.autosearch');

  $.getJSON('search.json', function( data ) {
    var items = [];
    $.each( data, function( key, val ) {
      var selected = (key == 0) ? 'selected ' : '';
      items.push( '<li class="' + selected + '" data-url="' + val['url'] + '" data-param="' + val['param'] + '">Search <b>' + val['name'] + '</b> for <b class="query"/></li>' );
    });

    $('.searchselectors').html(items.join( '' ));
    setFormToSelected();
  });
  
  $('.autosearch').focus().on('keyup focus', function() {
    if( autosearch.val() != '' ) {
      $('.searchselectors.hidden').removeClass('hidden'); 
    } else {
      $('.searchselectors').addClass('hidden');
    }
    
    $('.searchselectors li .query').text(autosearch.val());
    
    setFormToSelected();
    
  }).on('keydown', function( event ) {
    if( !$('.searchselectors.hidden').hasClass('hidden') ) {
      var selected = $('.searchselectors .selected');
      var items = $('.searchselectors li');
      
      if ( event.keyCode == 38 || event.keyCode == 40 ) { // arrow up/down
        var direction = event.keyCode == 38 ? 'prev' : 'next';
        selected.toggleClass('selected');
        
        if( selected.is('li:last') && direction == 'next' ) {
          items.first().toggleClass('selected');
        } else if ( selected.is('li:first') && direction == 'prev' ) {
          items.last().toggleClass('selected');
        } else {
          selected[direction]().toggleClass('selected');
        }
        
        event.preventDefault();
      }
    
      setFormToSelected();
    }
    
  }).on('blur', function() {
    $('.searchselectors').addClass('hidden');
  });
  
});

function setFormToSelected() {
  var selected = $('.searchselectors .selected');
  $('#search').attr('action', selected.data('url'));
  $('.autosearch').attr('name', selected.data('param'));
}
