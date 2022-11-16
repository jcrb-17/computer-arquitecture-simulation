let table = document.createElement("table");
let body = document.querySelector("body");
let tr = document.createElement("tr");
tr.innerHTML = "<th>Dirección</th><th>Contenido</th>";
body.appendChild(table);

const valorMaxNPositivo = Math.pow(2, 31) - 1;
const valorMaxNNegativo = -Math.pow(2, 31);

let pantalla = document.querySelector(".pantalla");

let operacionP = document.querySelector("#operacion");

let ej1 = document.getElementById("ej1");
let ej2 = document.getElementById("ej2");
let ej3 = document.getElementById("ej3");

let velocidad = document.getElementById("velocidad");

table.appendChild(tr);
for (let i = 0; i < 128; i++) {
  let tr = document.createElement("tr");
  tr.innerHTML =
    "<td class='casilla'>" +
    i +
    "</td><td><input class='inputMem' type='text' value='000000000000000000000000000010011'></td>";

  table.appendChild(tr);
}

let EAX = document.querySelector("#eax");
let paso = document.querySelector("#paso");
let regPC = document.querySelector("#pc");
regPC.value = 0;

let banderas = document.querySelector("#banderas");

let igual = document.querySelector("#igual");
let mayor = document.querySelector("#mayor");
let sobreflujo = document.querySelector("#sobreflujo");

let ir = document.querySelector("#ir");

let continuo = document.querySelector("#continuo");

let PARAR = 0;

function pintarCeldaMemoria() {
  let casilla = document.querySelectorAll(".casilla");
  for (let i = 0; i < casilla.length; i++) {
    if (regPC.value == i) {
      casilla[i].style.background = "yellow";
    } else {
      casilla[i].style.background = "white";
    }
  }
}

function extraerInstruccion() {
  let inputMem = document.querySelectorAll(".inputMem");
  alert(inputMem[regPC.value].value);
}

