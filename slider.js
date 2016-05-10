// @FIXME - proper description and browser support
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

    //@FIXME - upravit funkci
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
        _.currentIndex = 0;
        _.currentItemsPerView = 1;

        // Empty object for slider settings
        _.settings = {};

        // Default options
        _.defaults = {
            itemSelector: null,     // Custom selector for slider items
            randomFirstItem: false, // Start slider from 1st item or at random item
            itemsPerView: 1,        // Number of slider items per view
            itemsToSlide: 1,
            //itemMinWidth: 0,        // Minimal width of item for responsive support
            controls: true,         // Display slider controls
            bullets: false,         // Display bullet list to switch specific slider item
            bulletsEl: 'ol',        // Type of element for bullet list - 'ul' | 'ol'
            prevText: 'Previous',   // String - text of prev button
            nextText: 'Next',        // String - text of next button
            autoSlide: false,       // Bool - slide automaticaly in given time interval
            slideInterval: 2500,    // Integer - time interval for autoSlide in ms
            //pauseOnHover: true,     //pause autosliding on mouse hover over slider
            defaultDirection: 'next'    // String (prev, next) - default direction of sliding for autoSlide @FIXME - value and type may change
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

        // Create slider items
        _.setupItems();

        // Add buttons and bullets
        _.createControls();

        // Initial setup
        _.setupSlider();

        // Bind events
        _.bindEvents();

        // Automatic sliding
        if ( _.settings.autoSlide ) {
            autoSliding.call(_);
        }

        _.slider.setAttribute( 'data-pt-slider-initialized', true);
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

    _PT_Slider.prototype.setupItems = function() {
        var _ = this,
            $itemsNodeList = _.settings.itemSelector ? document.querySelectorAll( _.settings.itemSelector ) : _.slider.children,
            $itemsArray = listToArray( $itemsNodeList );

        // Assign each item CSS class
        _.items = $itemsArray.map( function( item ) {
            item.classList.add( '_pt_slider__item' );
            return item;
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

    //@FIXME - rozkouskovat na menší funkce - aby se dali části použít i při reinitu v responsivu
    _PT_Slider.prototype.setupSlider = function() {
        var _ = this,
            ci,
            $bullets = _.container.querySelectorAll('._pt_slider__bullet');

        // current number of items per view - necessary for proper responsivnes
        _.currentItemsPerView = _.settings.itemsPerView;

        // generate start index for randomFirstItem === true
        if ( _.settings.randomFirstItem ) {
            ci = Math.floor( Math.random() * _.items.length );
            _.currentIndex = ci - (ci % _.settings.itemsToSlide );
        }

        // Setup width and position of elements
        _.items.forEach( function( item, index ) {
            var interval = ( 100 / _.settings.itemsPerView );

            item.style.width = interval + '%';
            item.style.left = ( index * interval ) + '%';
            item.style.transform = ( 'translate3d( -' + _.currentIndex * 100 + '%, 0, 0 )' );
        });

        // @FIXME - odvodit jako itesm / offset
        if ( _.settings.bullets ) {
            $bullets[ Math.ceil( _.currentIndex / _.settings.itemsToSlide) ].classList.add('_pt_slider--active');
        }
    };

    _PT_Slider.prototype.bindEvents = function() {
        var _ = this,
            controls = listToArray( _.container.querySelectorAll( '._pt_slider__control' ) ),
            bullets = listToArray( _.container.querySelectorAll( '._pt_slider__bullet' ) );

        if ( _.settings.controls ) {
            controls.forEach( function( item ) {
                item.addEventListener( 'click', function( e ) {
                    _.slideIt.call(_, e );
                });
            });
        }

        if ( _.settings.bullets ) {
            bullets.forEach( function( item ) {
                item.addEventListener( 'click', function( e ) {
                    _.slideIt.call(_, e );
                });
            });
        }
    };

    /**
     * Function prepare data before sliding and call a sliding function
     */
    _PT_Slider.prototype.slideIt = function( e ) {
        var _ = this,
            direction = e.target.getAttribute( 'data-pt-slider-direction'),
            directMove = false;

        if( !direction ) {
            direction = e.target.getAttribute( 'data-pt-slider-item' );
            directMove = true;
        }

        moveItems.call(_, direction, _.settings.itemsToSlide, directMove );
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
     // @TODO - počet odrážek odvodit od items / offset
    var makeBullets = function() {
        var _ = this,
            $label,
            $bullets,
            $li,
            $bullet;

        $bullets = document.createElement( _.settings.bulletsEl );
        $bullets.classList.add( '_pt_slider__bullets' );

        for ( var i = 0; i < ( Math.ceil( _.items.length / _.settings.itemsToSlide ) ); i++ ) {
            $li = document.createElement( 'li' );
            $bullet = document.createElement( 'button' );
            $li.appendChild( $bullet );

            $bullet.classList.add( '_pt_slider__bullet' );
            $bullet.setAttribute( 'data-pt-slider-item', i );

            // Add label to the list - check for custom label in data atribute or use number of item
            $label = document.createTextNode( _.items[i].getAttribute( 'data-pt-slider-label' ) || i + 1 );

            $bullet.appendChild( $label );
            $bullets.appendChild( $li );
        }

        _.container.appendChild( $bullets );
    };

    /*
     * Function to move slider items by specific offset
     * @private
     * @param direction {String} - direction in which items will move
     * @param offset {Integer} - how many sliders should move
     * @param directMove {Boolean} - directs whether movement is only by one step or to specific slider item
     */
    var moveItems = function( direction, offset, directMove ) {
        var _ = this,
            dir = convertDirToNumber( direction ),
            workIndex,
            bulletIndex,
            position;

        _.isSliding = true;

        if ( directMove ) {
            workIndex = dir * offset;
            _.currentIndex = setNewIndex.call( _, workIndex, dir );
        } else {
            workIndex = _.currentIndex + ( dir * offset );
            _.currentIndex = setNewIndex.call( _, workIndex, dir );
        }

        position = _.currentIndex * -100;

        _.items.forEach(function( item ) {
            item.style.transform = ( 'translate3d( ' + position + '%, 0, 0)' );
        });

        //swap active class on bullets
        if ( _.settings.bullets ) {
            if ( _.currentIndex + _.settings.itemsToSlide === _.items.length ) {
                bulletIndex = Math.ceil( _.currentIndex / _.settings.itemsToSlide );
            } else {
                bulletIndex = Math.floor( _.currentIndex / _.settings.itemsToSlide );
            }
            _.container.querySelector( '._pt_slider--active' ).classList.remove( '_pt_slider--active' );
            _.container.querySelectorAll( '._pt_slider__bullet' )[ bulletIndex ].classList.add( '_pt_slider--active' );
        }

        //reset auto slide timer
        if ( _.settings.autoSlide ) {
            autoSliding.call(_);
        }

        _.isSliding = false;
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
        if( !isNaN( parseInt( direction, 10 ) ) ) {
            n = parseInt( direction, 10 );
        }

        return n;
    };

    /*
     * Check if the slider items are off limit and slider should be returned to basic position
     * @private
     * @param that {JS obj}
     * @param ci {Integer} - new current index
     * @return Integer
     */
    var setNewIndex = function( workIndex, dir ) {
        var _ = this,
            newIndex = workIndex;

        if ( ( ( newIndex + _.settings.itemsToSlide ) === 0 ) || ( newIndex === _.items.length ) ) {
            if ( dir < 0 ) {
                newIndex = _.items.length - _.settings.itemsToSlide;
            } else {
                newIndex = 0;
            }
        } else {
            if ( ( newIndex + _.settings.itemsToSlide ) > _.items.length ) {
                newIndex = _.items.length - _.settings.itemsToSlide;
            }
            if ( newIndex < 0 && ( (-1 * newIndex ) < _.settings.itemsToSlide ) ) {
                newIndex = 0;
            }
        }
        return newIndex;
    };

    var autoSliding = function() {
        var _ = this;

        clearInterval(_.slideTimer);

        _.slideTimer = window.setInterval( function() {
            moveItems.call(_, _.settings.defaultDirection, _.settings.itemsToSlide, false );
        }, _.settings.slideInterval );
    }

    // @FIXME - return _PT_Slider;
    return ms;
});