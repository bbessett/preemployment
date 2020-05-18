
// ****** Defer images ******//
function initImg() {
  var imgDefer = document.getElementsByTagName('img');
  for (var i = 0; i < imgDefer.length; i++) {
    if (imgDefer[i].getAttribute('data-src')) {
      imgDefer[i].setAttribute('src', imgDefer[i].getAttribute('data-src'));
    }
  }
}

// ****** Defer Video ******//
function initVideo() {
  var videoDefer = document.getElementsByTagName('iframe');
  for (var i = 0; i < videoDefer.length; i++) {
    if (videoDefer[i].getAttribute('data-src')) {
      videoDefer[i].setAttribute('src', videoDefer[i].getAttribute('data-src'));
    }
  }
}

window.addEventListener('scroll', function() {
  initImg();
  initVideo();
});