function ejecutarInstruccion() {
  let inputMem = document.querySelectorAll(".inputMem");
  let i = inputMem[regPC.value].value;
  ir.value = i;

  if (i[1] == "0" && i[2] == "0" && i[3] == "0" && i[4] == "0" && i[5] == "0") {
    operacionP.textContent = "load";

    let dir = extraerDireccion(i);

    EAX.value = inputMem[dir].value;
    console.log(EAX.value);
  } else if (
    i[1] == "0" &&
    i[2] == "0" &&
    i[3] == "0" &&
    i[4] == "0" &&
    i[5] == "1"
  ) {
    operacionP.textContent = "store";

    let dir = extraerDireccion(i);

    inputMem[dir].value = EAX.value;
  } else if (
    i[1] == "0" &&
    i[2] == "0" &&
    i[3] == "0" &&
    i[4] == "1" &&
    i[5] == "0"
  ) {
    operacionP.textContent = "suma";

    let dir = extraerDireccion(i);

    let val2 = stringBinaryToDecimal(inputMem[dir].value);

    let suma = stringBinaryToDecimal(EAX.value) + val2;

    console.log(suma);
    llenarBanderas(stringBinaryToDecimal(EAX.value), val2);
    if (suma > 0) {
      if (suma <= valorMaxNPositivo) {
        EAX.value = decimalABinario(suma);

        sobreflujo.value = "0";
      } else {
        sobreflujo.value = "1";
      }
    }
    if (suma < 0) {
      if (suma >= valorMaxNNegativo) {
        EAX.value = decimalABinario(suma);

        sobreflujo.value = "0";
      } else {
        sobreflujo.value = "1";
      }
    }
  } else if (
    i[1] == "0" &&
    i[2] == "0" &&
    i[3] == "1" &&
    i[4] == "0" &&
    i[5] == "0"
  ) {
    operacionP.textContent = "multiplicar";

    let dir = extraerDireccion(i);

    let val2 = stringBinaryToDecimal(inputMem[dir].value);

    let multip = stringBinaryToDecimal(EAX.value) * val2;

    console.log(multip);
    llenarBanderas(stringBinaryToDecimal(EAX.value), val2);
    if (multip > 0) {
      if (multip <= valorMaxNPositivo) {
        EAX.value = decimalABinario(multip);

        sobreflujo.value = "0";
      } else {
        sobreflujo.value = "1";
      }
    }
    if (multip < 0) {
      if (multip >= valorMaxNNegativo) {
        EAX.value = decimalABinario(multip);

        sobreflujo.value = "0";
      } else {
        sobreflujo.value = "1";
      }
    }
  } else if (
    i[1] == "0" &&
    i[2] == "0" &&
    i[3] == "1" &&
    i[4] == "0" &&
    i[5] == "1"
  ) {
    operacionP.textContent = "división";

    let dir = extraerDireccion(i);

    let val2 = stringBinaryToDecimal(inputMem[dir].value);

    let division = Math.floor(stringBinaryToDecimal(EAX.value) / val2);

    console.log(division);
    llenarBanderas(stringBinaryToDecimal(EAX.value), val2);
    if (division > 0) {
      if (division <= valorMaxNPositivo) {
        EAX.value = decimalABinario(division);

        sobreflujo.value = "0";
      } else {
        sobreflujo.value = "1";
      }
    }
    if (division < 0) {
      if (division >= valorMaxNNegativo) {
        EAX.value = decimalABinario(division);

        sobreflujo.value = "0";
      } else {
        sobreflujo.value = "1";
      }
    }
  } else if (
    i[1] == "0" &&
    i[2] == "0" &&
    i[3] == "1" &&
    i[4] == "1" &&
    i[5] == "0"
  ) {
    operacionP.textContent = "JMP si eax > dir1";

    let dir = extraerDireccion(i);

    let val2 = stringBinaryToDecimal(inputMem[dir].value);

    let eaxtemp = stringBinaryToDecimal(EAX.value);
    let suma = eaxtemp + val2;

    console.log(suma);
    llenarBanderas(eaxtemp, val2);

    if (mayor.value == "1") {
      i = mayorDir(i, true);
    } else {
      i = mayorDir(i, false);
    }
    console.log("instruccion mod " + i);
  } else if (
    i[1] == "0" &&
    i[2] == "1" &&
    i[3] == "0" &&
    i[4] == "0" &&
    i[5] == "0"
  ) {
    operacionP.textContent = "imprimir";

    let dir = extraerDireccion(i);

    let eaxtemp = stringBinaryToDecimal(EAX.value);

    let p = document.createElement("p");
    p.textContent = eaxtemp;
    pantalla.appendChild(p);
  } else if (
    i[1] == "0" &&
    i[2] == "1" &&
    i[3] == "0" &&
    i[4] == "0" &&
    i[5] == "1"
  ) {
    operacionP.textContent = "parar";

    PARAR = 1;
  } else if (
    i[1] == "0" &&
    i[2] == "1" &&
    i[3] == "0" &&
    i[4] == "1" &&
    i[5] == "0"
  ) {
    operacionP.textContent = "AND";

    let dir = extraerDireccion(i);

    let val2 = inputMem[dir].value;
    console.log(val2);
    EAX.value = AND(EAX.value, val2);
  } else if (
    i[1] == "0" &&
    i[2] == "1" &&
    i[3] == "0" &&
    i[4] == "1" &&
    i[5] == "1"
  ) {
    operacionP.textContent = "OR";

    let dir = extraerDireccion(i);

    let val2 = inputMem[dir].value;
    console.log(val2);
    EAX.value = OR(EAX.value, val2);
  } else if (
    i[1] == "0" &&
    i[2] == "1" &&
    i[3] == "1" &&
    i[4] == "0" &&
    i[5] == "0"
  ) {
    operacionP.textContent = "XOR";

    let dir = extraerDireccion(i);

    let val2 = inputMem[dir].value;
    console.log(val2);
    EAX.value = XOR(EAX.value, val2);
  } else if (
    i[1] == "0" &&
    i[2] == "1" &&
    i[3] == "1" &&
    i[4] == "0" &&
    i[5] == "1"
  ) {
    operacionP.textContent = "NOT";
    EAX.value = NOT(EAX.value);
  } else if (
    i[1] == "0" &&
    i[2] == "1" &&
    i[3] == "1" &&
    i[4] == "1" &&
    i[5] == "0"
  ) {
    operacionP.textContent = "JMP si eax == dir1";

    let dir = extraerDireccion(i);

    let val2 = stringBinaryToDecimal(inputMem[dir].value);

    let eaxtemp = stringBinaryToDecimal(EAX.value);
    let suma = eaxtemp + val2;

    console.log(suma);
    llenarBanderas(eaxtemp, val2);

    if (igual.value == "1") {
      i = mayorDir(i, true);
    } else {
      i = mayorDir(i, false);
    }
    console.log("instruccion mod " + i);
  } else if (
    i[1] == "1" &&
    i[2] == "1" &&
    i[3] == "1" &&
    i[4] == "1" &&
    i[5] == "1"
  ) {
    operacionP.textContent = "JMP incondicional";
  }
  direccionPC(i);
}

