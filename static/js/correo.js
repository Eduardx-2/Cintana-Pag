function copyEmail() {
    var emailField = document.getElementById("email");
    navigator.clipboard.writeText(emailField.value)
        .then(() => alert("Correo copiado: " + emailField.value))
        .catch(() => alert("Error al copiar el correo"));
}

function refreshEmail() {
    var emailField = document.getElementById("email");

    emailField.value = "cargando...";
    setTimeout(function() {
        var newEmail = "cargando..." 
        emailField.value = newEmail;
        alert("Nuevo correo generado: " + newEmail);
    }, 2000);

    var messages = document.getElementById("messages");
    messages.innerHTML = "<p>No hay mensajes aún</p>";
}

function changeEmail() {
    alert('Función de cambio pendiente');
}

function deleteEmail() {
    document.getElementById("email").value = "";
    alert('Correo eliminado');
}
var c = document.getElementById('c');
var cxt = c.getContext("2d");

c.width = window.innerWidth;
c.height = window.innerHeight;



var chinese = "SOFBIRTD";
chinese = chinese.split("");

var font_size =10;
var columns = c.width/font_size; 

var drops = [];

for(var x=0;x<columns;x++){
  drops[x]=1;
}

function draw(){
  cxt.fillStyle="rgba(0,0,0,0.05)";
  cxt.fillRect(0,0,c.width,c.height);
  
  cxt.fillStyle = "#0F0";
  cxt.font = font_size+'px arial';
  
  
  for(var i=0;i<drops.length;i++){
    var text = chinese[Math.floor(Math.random()*chinese.length)];
    cxt.fillText(text,i*font_size,drops[i]*font_size);
    
    if(drops[i]*font_size>c.height && Math.random() >0.975)
      drops[i]=0;
    

    drops[i]++;
}
  
}
setInterval(draw,33);