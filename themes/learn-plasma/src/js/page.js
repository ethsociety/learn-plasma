let $ = require('jquery');

let body = $('body'),
    navbar = $('.navbar'),
    header = $('.header');

let hasHeader = header.length,
    mainOffsetTop = $('body > main').offset().top,
    prevOffsetTop = 0,
    scrollOffsetTop = 20,
    navbarHeight = navbar.innerHeight(),
    headerHeight = header.innerHeight();

// NAVBAR
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

// SIDEBAR
let seen = {};
let sidebarItems = '';
let divToReplace = $('#to-replace');
$('#post article h2').each((_, item) => {

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
  let angle = links === '' ? '' : '<i class="nav-angle"></i>';
  sidebarItems += `
    <li class="nav-item">
      <a class="nav-link" href="${$(item).find('a').attr('href')}">${$(item).find('span').text()} ${angle}</a>
      <div class="nav">
        ${links}
      </div>
    </li>
  `;
});
divToReplace.replaceWith(sidebarItems);

$(document).on( 'click', '.nav-sidebar > .nav-item > .nav-link', function() {
  let link = $(this);
  link.toggleClass('active');
});

let updateSidebarWidth = () => {
  $('.sidebar').each(function() {
    let tag = $(this),
        width = tag.closest('div').width();
    tag.css('width', width);

    if (body.width() / width < 1.8) {
      tag.addClass('is-mobile-wide');
    }
  });
};

updateSidebarWidth();
$(window).on('resize', () => {
  updateSidebarWidth();
});

$('.sidebar').css('visibility', 'visible');

// HELPERS
let smoothlyScrollTo = (pos) => {
  $('html, body').animate({scrollTop: pos}, 600);
};

let toggleStickClass = (tag) => {
  let requiredClass = 'navbar-scrolled';
  if ( hasHeader ) {
    requiredClass = 'header-scrolled';
  }

  if (body.hasClass(requiredClass)) {
    tag.addClass('stick');
  }
  else {
    tag.removeClass('stick');
  }
};

// SCROLL LISTENERS
let windowScrollActions = () => {
  let window_top = $(window).scrollTop();

  // .body-scrolled
  if (window_top > 1) {
    body.addClass('body-scrolled');
  }
  else {
    body.removeClass('body-scrolled');
  }

  // .navbar-scrolled
  if (window_top > navbarHeight) {
    body.addClass('navbar-scrolled');
  }
  else {
    body.removeClass('navbar-scrolled');
  }

  // .header-scrolled
  if (window_top > headerHeight) {
    body.addClass('header-scrolled');
  }
  else {
    body.removeClass('header-scrolled');
  }

  // .main-scrolled
  if (window_top > mainOffsetTop) {
    body.addClass('main-scrolled');
  }
  else {
    body.removeClass('main-scrolled');
  }

  // 
  $('[data-sticky="true"]').each(function() {
    let tag = $(this),
        top = tag.offset().top;

    if ( ! tag.hasDataAttr('original-top') ) {
      tag.attr('data-original-top', top);
    }

    let stick_start = tag.dataAttr('original-top'),
        stick_end   = footer.offset().top - tag.outerHeight();

    if (window_top > stick_start) {
      tag.addClass('stick');
    }
    else {
      tag.removeClass('stick');
    }
  });

  $('[data-navbar="sticky"]').each(function() {
    let tag = $(this);
    toggleStickClass(tag);
  });

  $('[data-navbar="fixed"]').each(function() {
    let tag = $(this);
    if (body.hasClass('body-scrolled')) {
      tag.addClass('stick');
    }
    else {
      tag.removeClass('stick');
    }
  });

  $('.sidebar-sticky').each(function() {
    let tag = $(this);
    toggleStickClass(tag);
  });

  $('.header.fadeout').css('opacity', (1-window_top-200 / window.innerHeight) );

  prevOffsetTop = window_top;
};

if ( $('[data-navbar="fixed"], [data-navbar="sticky"], [data-navbar="smart"]').length ) {
  scrollOffsetTop = navbarHeight;
}

windowScrollActions();
$(window).on('scroll', function() {
  windowScrollActions()
});

// SMOOTH SCROLL
$(document).on( 'click', "a[href^='#']", function() {
  if ($(this).attr('href').length < 2) {
    return;
  }

  if ($(this)[0].hasAttribute('data-toggle')) {
    return;
  }

  let target = $($(this).attr('href'));
  if (target.length) {
    let targetTop = target.offset().top,
        windowTop = $(window).scrollTop();

    if (targetTop > windowTop && $('.navbar[data-navbar="smart"]').length) {
      smoothlyScrollTo(targetTop);
    }
    else {
      smoothlyScrollTo(targetTop - scrollOffsetTop);
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

// SCROLLSPY
$('body').scrollspy({
  target: '.nav-sidebar',
  offset: 100
});