function AND(val1, val2) {
  let res = "";
  console.log(val1 + " " + val2);
  for (let i = 0; i < val1.length; i++) {
    console.log(val1[i] + " " + val2[i]);
    if (val1[i] == "1" && val2[i] == "1") {
      res += "1";
      continue;
    } else if (val1[i] == "0" && val2[i] == "0") {
      res += "0";
      continue;
    } else if (val1[i] != val2[i]) {
      res += "0";
      continue;
    }
  }
  console.log("AND " + res);
  return res;
}

function XOR(val1, val2) {
  let res = "";
  console.log(val1 + " " + val2);
  for (let i = 0; i < val1.length; i++) {
    console.log(val1[i] + " " + val2[i]);
    if ((val1[i] == "1") ^ (val2[i] == "1")) {
      res += "1";
      continue;
    } else {
      res += "0";
      continue;
    }
  }
  console.log("XOR " + res);
  return res;
}

function OR(val1, val2) {
  let res = "";
  console.log(val1 + " " + val2);
  for (let i = 0; i < val1.length; i++) {
    console.log(val1[i] + " " + val2[i]);
    if (val1[i] == "1" || val2[i] == "1") {
      res += "1";
      continue;
    } else {
      res += "0";
      continue;
    }
  }
  console.log("OR " + res);
  return res;
}

function NOT(val1) {
  let res = "";
  for (let i = 0; i < val1.length; i++) {
    if (val1[i] == "1") {
      res += "0";
    } else {
      res += "1";
    }
  }
  console.log(res);
  return res;
}

function mayorDir(i, mayor) {
  let aux = "";
  for (let j = 0; j < 13; j++) {
    aux += i[j];
  }
  if (mayor == true) {
    aux += "1";
  } else {
    aux += "0";
  }
  for (let j = 14; j < i.length; j++) {
    aux += i[j];
  }
  return aux;
}

function llenarBanderas(val1, val2) {
  console.log("llenar banderas " + val1 + " " + val2);
  if (val1 == val2) {
    igual.value = "1";
  } else if (val1 != val2) {
    igual.value = "0";
    if (val1 > val2) {
      mayor.value = "1";
    } else {
      mayor.value = "0";
    }
  }
}

function extraerDireccion(dato) {
  let dir = "";
  for (let j = 6; j <= 12; j++) {
    dir += dato[j];
  }
  return stringBinaryToDecimal2(dir);
}

function direccionPC(dato) {
  if (dato[13] == "0") {
    regPC.value = parseInt(regPC.value) + 1;
  } else if (dato[13] == "1") {
    let dir = "";
    for (let i = 14; i <= 20; i++) {
      dir += dato[i];
    }
    dir = stringBinaryToDecimal2(dir);

    regPC.value = dir;
  }
}

