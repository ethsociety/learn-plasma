let $ = require('jquery');
let hashPattern = /\#.+/;
let trailingSlashPattern = /\/$/;

require('bootstrap');

$(() => {
  let pathname = window.location.pathname.replace(trailingSlashPattern, '');
  let body = $('body');
  let navbar = $('.navbar');
  let header = $('.header');
  let hasHeader = header.length;
  let mainOffsetTop = $('body>main').offset().top;
  let prevOffsetTop = 0;
  let scrollOffsetTop = 20;

  let navbarToggle = () => {
    body.toggleClass('navbar-open');
    if (body.hasClass('navbar-open')) {
      navbar.prepend('<div class="backdrop backdrop-navbar"></div>');
    }
  };

  let navbarClose = () => {
    body.removeClass('navbar-open');
    $('.backdrop-navbar').remove();
  };

  $(document).on('click', '.navbar-toggler', () => {
    navbarToggle();
  });
  $(document).on('click', '.backdrop-navbar', () => {
    navbarClose();
  });
  $(document).on('click', '.navbar-open .nav-navbar > .nav-item > .nav-link', function() {
    $(this).closest('.nav-item').siblings('.nav-item').find('> .nav:visible').slideUp(333, 'linear');
    $(this).next('.nav').slideToggle(333, 'linear');
  });

  // Sidebar
  let seen = {};
  $('#post article h2').each((_, item) => {
    let sidebar = $('.nav-sidebar-pill');

    let links = '';
    $(item).nextUntil('h2', 'h3').each((_, subitem) => {
      let href = $(subitem).find('a').attr('href');
      if (!seen[href]) {
        seen[href] = 1;
      } else {
        $(subitem).find('a').attr('href', (_, attr) => (attr + '-' + seen[href]));
        $(subitem).find('span').attr('id', (_, attr) => (attr + '-' + seen[href]));
        seen[href]++;
      }
      links += `<a class="nav-link" href="${$(subitem).find('a').attr('href')}">${$(subitem).find('span').text()}</a>`
    });

    sidebar.append(`
      <li class="nav-item">
        <a class="nav-link" href="${$(item).find('a').attr('href')}">${$(item).find('span').text()} <i class="nav-angle"></i></a>
        <div class="nav">
          ${links}
        </div>
      </li>
    `);
  });

  let navItemShow = $('.nav-sidebar .nav-item.show');
  navItemShow.find('> .nav-link .nav-angle').addClass('rotate');
  navItemShow.find('> .nav').css('display', 'block');
  navItemShow.removeClass('show');

  let navSidebarIsAccordion = false;
  if ( 'true' == $('.nav-sidebar').attr('accordion', 'false') ) {
    navSidebarIsAccordion = true;
  }

  $(document).on( 'click', '.nav-sidebar > .nav-item > .nav-link', function() {
    let link = $(this);
    link.next('.nav').slideToggle();
    if ( navSidebarIsAccordion ) {
      link.closest('.nav-item').siblings('.nav-item').children('.nav:visible').slideUp().prev('.nav-link').children('.nav-angle').removeClass('rotate');
    }
    link.children('.nav-angle').toggleClass('rotate');
  });

  var smoothlyScrollTo = function(pos) {
    $('html, body').animate({scrollTop: pos}, 600);
  }

  var toggleStickClass = function(tag) {
    var requiredClass = 'navbar-scrolled';
    if ( hasHeader ) {
      requiredClass = 'header-scrolled';
    }

    if (body.hasClass(requiredClass)) {
      tag.addClass('stick');
    }
    else {
      tag.removeClass('stick');
    }
  }

  let navbarHeight = navbar.innerHeight();
  let headerHeight = header.innerHeight();
  var windowScrollActions = function() {
    var window_top = $(window).scrollTop();

    // .body-scrolled
    //
    if (window_top > 1) {
      body.addClass('body-scrolled');
    }
    else {
      body.removeClass('body-scrolled');
    }

    // .navbar-scrolled
    //

    if (window_top > navbarHeight) {
      body.addClass('navbar-scrolled');
    }
    else {
      body.removeClass('navbar-scrolled');
    }


    // .header-scrolled
    //
    //if (window_top > headerHeight - navbarHeight - 1) {
    if (window_top > headerHeight) {
      body.addClass('header-scrolled');
    }
    else {
      body.removeClass('header-scrolled');
    }


    // .main-scrolled
    //
    if (window_top > mainOffsetTop) {
      body.addClass('main-scrolled');
    }
    else {
      body.removeClass('main-scrolled');
    }

    // Sticky elements
    //
    $('[data-sticky="true"]').each(function() {
      var tag = $(this),
          top = tag.offset().top;

      if ( ! tag.hasDataAttr('original-top') ) {
        tag.attr('data-original-top', top);
      }

      var stick_start = tag.dataAttr('original-top'),
          stick_end   = footer.offset().top - tag.outerHeight();

      if (window_top > stick_start) {// && window_top <= stick_end) {
        tag.addClass('stick');
      }
      else {
        tag.removeClass('stick');
      }
    });

    // Smart navbar
    //
    $('[data-navbar="smart"]').each(function() {
      var tag = $(this);

      //toggleFixClass(tag);
      if (window_top < prevOffsetTop) {
        toggleStickClass(tag);
      }
      else {
        tag.removeClass('stick');
      }
    });

    // Sticky navbar
    //
    $('[data-navbar="sticky"]').each(function() {
      var tag = $(this);
      toggleStickClass(tag);
    });

    // Fixed navbar
    //
    $('[data-navbar="fixed"]').each(function() {
      var tag = $(this);
      if (body.hasClass('body-scrolled')) {
        tag.addClass('stick');
      }
      else {
        tag.removeClass('stick');
      }
    });

    // Sticky sidebar
    //
    $('.sidebar-sticky').each(function() {
      var tag = $(this);
      toggleStickClass(tag);
    });


    // Fadeout effect
    //
    $('.header.fadeout').css('opacity', (1-window_top-200 / window.innerHeight) );


    prevOffsetTop = window_top;
  }

  if ( $('[data-navbar="fixed"], [data-navbar="sticky"], [data-navbar="smart"]').length ) {
    scrollOffsetTop = navbarHeight;
  }

  $(document).on( 'click', "a[href^='#']", function() {
    if ( $(this).attr('href').length < 2 ) {
      return;
    }

    if ( $(this)[0].hasAttribute('data-toggle') ) {
      return;
    }

    var target = $( $(this).attr('href') );
    if ( target.length ) {
      var targetTop = target.offset().top,
          windowTop = $(window).scrollTop();

      // We don't need offsetTop for scroll down with smart navbar
      //
      if ( targetTop > windowTop && $('.navbar[data-navbar="smart"]').length ) {
        smoothlyScrollTo( targetTop );
      }
      else {
        smoothlyScrollTo( targetTop - scrollOffsetTop );
      }

      if (body.hasClass('navbar-open')) {
        page.navbarClose();
      }

      if (body.hasClass('sidebar-open')) {
        page.sidebarClose();
      }
      return false;
    }
  });

  windowScrollActions();

  $(window).on('scroll', function() {
    windowScrollActions()
  });

  // Sticky sidebar width
  //
  $('.sidebar').each(function() {
    var tag = $(this),
        width = tag.closest('div').width();
    tag.css('width', width);

    if (body.width() / width < 1.8) {
      tag.addClass('is-mobile-wide');
    }
  });

  $('body').scrollspy({
    target: '.nav-sidebar',
    offset: 100
  });
  $(window).on('activate.bs.scrollspy', function (event) {
    console.log('activate.bs.scrollspy', event);
})

  $('a.nav-link').each((_, item) => {
    let link = $(item)

    let linkHref = link
      .attr('href')
      .replace(hashPattern, '')
      .replace(trailingSlashPattern, '')

    if (linkHref === pathname) {
      // match
      // the user is viewing this url
      link.addClass('active')
      return
    }

    // no match
    link.removeClass('active')
  });

  let counter = 100;
  $('.index-post').each((_, item) => {
    setTimeout(() => $(item).addClass('loaded'), (counter += 100));
  });
});
