window.addEventListener('load',() => {
  function writeAnimation(element, html, speed = 50) {
    let i = 0;
    let tempText = '';
    let inTag = false;
    element.innerHTML = '';
  
    function type() {
      if (i < html.length) {
        const char = html.charAt(i);
        if (char === '<') inTag = true;
        if (char === '>') inTag = false;
  
        tempText += char;
        i++;
        element.innerHTML = tempText + '<span id="cursorTrack"></span>';
  
        setTimeout(type, inTag ? 0 : speed);
      } else {
        setTimeout(() => {
          writing = false;
        }, 2000);
      }
    }
  
    type();
  }
  

  let x = 0;
  let y = 0;

  let writing = true;
  function moveFeatherAnimation() {
    const feather = document.getElementById('feather');
    const cursor = document.getElementById('cursorTrack');

    if (!writing) {
      feather.remove();
      return;
    }

    if (!feather || !cursor) {
      requestAnimationFrame(moveFeatherAnimation);
      return;
    }

    const rect = cursor.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x += (centerX - x) * 0.2;
    y += (centerY - y) * 0.2;

    feather.style.visibility = 'visible';
    feather.style.left = `${x - feather.offsetWidth / 2}px`;
    feather.style.top = `${(y - feather.offsetHeight / 2) - 50}px`;

    requestAnimationFrame(moveFeatherAnimation);
  }
    
  writeAnimation(document.querySelector('h1'),'<span id="tecWord">Técnologia</span><br>' +
    ' é a escrita da ' + '<br> <span id="evoWord">evolução</span>');
  
  moveFeatherAnimation();
});
