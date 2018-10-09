let $ = require('jquery');
let hashPattern = /\#.+/;
let trailingSlashPattern = /\/$/;

require('bootstrap');

$(() => {
  let pathname = window.location.pathname.replace(trailingSlashPattern, '');
  let body = $('body');
  let navbar = $('.navbar');

  let navbarToggle = () => {
    body.toggleClass('navbar-open');
    if (body.hasClass('navbar-open')) {
      navbar.prepend('<div class="backdrop backdrop-navbar"></div>');
    }
  }

  let navbarClose = () => {
    body.removeClass('navbar-open');
    $('.backdrop-navbar').remove();
  }

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
  })

  let counter = 100
  $('.index-post').each((_, item) => {
    setTimeout(() => $(item).addClass('loaded'), (counter += 100))
  })
})
