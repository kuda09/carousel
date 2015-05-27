(function ($, window, document, undefined) {

    "use strict";


    var pluginName = 'bCarousel',
        defaults = {
            arrows: true,
            autoplay: false,
            nextArrow: '<a class="carousel-next" data-role="none" aria-label="next"> Next </a> ',
            previousArrow: '<a class="carousel-previous" data-role="none" aria-label="previous"> Previous </a> ',
            autoPlay: 3000,
            easing: 'linear',
            rtl: false,
            touchMove: true,
            useCss: true,
            swipe: true,
            swipeToSlide: true,
            slidesToScroll: 1,
            slidesToShow: 3,
            centerMode: false,
            slideWidth: 200,
            initialSlide: 0,
            currentLeft: null,
            swipeLeft: null,
            cssEase: 'ease',
            speed: 500,
            slide: '',
            infinite: false,
            fade: false

        },
        self;


    function Plugin(element, options) {


        self = this;

        self.$carousel = $(element);

        self.options = $.extend( defaults, options);

        self.currentSlide = self.options.initialSlide;
        self.positionProp = 'left';

        self.changeSlide = $.proxy(self.changeSlide, self);
        self.setPosition = $.proxy(self.setPosition, self);
        self.init();
    }

    Plugin.prototype.init = function () {
        if (!(self.$carousel.hasClass('carousel-initialised'))) {

            $(self.$carousel).addClass('carousel-initialised');

            //all the methods that will be applied here
            self.buildOut();
            self.loadSlider();
            self.initializeEvents();

            self.$carousel.trigger('init', [self]);
        }

    };

    Plugin.prototype.buildOut = function (){

        self.$slides = self.$carousel.children().addClass('carousel-slide');

        self.slideCount = self.$slides.length;

        self.$slideTrack = self.$slides.wrapAll('<div class="carousel-track"/>').parent();

        self.$list = self.$slideTrack.wrap('<div class="carousel-list" aria-live="polite"/>').parent();

        self.$slides.each(function(index, element){
            $(element).attr('data-carousel-index', index);
        });

        self.buildArrows();
        self.setSlideClasses(typeof self.currentSlide === 'number' ? self.currentSlide : 0);
    }

    Plugin.prototype.setDimensions = function (){

        self.$slideTrack.width(self.slideCount * self.options.slideWidth);
        self.$list.width(self.options.slidesToShow * self.options.slideWidth);

        self.$listWidth = self.$list.width();

        self.slideWidth = Math.ceil(self.$listWidth / self.options.slidesToShow);
        self.$slideTrack.width(Math.ceil((self.slideWidth * self.$slideTrack.children('.carousel-slide').length)));

        var offset = self.$slides.first().outerWidth(true) - self.$slides.first().width();

        self.$slideTrack.children('.carousel-slide').width(self.slideWidth - offset);

    }

    Plugin.prototype.buildArrows = function (){

        if(self.options.arrows === true && self.slideCount > self.options.slidesToShow){

            self.$prevArrow = self.options.prevArrow;
            self.$nextArrow = self.options.nextArrow;


            self.$prevArrow = $(self.options.previousArrow);
            self.$nextArrow = $(self.options.nextArrow);

            self.$prevArrow.appendTo(self.$carousel);
            self.$nextArrow.appendTo(self.$carousel);

        }
    }

    Plugin.prototype.setSlideClasses = function (index){

        var centerOffset,
            allSlides,
            indexOffset,
            remainder;


        self.$carousel.find('.carousel-slide').removeClass('carousel-active').attr('aria-hidden', 'true').removeClass('carousel-center');
        allSlides = self.$carousel.find('.carousel-slide');

        if (self.options.centerMode === true) {

            centerOffset = Math.floor(self.options.slidesToShow / 2);

            self.$carousel.eq(index).addClass('carousel-center');

        }

        if (index >= 0 && index <= (self.slideCount - self.options.slidesToShow)) {
            self.$slides.slice(index, index + self.options.slidesToShow).addClass('carousel-active').attr('aria-hidden', 'false');
        } else if (allSlides.length <= self.options.slidesToShow) {
            allSlides.addClass('carousel-active').attr('aria-hidden', 'false');
        } else {
            remainder = self.slideCount % self.options.slidesToShow;
            indexOffset = index;
            if (self.options.slidesToShow == self.options.slidesToScroll && (self.slideCount - index) < self.options.slidesToShow) {
                allSlides.slice(indexOffset - (self.options.slidesToShow - remainder), indexOffset + remainder).addClass('carousel-active').attr('aria-hidden', 'false');
            } else {
                allSlides.slice(indexOffset, indexOffset + self.options.slidesToShow).addClass('carousel-active').attr('aria-hidden', 'false');
            }
        }

    }

    Plugin.prototype.initializeEvents = function (){

        self.$prevArrow.on('click', {message: 'previous'}, self.changeSlide);
        self.$nextArrow.on('click', {message: 'next'}, self.changeSlide);

    }

    Plugin.prototype.changeSlide = function (event){

        var $target = $(event.target),
            slideOffset,
            indexOffset;



        indexOffset = self.options.slidesToScroll;



        if ($target.is('a')) {
            event.preventDefault();
        }



        switch (event.data.message) {

            case 'previous':

                slideOffset = self.options.slidesToScroll;

                if (self.slideCount > self.options.slidesToShow) {
                    self.slideHandler(self.currentSlide - slideOffset); //minus the slideOffset
                }
                break;
            case 'next':

                slideOffset = self.options.slidesToScroll;

                if (self.slideCount > self.options.slidesToShow) {
                    self.slideHandler(self.currentSlide + slideOffset); //add the slideOffset
                }
                break;
            default:
                return;
        }
    }

    Plugin.prototype.slideHandler = function (index){
        var targetSlide,
            animSlide,
            slideLeft,
            targetLeft = null;

        if(self.currentSlide === index) { // donot animate anything if he index is equal to the slidesToScroll;
            return;
        }

        if(self.slideCount <= self.slidesToShow){ //donot animate when the slideCount is less than slidesToShow;
            return;
        }

        targetSlide = index //make the targetSlide the index
        targetLeft = self.getLeft(targetSlide); //200
        slideLeft = self.getLeft(self.currentSlide); //

        self.currentLeft = slideLeft;


        if(index < 0){
            targetSlide = self.currentSlide;
            self.animateSlide(slideLeft, function(){
                self.postSlide(targetSlide)
            });
        } else if (index < 0 || index < (self.slideCount - self.options.slidesToScroll)){
            targetSlide = self.currentSlide;
            self.animateSlide(slideLeft, function (){
                self.postSlide(targetSlide);
            });
        }

        if (targetSlide < 0) {

            if (self.slideCount % self.options.slidesToScroll !== 0) {
                animSlide = self.slideCount - (self.slideCount % self.options.slidesToScroll);
            } else {
                animSlide = self.slideCount + targetSlide;
            }
        } else if (targetSlide >= self.slideCount) {
            if (self.slideCount % self.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - self.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }


        self.currentSlide = animSlide;

        self.setSlideClasses(self.currentSlide);

        self.updateArrows();


        self.animateSlide(targetLeft);

    }

    Plugin.prototype.getLeft = function (slideIndex){

        var targetLeft;

        self.slideOffset = 0;

        if(slideIndex + self.options.slideToShow > self.slideCount){ //if the index and slidesToShow is greater than slideCount
            self.slideOffset = ((slideIndex + self.options.slidesToShow) - self.slideCount) * self.slideWidth
            //
        }

        if (self.slideCount <= self.options.slidesToShow) {
            self.slideOffset = 0;
        }


        targetLeft = ((slideIndex * self.options.slideWidth * -1)) + self.slideOffset;

        return targetLeft; //200
    }

    Plugin.prototype.animateSlide = function (targetLeft , callback) {

        if (self.options.rtl === true) {
            targetLeft = -targetLeft;
        }

        self.$slideTrack.animate({
            left: targetLeft
        }, self.options.speed, self.options.easing, callback);
    };

    Plugin.prototype.postSlide = function (index){

        self.setPosition();
    }

    Plugin.prototype.setPosition = function (){

        self.setDimensions();

        self.setCSS(self.getLeft(self.currentSlide)); // set the position of the css class according to the current slide

        self.$carousel.trigger('setPosition', [self]); //trigger set positions
    }

    Plugin.prototype.setCSS = function (position){

        var positionProps = {},
            x;

        if (self.options.rtl === true) {
            position = -position;
        }


        x = self.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';


        positionProps[self.positionProp] = position;

        self.$slideTrack.css(positionProps);
    }

    Plugin.prototype.loadSlider = function (){
        self.setPosition();
    }

    Plugin.prototype.updateArrows = function () {


        if (self.options.arrows === true && self.slideCount > self.options.slidesToShow) {
            self.$prevArrow.removeClass('carousel-disabled');
            self.$nextArrow.removeClass('carousel-disabled');

            if (self.currentSlide === 0) {
                self.$prevArrow.addClass('carousel-disabled');
                self.$nextArrow.removeClass('carousel-disabled');
            } else if (self.currentSlide >= self.slideCount - self.options.slidesToShow && self.options.centerMode === false) {
                self.$nextArrow.addClass('carousel-disabled');
                self.$prevArrow.removeClass('carousel-disabled');
            } else if (self.currentSlide >= self.slideCount - 1 && self.options.centerMode === true) {
                self.$nextArrow.addClass('carousel-disabled');
                self.$prevArrow.removeClass('carousel-disabled');
            }

        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);