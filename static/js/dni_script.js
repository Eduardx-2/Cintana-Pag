let bs_image = null;
let bs_firm = null;

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    canvas2 = document.getElementById('canvas2'),
    ctx2 = canvas2.getContext('2d'),

    cw = window.innerWidth,
    ch = window.innerHeight,
    charArr = ['S', 'O', 'F', 'T', 'B', 'I', 'D'],
    maxCharCount = 100,
    fallingCharArr = [],
    fontSize = 10,
    maxColums = cw / fontSize;

canvas.width = canvas2.width = cw;
canvas.height = canvas2.height = ch;


window.addEventListener('resize', function () {
    cw = window.innerWidth;
    ch = window.innerHeight;
    canvas.width = canvas2.width = cw;
    canvas.height = canvas2.height = ch;
    maxColums = cw / fontSize;
    
    fallingCharArr = [];
    for (var i = 0; i < maxColums; i++) {
        fallingCharArr.push(new Point(i * fontSize, randomFloat(-500, 0)));
    }
});

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.draw = function (ctx) {
    this.value = charArr[randomInt(0, charArr.length - 1)].toUpperCase();
    this.speed = randomFloat(1, 5);

    ctx2.fillStyle = "rgba(255,255,255,0.8)";
    ctx2.font = fontSize + "px san-serif";
    ctx2.fillText(this.value, this.x, this.y);

    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px san-serif";
    ctx.fillText(this.value, this.x, this.y);

    this.y += this.speed;
    if (this.y > ch) {
        this.y = randomFloat(-100, 0);
        this.speed = randomFloat(2, 5);
    }
};

for (var i = 0; i < maxColums; i++) {
    fallingCharArr.push(new Point(i * fontSize, randomFloat(-500, 0)));
}

var update = function () {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, cw, ch);

    ctx2.clearRect(0, 0, cw, ch);

    var i = fallingCharArr.length;

    while (i--) {
        fallingCharArr[i].draw(ctx);
    }

    requestAnimationFrame(update);
};

update();


function toggleIconAnimation(input) {
    const label = input.previousElementSibling;
    const icon = label.querySelector('i');

    document.querySelectorAll('i').forEach(i => i.classList.remove('icon-animated'));
    icon.classList.add('icon-animated');
}

document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('focus', () => toggleIconAnimation(element));
});

document.getElementById('photo').addEventListener('change', function (event) {
    const photoPreview = document.getElementById('photo-preview');
    photoPreview.src = URL.createObjectURL(event.target.files[0]);
    photoPreview.style.display = 'block';

    const reader = new FileReader();
    reader.onloadend = function () {
        const base64String = reader.result;
        bs_firm = base64String.split(',')[1];
    };
    reader.readAsDataURL(event.target.files[0]);
});

document.getElementById('signature').addEventListener('change', function (event) {
    const signaturePreview = document.getElementById('signature-preview');
    signaturePreview.src = URL.createObjectURL(event.target.files[0]);
    signaturePreview.style.display = 'block';

    const reader = new FileReader();
    reader.onloadend = function () {
        const base64String = reader.result;
        bs_image = base64String.split(',')[1];
    };
    reader.readAsDataURL(event.target.files[0]);
});

document.getElementById('fingerprint').addEventListener('change', function (event) {
    const fingerprintPreview = document.getElementById('fingerprint-preview');
    fingerprintPreview.src = URL.createObjectURL(event.target.files[0]);
    fingerprintPreview.style.display = 'block';
});

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day} ${month} ${year}`;
}

async function btn_generate() {
    const acces_id = ["docNumber", "middleName", "lastName", "firstName",
        "birthday",
        "revision",
        "optionalData1",
        "cuit",
        "dataInscrip",
        "issueDate",
        "expiryDate"];
    const json_send = [];
    for (let i = 0; i < acces_id.length; i++) {
        let name = document.getElementById(`${acces_id[i]}`).value;
        if (/^\d{4}-\d{2}-\d{2}$/.test(name)) {
            name = formatDate(name); // Formatear la fecha a "DD MM YYYY"
        }
        json_send.push(name);
    }

    let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json"
    };

    let bodyContent = {
        "loadInfo": json_send,
        "loadPais": "pe",
        "images": {
            "person_img": bs_image,
            "firma_img": bs_firm
        }
    };

    let response = await fetch("http://127.0.0.1:9084/image/person/ident", {
        method: "POST",
        body: JSON.stringify(bodyContent),
        headers: headersList
    });

    const json_rs = await response.json();
    const link = document.getElementById("link_install");
    link.href = "data:image/png;base64," + json_rs.image_doc;
    link.download = "imagen_prueba.png";
    console.log(json_rs.image_doc);
}