/**
 * Vanilla JS slider plugin
 * závislosti:
 *      classList
 *      querySelector
 *      Array.map
 */

(function() {
    'use strict';

    function _PT_Slider( elem, opt) {
        var _ = this;

        // Options
        _.defaults = {
            randomFirstItem: true,
            numberOfItems: 1,
            itemMinWidth: 0
        };

        // TO-DO extend defaults and opt
        _.settings = {
            randomFirstItem: true,
            numberOfItems: 1,
            itemMinWidth: 0
        };

        // Slider properties
        _.container = document.querySelector( elem );
        _.items = [];

        // Initialization of plugin
        _.init();
    }

    _PT_Slider.prototype.init = function(){
        var _ = this;

        // add CSS class for slider container
        _.container.classList.add( '_pt_slider' );

        // add CSS class for items
        _.initItems();

        // setup number of slides per view
        // add buttons
        // add bullets
        // position slides correctly
        // bind events
    };

    _PT_Slider.prototype.initItems = function() {
        var _ = this,
            $itemsNodeList = _.settings.itemSelector ? document.querySelectorAll( _.settings.itemSelector ) : _.container.children,
            $itemsArray;

        // Convert NodeList to Array and assign each item CSS class
        $itemsArray = Array.prototype.slice.call( $itemsNodeList );
        _.items = $itemsArray.map(function( item ){
            return item.classList.add( '_pt_slider__item' );
        });

        console.log( _.items );
        _.items.forEach( function( item ) {
            console.log( item );
            item.style.width = ( 100 / _.settings.numberOfItems ) + '%';
        });
    };

    // Private methods

    // FIXME
    // Calling instance of slider
    var slider = new _PT_Slider( '.slider' );
})();