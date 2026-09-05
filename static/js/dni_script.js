let bs_image = null;
let bs_firm = null;

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

    let response = await fetch("http://127.0.0.1:9081/image/person/ident", {
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