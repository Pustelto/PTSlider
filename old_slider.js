/*scroll lektorů*/
function myCarousel(maxVisible, minVis, bp){

    var win = $(window),
        items = $('.lector'),
        itemCount = items.length,
        itemCountZero = items.length - 1,
        /*Config of plugin*/
        //maxVisible = maxVisible, - preparation for full responsivnes - funcition getVisible must be added in order to calculate current number of visible items
        minVisible = minVis || 1, // setting for what is minimal amount of visible items
        breakpoint = bp || undefined,
        visibleItems = maxVisible || 1, //how many objects can be seen at once

        pos = Math.floor( Math.random() * 7 ),
        prevIndex,
        nextIndex,
        direction,
        sliding = false;

    function transitionEndCarousel() {
        var i,
            el = document.createElement('div'),
            transitions = {
                'transition':'transitionend',
                'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
                'MozTransition':'transitionend',
                'WebkitTransition':'webkitTransitionEnd'
            };

        for (i in transitions) {
            if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
                return transitions[i];
            }
        }
    }

    function resizeCarousel(visItem){
        (win.width() < breakpoint) ? visibleItems = 1 : visibleItems = visItem || 2;
        items.css( 'width', (100 /visibleItems) +'%' );
        assignClasses();
    }

    function init(){
        var controls = $('.carousel-control');
        controls.show();

        resizeCarousel(visibleItems);

        $('.carousel-control').on('click', slideIt);

        win.resize(function(){
            if( (($(this).width() > breakpoint) && (visibleItems === 1)) || (($(this).width() < breakpoint) && (visibleItems > 1)) ){
                resizeCarousel();
            } else {
                return;
            }
        });
    }

    function assignClasses(){
        items.removeClass('active sibling prev-item next-item');
        items.eq(pos).addClass('active');
        if ( visibleItems != 1 ) {
            for (var i = pos + 1; i < (pos + visibleItems); i++ ) {
                items.eq( i % itemCount ).addClass('sibling');
            }
        }

        pos > 0                                     ? prevIndex = pos - 1               : prevIndex = itemCountZero;
        ( pos + visibleItems - 1 ) < itemCountZero  ? nextIndex = pos + visibleItems    : nextIndex = ( pos + visibleItems - 1 ) - itemCountZero;
        futureItems();
    }

    function futureItems(){
        items.eq(prevIndex).addClass('prev-item');
        items.eq(nextIndex).addClass('next-item');
    }

    function slideIt(){
        var sibling = $('.sibling'),
            active = $('.active'),
            elem = $('.active, .sibling, .prev-item, .next-item'),
            transEnd = transitionEndCarousel();

        direction = $(this).data('direction');
        if( !sliding ){
            sliding = true;
            direction === 'prev' ? elem.addClass('left') : elem.addClass('right');
        } else {
            return false;
        }
        active.one(transEnd, function(){
            swapClasses();
        });
    }

    function swapClasses(){
        var sibling = $('.sibling'),
            to = direction === 'prev' ? 'left' : 'right';

        $('.' + direction + '-item').removeClass(direction + '-item');
        if( direction === 'prev'){
            items.eq(pos).removeClass('active').addClass('prev-item');
            if( sibling.length !== 0) {
                sibling.first().removeClass('sibling').addClass('active');
                items.eq(nextIndex).removeClass('next-item').addClass('sibling');
            } else {
                items.eq(nextIndex).removeClass('next-item').addClass('active');
            }
            items.eq(nextIndex).next().length !== 0 ? items.eq(nextIndex).next().addClass('next-item') : items.first().addClass('next-item');

        } else {
            if( sibling.length === 0 ){
                items.eq(pos).removeClass('active').addClass('next-item');
            } else {
                sibling.last().removeClass('sibling').addClass('next-item');
                items.eq(pos).removeClass('active').addClass('sibling');
            }
            items.eq(prevIndex).prev().length !== 0 ? items.eq(prevIndex).prev().addClass('prev-item') : items.last().addClass('prev-item');
            items.eq(prevIndex).removeClass('prev-item').addClass('active');
        }

        $('.' + to).removeClass(to);
        updatePos();
        sliding = false;
    }

    function updatePos(){
        if( direction === 'prev' ){
            nextIndex = ( ++nextIndex % itemCount );
            prevIndex = ( ++prevIndex % itemCount );
            pos =  ( ++pos  % itemCount );
        } else {
            nextIndex = ( --nextIndex % itemCount );
            prevIndex = ( --prevIndex % itemCount );
            pos  = ( --pos  % itemCount );
        }
    }

    init();
}