paso.addEventListener("click", function () {
  pintarCeldaMemoria();
  ejecutarInstruccion();
});

continuo.addEventListener("click", function () {
  setInterval(f1, velocidad.value);
});

function f1() {
  if (PARAR == 1) {
    clearInterval();
  } else {
    pintarCeldaMemoria();
    ejecutarInstruccion();
  }
}

function stringBinaryToDecimal(dato) {
  if (dato[0] == "0" || dato[0] == "1") {
    if (dato[1] == "0") {
      let res = 0;
      let contador = 0;
      for (let i = dato.length - 1; i > 1; i--) {
        if (dato[i] == "1") {
          res += Math.pow(2, contador);
          contador++;
          continue;
        }
        contador++;
        continue;
      }

      return res;
    } else if (dato[1] == "1") {
      let aux = "";
      for (let i = 1; i < dato.length; i++) {
        if (dato[i] == "1") {
          aux += "0";
        } else if (dato[i] == "0") {
          aux += "1";
        }
      }
      aux = stringBinaryToDecimal2(aux);
      aux += 1;
      aux *= -1;

      return aux;
    }
  } else if (dato[0] == "1") {
    let aux = "";
    for (let i = 2; i <= 9; i++) {
      aux += dato[i];
    }

    let mantissa = "";
    for (let i = 10; i < dato.length; i++) {
      mantissa += dato[i];
    }
    if (aux == "11111111") {
      if (mantissa == "00000000000000000000000") {
        if (dato[1] == "1") {
          return -Infinity;
        } else {
          return Infinity;
        }
      } else {
        return NaN;
      }
    }

    aux = stringBinaryToDecimal2(aux);
    let exp = aux - 127;
    exp = Math.pow(2, exp);
    alert("exp " + exp);

    let e = -1;
    let val = 0.0;
    for (let i = 10; i < dato.length; i++) {
      if (dato[i] == "1") {
        val += Math.pow(2, e);
        e--;
        continue;
      }
      e--;
    }

    alert("val " + val);
    val += 1.0;
    alert("val + 1 " + val);

    val *= exp;

    if (dato[1] == "1") {
      val *= -1;
    }
    alert("flotante");
    alert(val);
    return val;
  }
}

function stringBinaryToDecimal2(dato) {
  let res = 0;
  let contador = 0;
  for (let i = dato.length - 1; i >= 0; i--) {
    if (dato[i] == "1") {
      res += Math.pow(2, contador);
      contador++;
      continue;
    }
    contador++;
    continue;
  }

  return res;
}

function reversarCadena(cadena) {
  let x = "";
  for (let i = cadena.length - 1; i >= 0; i--) {
    x += cadena[i];
  }
  return x;
}

function llenarCerosRestantes(n) {
  while (n.length < 33) {
    n += "0";
  }
  return n;
}

function complementoADos(n) {
  let aux = "";
  for (let i = 0; i < n.length; i++) {
    if (n[i] == "0") {
      aux += "1";
      continue;
    } else if (n[i] == "1") {
      aux += "0";
      continue;
    }
  }

  aux = stringBinaryToDecimal2(aux);

  aux += 1;

  aux = decimalABinario(aux);

  return aux;
}

function decimalABinario(n) {
  let val = "";

  if (n > 0) {
    while (true) {
      if (n < 2) {
        val += n % 2;
        n = Math.floor(n / 2);
        break;
      } else {
        val += n % 2;
        n = Math.floor(n / 2);
        continue;
      }
    }
    val = llenarCerosRestantes(val, true);

    return reversarCadena(val);
  }
  if (n < 0) {
    n = n * -1;
    while (true) {
      if (n < 2) {
        val += n % 2;
        n = Math.floor(n / 2);
        break;
      } else {
        val += n % 2;
        n = Math.floor(n / 2);
        continue;
      }
    }

    val = llenarCerosRestantes(val, true);

    val = reversarCadena(val);

    val = complementoADos(val);

    return val;
  }
}

