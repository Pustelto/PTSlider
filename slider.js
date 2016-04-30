/**
 * Vanilla JS slider plugin
 * Browser support IE10+
 * dependecies:
 *      classList
 *      querySelector
 *      Array.map
 */
(function (root, _pt_slider) {
    if ( typeof define === 'function' && define.amd ) {
        define(_pt_slider);
    } else if ( typeof exports === 'object' ) {
        module.exports = _pt_slider();
    } else {
        root._PT_Slider = _pt_slider();
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function () {
    'use strict';

    function ms( elem, opt) {
        return new _PT_Slider( elem, opt );
    }

    function _PT_Slider( elem, opt) {
        var _ = this;

        // Slider basic properties - slider components
        _.slider = document.querySelector( elem );
        _.container = null;
        _.items = [];

        // Interval property for automatic sliding
        _.slideTimer = null;

        // Properties for sliding functionality
        _.isSliding = false;

        // Empty object for slider settings
        _.settings = {};

        // Default options
        _.defaults = {
            //itemSelector: null,     // Custom selector for slider items
            randomFirstItem: false, // Start slider from 1st item or at random item
            itemsPerView: 1,        // Number of slider items per view
            itemsToSlide: 1,
            //itemMinWidth: 0,        // Minimal width of item for responsive support
            controls: true,         // Display slider controls
            bullets: false,         // Display bullet list to switch specific slider item
            bulletsEl: 'ul',        // Type of element for bullet list - 'ul' | 'ol'
            prevText: 'Previous',   // String - text of prev button
            nextText: 'Next',        // String - text of next button
            autoSlide: false,       // Bool - slide automaticaly in given time interval
            slideInterval: 2500,    // Integer - time interval for autoSlide in ms
            defaultDirection: 'left'    // String (left, right) - default direction of sliding for autoSlide @FIXME - value and type may change
        };

        // Extends _.defaults and user options in order to create _.settings
        if ( opt && typeof opt === "object" ) {
            _.settings = extendObj( _.defaults, opt );
        }

        _.init();
    }

    // PUBLIC METHODS
    _PT_Slider.prototype.init = function(){
        var _ = this;

        // Create slider container
        _.createSliderContainer();

        // Prepare slider items
        _.initItems();

        // Add buttons and bullets
        _.createControls();

        // Bind events
        _.bindEvents();

        // Automatic sliding
        if ( _.settings.autoSlide ) {
            _.slideTimer = window.setInterval( function() {
                _.slideIt( _.settings.defaultDirection );
            }, _.settings.slideInterval );
        }
    };

    _PT_Slider.prototype.createSliderContainer = function() {
        var _ = this,
            $sliderParent;

        // Add CSS class for slider
        _.slider.classList.add( '_pt_slider' );

        // Create slider container
        _.container = document.createElement('div');
        _.container.classList.add('_pt_slider__container');

        // Insert slider container
        $sliderParent = _.slider.parentElement;
        $sliderParent.insertBefore( _.container, _.slider );
        _.container.appendChild( _.slider );
    };

    _PT_Slider.prototype.initItems = function() {
        var _ = this,
            $itemsNodeList = _.settings.itemSelector ? document.querySelectorAll( _.settings.itemSelector ) : _.slider.children,
            $itemsArray = listToArray( $itemsNodeList ),
            startIndex = 0;

        // Assign each item CSS class
        _.items = $itemsArray.map( function( item ) {
            item.classList.add( '_pt_slider__item' );
            return item;
        });

        // generate StartIndex for randomFirstItem === true
        if ( _.settings.randomFirstItem ) {
            startIndex = Math.floor( Math.random() * _.items.length );
        }

        // @FIXME
        //this must be change based on used technology transform, left etc. Maybe separate function? Will be transition, fallback with abs pos

        // Setup width and position of elements
        _.items.forEach( function( item, index ) {
            var interval = ( 100 / _.settings.itemsPerView );

            item.style.width = interval + '%';
            item.style.left = ( ( index - startIndex ) * interval ) + '%';
        });
    };

    _PT_Slider.prototype.createControls = function() {
        var _ = this;

        if ( _.settings.controls ) {
            makeButton.call( _, 'prev' );
            makeButton.call( _, 'next' );
        }

        if ( _.settings.bullets ) {
            makeBullets.call( _ );
        }
    };

    _PT_Slider.prototype.bindEvents = function() {
        var _ = this,
            el = listToArray( document.querySelectorAll( '._pt_slider__control' ) );

            // @FIXME
            // eventlistener on nodelist or array
        if ( _.settings.controls ) {
            el.forEach( function( item ) {
                item.addEventListener( 'click', function( e ) {
                    _.slideIt.call(_, e );
                });
            });
        }
/*

        if ( _.settings.bullets ) {
            el.querySelectorAll( '._pt_slider__bullets' ).addEventListener( 'click', function(){
                console.log( 'binding events for bullets' );
            });
        }
        */
    };

    // @FIXME
    // dont have access to slider obj
    _PT_Slider.prototype.slideIt = function( e ) {
        var _ = this,
            direction = e.target.getAttribute( 'data-pt-slider-direction');

        moveItems( direction, _.settings.itemsToSlide );
    };

    // @TODO
    // create destructor fce
    _PT_Slider.prototype.destroy = function() {
        console.log( 'destroy function - WIP' );
    };

    // PRIVATE METHODS
    /**
     * convert nodeList to Array
     * @param nlist {Node list} - node list to convert
     * @private
     */
    var listToArray = function ( nlist ) {
        return Array.prototype.slice.call( nlist );
    };

    /*
     * Equivalent of JQuery $.extend function to merge two objects
     * @private
     */
    var extendObj = function () {
        var result = {};

        for ( var i = 0; i < arguments.length; i++ ) {
            if ( !arguments[i] ) {
                continue;
            }

            for ( var property in arguments[i] ) {
                if ( arguments[i].hasOwnProperty( property ) ) {
                    result[ property ] = arguments[i][ property ];
                }
            }
        }
        return result;
    };

    /*
     * Function to create controls for slider
     * @private
     * @param direction {String}
     */
    var makeButton = function( direction ) {
        var _ = this,
            $btn,
            $text = direction === 'prev' ? _.settings.prevText : _.settings.nextText;

        $btn = document.createElement( 'button' );
        $btn.classList.add( '_pt_slider__control' );
        $btn.classList.add( '_pt_slider__' + direction );
        $btn.setAttribute( 'data-pt-slider-direction', direction );
        $btn.innerHTML = $text;

        _.container.appendChild( $btn );
    };

    /*
     * Function to create bullet list for slider
     * @private
     */
    var makeBullets = function() {
        var _ = this,
            $label,
            $bullets,
            $bullet;

        $bullets = document.createElement( _.settings.bulletsEl );
        $bullets.classList.add( '_pt_slider__bullets' );

        for ( var i = 0; i < _.items.length; i++ ) {
            $bullet = document.createElement('li');
            // Add label to the list - check for custom label in data atribute or use number of item
            $label = document.createTextNode( _.items[i].getAttribute( 'data-pt-slider-label' ) || i + 1 );
            $bullet.appendChild( $label );
            $bullets.appendChild( $bullet );
        }

        _.container.appendChild( $bullets );
    };

    /*
     * Function to move slider items by specific offset
     * @private
     * @param direction {String} - direction in which items will move
     * @param offset {Integer} - how many sliders should move
     */
    var moveItems = function( direction, offset ) {
        var dir;

        dir = convertDirToNumber( direction );

        console.log( 'item slided in direction ' + direction );
        console.log( 'offset ' + offset );
    };

    /*
     * Function converts String direction to Integer
     * @private
     * @param direction {String} - direction to convert, can be prev, next or Number
     * @return Integer
     */
    var convertDirToNumber = function( direction ) {
        var n;

        if( direction === 'prev' ) {
            n = -1;
        }
        if( direction === 'next' ) {
            n = 1;
        }
        if( !!parseInt( direction, 10 ) ) {
            n = parseInt( direction, 10 );
        }

        return n;
    };

    //return _PT_Slider;
    return ms;
});