(function() {
  console.log('inject.js');
  
  window.addEventListener('load', onLoad);
  
  function onLoad() {
    var body = document.body;
    
    // This demonstration serves the iframe from the same host, for simplicity.
    // However the iframe allows to be loaded from cross-origin.
    var frame = document.createElement('iframe');
    frame.src = '/frame.html';

    frame.style.border = 'none';
    frame.style.width = '450px';
    frame.style.height = '100%';

    frame.style.position = 'fixed';
    frame.style.right = '0';
    frame.style.bottom = '0';
    frame.style.top = '0';
    
    frame.scrolling = 'no';
    
    body.appendChild(frame);
  }
})();