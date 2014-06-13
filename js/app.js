
// Search widget

var SearchWidget = (function () {
  var s; // private alias to settings

  return {
    settings: {
      searchForm: $("#search"),
      searchInput: $(".autosearch"),
      searchSelectors: $(".searchselectors"),
      jsonURL: 'search.json'
    },

    init: function() {
      s = this.settings;
      this.bindUIActions();
    },

    bindUIActions: function() {
      $.getJSON(s.jsonURL, function( data ) {
        var items = [];
        $.each( data, function( key, val ) {
          var selected = (key == 0) ? 'selected ' : '';
          items.push( '<li class="' + selected + '" data-url="' + val['url'] + '" data-param="' + val['param'] + '">Search <b>' + val['name'] + '</b> for <b class="query"/></li>' );
        });

        s.searchSelectors.html(items.join( '' ));
        SearchWidget.setFormToSelected();
      });
  
      s.searchInput.focus().on('keyup focus', function() {
        if( s.searchInput.val() != '' ) {
          s.searchSelectors.filter('.hidden').removeClass('hidden'); 
        } else {
          s.searchSelectors.addClass('hidden');
        }
    
        s.searchSelectors.find('li .query').text(s.searchInput.val());
    
        SearchWidget.setFormToSelected();
      
      }).on('keydown', function( event ) {
        if( !s.searchSelectors.filter('.hidden').hasClass('hidden') ) {
          var selected = s.searchSelectors.find('.selected');
          var items = s.searchSelectors.find('li');
      
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
    
          SearchWidget.setFormToSelected();
        }
    
      }).on('blur', function() {
        s.searchSelectors.addClass('hidden');
      });
      
      
    },

    setFormToSelected: function() {
      var selected = s.searchSelectors.find('.selected');
      s.searchForm.attr('action', selected.data('url'));
      s.searchInput.attr('name', selected.data('param'));
    }

  };
})();

// Initialize widgets, etc.

(function () {
  SearchWidget.init();
})();
