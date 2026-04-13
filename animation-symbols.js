$(document).ready(function(){

const symbols = [
    '🚀',
    '🖥️',
    '🌐',
    '🎮',
    '👾',
    '🐻',
    '✨',
    '🃏'
];

const symbolElements = [];

function getViewArea(){
    const rect = container.getBoundingClientRect();

    return {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height
    };
}

function createSymbols(symbols, number, max, min, speedMul){
    const area = getViewArea();

    //console.log("Area:", area);
    
    for(let i = 0; i < symbols.length; i++){
        const symbol = symbols[i];
        const copies = Math.floor(Math.random() * number) + 1;
        const size = (Math.random() * (max - min) + min);

        for(let j = 0; j < copies; j++){
            const symbolElement = document.createElement('div');
            symbolElement.className = 'symbols';
            symbolElement.textContent = symbol;
            symbolElement.style.fontSize = size + 'rem';
            symbolElement.classList.add('rotate');

            const safeWidth = Math.max(area.width - size, 10);
            const safeHeight = Math.max(area.height - size, 10);

            if (safeWidth > 0 && safeHeight > 0) {
                symbolElement.style.left = (Math.random() * safeWidth) + 'px';
                symbolElement.style.top = (Math.random() * safeHeight) + 'px';
            } else {
                symbolElement.style.left = '50%';
                symbolElement.style.top = '50%';
                symbolElement.style.transform = 'translate(-50%, -50%)';
            }

            //symbolElement.style.left = (Math.random() * (area.width - 50)) + 'px';
            //symbolElement.style.top = (Math.random() * (area.height - 50)) + area.top + 'px';
            
            symbolElement.vx = (Math.random() - 0.5) * 2 * speedMul;
            symbolElement.vy = (Math.random() - 0.5) * 2 * speedMul;
            //symbolElement.style.border = '1px solid red';

            container.appendChild(symbolElement);
            symbolElements.push(symbolElement);
        }
    }
}

let mouse = {
    x: 0,
    y: 0
};

container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    //console.log(mouse);
});

container.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
}, { passive: false });

function animatesymbolsmouse(symbol, left, top, radius){
    const dx = left - mouse.x;
    const dy = top - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < radius && dist > 0) {
        const angle = Math.atan2(dy, dx);
        const dot = symbol.vx * Math.cos(angle) + symbol.vy * Math.sin(angle);

        if (dot < 0) {
            symbol.vx -= 2 * dot * Math.cos(angle);
            symbol.vy -= 2 * dot * Math.sin(angle);
        }

        // Sacar si quedó atrapado dentro
        symbol.style.left = (mouse.x + Math.cos(angle) * radius) + 'px';
        symbol.style.top  = (mouse.y + Math.sin(angle) * radius) + 'px';
    }
        /*
        if (dist < newDistance) {
            const angle = Math.atan2(dy, dx);
            symbol.vx += Math.cos(angle) * 1.5;
            symbol.vy += Math.sin(angle) * 1.5;
        }
        */
}

function animateSymbols() {
    const area = getViewArea();
    //console.log("Animating in area:", area);

    symbolElements.forEach(symbol => {
        // Obtener posición actual
        let left = parseFloat(symbol.style.left);
        let top = parseFloat(symbol.style.top);
        
        // Mover símbolo
        left += symbol.vx;
        top += symbol.vy;
        
        // Detectar colisiones con los bordes y rebotar
        const symbolRect = symbol.getBoundingClientRect();
        const symbolWidth = symbolRect.width;
        const symbolHeight = symbolRect.height;
        
        // REBOTES CORRECTOS (dentro del contenedor)
        // Rebote izquierda
        if (left <= 0) {
            symbol.vx = Math.abs(symbol.vx);
            left = 0;
        }
        
        // Rebote derecha
        if (left + symbolWidth >= area.width) {
            symbol.vx = -Math.abs(symbol.vx); 
            left = area.width - symbolWidth;
        }
        
        // Rebote arriba
        if (top <= 0) {
            symbol.vy = Math.abs(symbol.vy);
            top = 0;
        }
        
        // Rebote abajo
        if (top + symbolHeight >= area.height) {
            symbol.vy = -Math.abs(symbol.vy);
            top = area.height - symbolHeight;
        }
        
        // Aplicar nueva posición
        symbol.style.left = left + 'px';
        symbol.style.top = top + 'px';
        
        //mouse repulsion
        animatesymbolsmouse(symbol, left, top, 40);
    });
    
    requestAnimationFrame(animateSymbols);
}

createSymbols(symbols, 3, 2.8, 1.5, 1.25);
animateSymbols();

});
