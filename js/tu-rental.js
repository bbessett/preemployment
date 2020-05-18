function toggleNav() {
  document.body.classList.toggle("menuOpen");
}

// ****** Affix header on window scroll ******//

window.onscroll = function changeNav() {
  var navBar = document.getElementById('shareableHeader');
  var navBarHeight = navBar.getBoundingClientRect().height;
  var scrollPosY = window.pageYOffset | document.body.scrollTop;

  if (scrollPosY > (navBarHeight / 10)) {
    navBar.classList.add("affix");
  } else if (scrollPosY <= navBarHeight) {
    navBar.classList.remove("affix");
  }
}

// ****** Carousel active button toggle ******//

function toggleActive(e) {
  document.querySelectorAll("a.control-btn").forEach(function (item) {
    item.classList.remove("active");
  })
  e.target.classList.add("active");
};


// ****** Modal open ******//
  // Function to make IE9+ support forEach:
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
  // Open modal
  document.querySelectorAll('.modalLink').forEach(function(el){
    el.addEventListener('click', function() {
      let trigger = this.getAttribute('data-target');
      const modal = document.getElementById(trigger);
      modal.classList.add('modalOpen');
      modal.setAttribute('aria-hidden', 'false');
    });
  });



// ****** Modal close ******//

function closeModal() {

  const modals = document.getElementsByClassName('modal-overlay');

  for (var i = 0; i < modals.length; i++) {
    modals[i].classList.remove('modalOpen');
    modals[i].setAttribute('aria-hidden', 'true');
  }

}