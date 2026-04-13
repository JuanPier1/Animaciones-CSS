$(document).ready(function(){
    
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
    console.log("area: " + area);
    const copies = Math.floor(Math.random() * number) + 1;
    
    console.log(" copies: " + copies + " words: " + copies* words.length);
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
            //console.log("X ",x,"Y ",y);
            //console.log("tries", tries);

            const wordElement = document.createElement('div');
            wordElement.className = 'words';
            wordElement.classList.add(`${layer}`)
            wordElement.classList.add('glow');
            wordElement.classList.add('floating')
            wordElement.textContent = word;
            wordElement.style.left = x + 'px';
            wordElement.style.top = y + 'px';
            //wordElement.style.border = '1px solid red';

            //Guardar pos
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
        //Limpiar y crear
        wordElements.forEach(we => container.removeChild(we.el));
        wordElements.length = 0;
        createWords(words, 10, 'words-layer', 20);
    }, 200);
});

})