ej1.addEventListener("click", function () {
  let inputMem = document.querySelectorAll(".inputMem");
  inputMem[0].value = "000000000000000000000000000000000";
  inputMem[1].value = "000110000010100000110000000000000";
  inputMem[2].value = "000010000010000000000000000000000";
  inputMem[3].value = "001000000000010000001000000000000";
  inputMem[4].value = "000000000000000000000000000000001";
  inputMem[5].value = "000000000000000000000000000001111";
  inputMem[6].value = "001001000000000000000000000001111";
});

ej3.addEventListener("click", function () {
  let inputMem = document.querySelectorAll(".inputMem");
  inputMem[0].value = "000000000000000000000000000000110";
  inputMem[1].value = "000000000000000000000000000000010";
  inputMem[2].value = "000000000000000000000000000000001";
  inputMem[3].value = "000000000000000000000000000000000";
  inputMem[4].value = "001110000000100011110000000000000";
  inputMem[5].value = "000110000000100010010000000000000";
  inputMem[6].value = "000000000000000000000000000000000";
  inputMem[7].value = "001101000000100010110000000000000";
  inputMem[8].value = "000010000001000000000000000000000";
  inputMem[9].value = "000001000000000000000000000000000";
  inputMem[10].value = "000000000000100000000000000000000";
  inputMem[11].value = "000010000000000000000000000000000";
  inputMem[12].value = "000001000000100000000000000000000";
  inputMem[13].value = "000000000000000000000000000000000";
  inputMem[14].value = "001101000000100010110000000000000";
  inputMem[15].value = "000010000001000000000000000000000";
  inputMem[16].value = "000001000000000000000000000000000";
  inputMem[17].value = "011111000001110000011000000000000";

  inputMem[18].value = "000000000000100000000000000000000";
  inputMem[19].value = "001101000000100010110000000000000";
  inputMem[20].value = "000010000001000000000000000000000";
  inputMem[21].value = "000001000000100000000000000000000";
  inputMem[22].value = "000000000000000000000000000000000";
  inputMem[23].value = "000010000000100000000000000000000";
  inputMem[24].value = "000001000000000000000000000000000";
  inputMem[25].value = "000000000000100000000000000000000";
  inputMem[26].value = "001101000000100010110000000000000";
  inputMem[27].value = "000010000001000000000000000000000";
  inputMem[28].value = "000001000000100000000000000000000";
  inputMem[29].value = "011111000001110000011000000000000";

  inputMem[30].value = "000000000000000000000000000000000";
  inputMem[31].value = "001000000000000000000000000000000";
  inputMem[32].value = "001001000000000000000000000000000";

  regPC.value = 3;
});

ej2.addEventListener("click", function () {
  let inputMem = document.querySelectorAll(".inputMem");
  inputMem[0].value = "000000000111000000000000000000000";
  inputMem[1].value = "001110001000000001010000000000000";
  inputMem[2].value = "000000000111100000000000000000000";
  inputMem[3].value = "000100000111000000000000000000000";
  inputMem[4].value = "000001000111100000000000000000000";
  inputMem[5].value = "001000000000000000000000000000000";
  inputMem[6].value = "000000000111000000000000000000000";
  inputMem[7].value = "000010001000100000000000000000000";
  inputMem[8].value = "000001000111000000000000000000000";
  inputMem[9].value = "011111000110010000000000000000000";
  inputMem[10].value = "000000000111100000000000000000000";
  inputMem[11].value = "000100000111000000000000000000000";
  inputMem[12].value = "001000000000000000000000000000000";
  inputMem[13].value = "001001000000000000000000000000000";
  inputMem[14].value = "000000000000000000000000000000001";
  inputMem[15].value = "000000000000000000000000000000001";
  inputMem[16].value = "000000000000000000000000000000011";
  inputMem[17].value = "000000000000000000000000000000001";
});
