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

const words = [
    'Dev',
    'GameDev',
    'Web',
    'Design',
    'Tech',
    'Code',
    'Build',
    'Responsive',
    'Programming',
    'FullStack',
    'Backend',
    'Frontend',
    'Databases',
    'Animation',
    'Creative',
    'Digital',
];

const wordElements = [];

function getViewArea(){
    const container = document.getElementById('container');
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

            symbolElement.vx = (Math.random() - 0.5) * 2 * speedMul;
            symbolElement.vy = (Math.random() - 0.5) * 2 * speedMul;

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

        symbol.style.left = (mouse.x + Math.cos(angle) * radius) + 'px';
        symbol.style.top  = (mouse.y + Math.sin(angle) * radius) + 'px';
    }
}

function animateSymbols() {
    const area = getViewArea();

    symbolElements.forEach(symbol => {
        let left = parseFloat(symbol.style.left);
        let top = parseFloat(symbol.style.top);
        
        left += symbol.vx;
        top += symbol.vy;
        
        const symbolRect = symbol.getBoundingClientRect();
        const symbolWidth = symbolRect.width;
        const symbolHeight = symbolRect.height;

        if (left <= 0) {
            symbol.vx = Math.abs(symbol.vx);
            left = 0;
        }
        
        if (left + symbolWidth >= area.width) {
            symbol.vx = -Math.abs(symbol.vx); 
            left = area.width - symbolWidth;
        }
        
        if (top <= 0) {
            symbol.vy = Math.abs(symbol.vy);
            top = 0;
        }

        if (top + symbolHeight >= area.height) {
            symbol.vy = -Math.abs(symbol.vy);
            top = area.height - symbolHeight;
        }
        
        symbol.style.left = left + 'px';
        symbol.style.top = top + 'px';
        
        animatesymbolsmouse(symbol, left, top, 40);
    });
    
    requestAnimationFrame(animateSymbols);
}

createSymbols(symbols, 3, 2.8, 1.5, 1.25);
animateSymbols();

function collides(x, y, w, h, p){
    const padded = {
        x: x - p,
        y: y - p,
        width: w + p * 2,
        height: h + p * 2
    };

    for(let we of wordElements){
        const wePadded = {
            x: we.x - p,
            y: we.y - p,
            width: we.width + p * 2,
            height: we.height + p * 2
        };
        const overlapX = padded.x < wePadded.x + wePadded.width && padded.x + padded.width > wePadded.x;
        const overlapY = padded.y < wePadded.y + wePadded.height && padded.y + padded.height > wePadded.y;
        if (overlapX && overlapY) { return true; }
    }
    return false;
}

function createWords(words, number, layer, margin) {
    const area = getViewArea();
    const copies = Math.floor(Math.random() * number) + 1;
    
    for(let word of words){
        for(let i = 0; i < copies; i++){
            const temp = document.createElement('div');
            temp.className = 'words ' + layer + ' glow';
            temp.textContent = word;
            temp.style.position = "absolute";
            container.appendChild(temp);

            const w = temp.offsetWidth;
            const h = temp.offsetHeight;

            container.removeChild(temp);

            let x, y, tries = 0;
            do {
                x = Math.round(margin + Math.random() * (area.width - w - margin * 2));
                y = Math.round(margin + Math.random() * (area.height - h - margin * 2));
                tries++;
            } while (collides(x, y, w, h, 5) && tries < 200);
            if (tries >= 200) continue;

            const wordElement = document.createElement('div');
            wordElement.className = 'words';
            wordElement.classList.add(`${layer}`)
            wordElement.classList.add('glow');
            wordElement.classList.add('floating')
            wordElement.textContent = word;
            wordElement.style.left = x + 'px';
            wordElement.style.top = y + 'px';

            wordElement.x = parseFloat(wordElement.style.left);
            wordElement.y = parseFloat(wordElement.style.top);
            wordElement.width = wordElement.offsetWidth;
            wordElement.height = wordElement.offsetHeight;


            container.appendChild(wordElement);
            wordElements.push({ el: wordElement, x, y, width: w, height: h });
        }
    }
}

createWords(words, 10, 'words-layer', 20);

let resizeTimeout;

window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        wordElements.forEach(we => container.removeChild(we.el));
        wordElements.length = 0;
        createWords(words, 10, 'words-layer', 20);
    }, 200);
});


});
