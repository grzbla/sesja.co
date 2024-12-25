const elts = {
    text1: document.getElementById("text1"),
    text2: document.getElementById("text2")
};

const texts = [
    "sesja.co",
    "is booting up",
    "     -     ",
    "   - - -   ",
    " - - - - - ",
    "actually not really",
    "'cause i'm just loadin'",
    "alright, gonna loop meself now"
];

const morphTime = 1;
const cooldownTime = 2;

let textIndex = texts.length - 1;
let time = new Date();
let morph = 0;
let cooldown = cooldownTime;

elts.text1.textContent = texts[textIndex % texts.length];
elts.text2.textContent = texts[(textIndex + 1) % texts.length];

function doMorph() {
    morph -= cooldown;
    cooldown = 0;

    let fraction = morph / morphTime;

    if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
    }

    setMorph(fraction);
}

function setMorph(fraction) {
    elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    fraction = 1 - fraction;
    elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    elts.text1.textContent = texts[textIndex % texts.length];
    elts.text2.textContent = texts[(textIndex + 1) % texts.length];
}

function doCooldown() {
    morph = 0;

    elts.text2.style.filter = "";
    elts.text2.style.opacity = "100%";

    elts.text1.style.filter = "";
    elts.text1.style.opacity = "0%";
}

function animate() {
    if (window.loading == 'stahp')
        return;
    requestAnimationFrame(animate);

    let newTime = new Date();
    let shouldIncrementIndex = cooldown > 0;
    let dt = (newTime - time) / 1000;
    time = newTime;

    cooldown -= dt;

    if (cooldown <= 0) {
        if (shouldIncrementIndex) {
            textIndex++;
        }

        doMorph();
    } else {
        doCooldown();
    }
}

animate();

console.log("ass");

function init() {
    let canvas = document.querySelector('[blobs]');
    console.log(canvas);
    context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    $('.container').addEventListener('mousemove', MouseMove, false);

    mouse = {
        x: 0,
        y: 0
    }
    particleHolder = [];
    x = 100;
    y = 100;
    angle = 0.2;
    radius = 80;
    particleCount = 1000;
    color = [
        'rgba( 31, 48, 56,0.5)',
        'rgba( 22, 28, 30,0.5)',
        'rgba( 27, 38, 42,0.5)',
        'rgba( 32, 57, 69,0.5)',
        'rgba( 32, 66, 83,0.5)',
        'rgba( 88, 83, 47,0.5)',
        'rgba( 48, 46, 34,0.5)',
        'rgba( 67, 64, 42,0.5)',
        'rgba(110,102, 48,0.5)',
        'rgba(131,120, 46,0.5)',
        'rgba( 77, 41, 54,0.5)',
        'rgba( 42, 30, 34,0.5)',
        'rgba( 58, 37, 45,0.5)',
        'rgba( 95, 42, 62,0.5)',
        'rgba(114, 40, 67,0.5)',
        'rgba( 88, 69, 47,0.5)',
        'rgba( 48, 42, 34,0.5)',
        'rgba( 67, 55, 42,0.5)',
        'rgba(110, 81, 48,0.5)',
        'rgba(131, 91, 46,0.5)'
    ];


    function MouseMove(event) {
        mouse.x = event.pageX - canvas.offsetLeft;
        mouse.y = event.pageY - canvas.offsetLeft;
    }
    for (i = 0; i < particleCount; i++) {
        particleHolder.push(new generateParticles());
    }

    function generateParticles() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.color = color[Math.floor(Math.random() * color.length)];
        this.rad = Math.floor(Math.random() * 8);
    }

    function vibrate() {

        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        for (var j = 0; j < particleHolder.length; j++) {
            var p = particleHolder[j];
            var distanceX = p.x - mouse.x;
            var distanceY = p.y - mouse.y;
            particleDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            particleMouse = Math.max(Math.min(75 / (particleDistance / p.rad), 10), 0.1);
            context.beginPath();
            context.fillStyle = p.color;
            context.arc(p.x + Math.sin(angle++ * Math.cos(radius++)),
                p.y - Math.cos(angle++ * Math.sin(radius++)),
                p.rad * particleMouse, Math.PI * 2, false);
            context.fill();
        }
    }
    setInterval(vibrate, 30);
};

init()
