let totalScore = 0;
let responses = [];

document.addEventListener("DOMContentLoaded", function () {
  const formAnsiedad = document.getElementById("formAnsiedad");
  const formDepresion = document.getElementById("formDepresion");
  const formBurnout = document.getElementById("formBurnout");

  if (formAnsiedad) {
    validaFormAnsiedad();
    graficaAnsiedad();

    
  }
  if (formDepresion) {
    validarFormDepresion();
    graficaDepresion();
    enviodatos()
  }

  if (formBurnout) {
    validarFormBurnout();
    graficasBurnout();
  }
});

function alertas(titulo, texto, icono, boton) {
  Swal.fire({
    title: titulo || "Resultado:",
    text: texto || "Depresión Moderada.",
    icon: icono || "info",
    confirmButtonText: boton || "Enterado!",
  });
}

function validaFormAnsiedad() {
  const textoinicial = document.getElementById("caja-instrucciones");
  const formAnsiedad = document.getElementById("formAnsiedad");
  formAnsiedad.addEventListener("submit", function (event) {
    event.preventDefault();
    let totalScore = 0;
    // Recorre todas las preguntas y suma las puntuaciones de las respuestas seleccionadas
    for (let i = 1; i <= 21; i++) {
      const pregunta = document.getElementsByName(`p${i}`);
      let respuestaSeleccionada = null;
      for (let j = 0; j < pregunta.length; j++) {
        if (pregunta[j].checked) {
          respuestaSeleccionada = parseInt(pregunta[j].value);
          break;
        }
      }
      if (respuestaSeleccionada === null) {
        Swal.fire({
          title: "Error!",
          text: `Por favor, responda la pregunta ${i} antes de enviar el formulario.`,
          icon: "error",
          confirmButtonText: "Enterado",
        });
        return;
      }
      totalScore += respuestaSeleccionada;
    }
    // Validar si el formulario está vacío
    if (totalScore === 0) {
      alertas(
        "Error!",
        "Por favor, complete todas las preguntas antes de enviar el formulario.",
        "error",
        "Enterado"
      );
      return;
    }
    // Muestra la puntuación total y la interpretación
    let resultText = "";
    if (totalScore >= 0 && totalScore <= 7) {
      resultText = "Ansiedad Minima";
    } else if (totalScore >= 8 && totalScore <= 15) {
      resultText = "Ansiedad Leve.";
    } else if (totalScore >= 16 && totalScore <= 25) {
      resultText = "Ansiedad Moderada.";
    } else if (totalScore >= 26 && totalScore <= 63) {
      resultText = "Ansiedad Grave.";
    }

    let mensaje = `
        Puntuación total: ${totalScore}
        <br>
        Interpretación: ${resultText}
    `;

    Swal.fire(mensaje);

    formAnsiedad.style.display = "none";
  });
}

function graficaAnsiedad() {
  
  const form = document.getElementById("formAnsiedad");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const responses = [];

    for (let i = 1; i <= 21; i++) {
      const question = document.querySelector(`input[name="p${i}"]:checked`);

      responses.push(parseInt(question.value));
    }

    const totalScore = responses.reduce((acc, score) => acc + score, 0);

    // Crear un elemento canvas para el gráfico
    const canvas = document.createElement("canvas");
    canvas.id = "myChart";
    document.getElementById("caja-resultados").appendChild(canvas);
    console.log(document.getElementById("caja-resultados"))
    const ctx = document.getElementById("myChart").getContext("2d");

    let resultText = ""; // Inicialmente, el texto del resultado está en blanco

    if (totalScore >= 0 && totalScore <= 7) {
      resultText = "Ansiedad Minima";
    } else if (totalScore >= 8 && totalScore <= 15) {
      resultText = "Ansiedad Leve.";
    } else if (totalScore >= 16 && totalScore <= 25) {
      resultText = "Ansiedad Moderada.";
    } else if (totalScore >= 26 && totalScore <= 63) {
      resultText = "Ansiedad Grave.";
    }

    if (resultText === "Ansiedad Minima") {
      // Datos para el gráfico
      const data = {
        labels: ["Puntaje Final", "Puntaje Inicial"], // Etiquetas en el eje X
        datasets: [
          {
            label: resultText,
            data: [totalScore, 0], // Datos en el eje Y
            fill: true, // Rellenar área bajo la línea
            borderColor: "rgba(70, 130, 180, 1)", // Color de la línea
            backgroundColor: "rgba(173, 216, 230, 0.7)",
          },
        ],
      };

      const config = {
        type: "line", // Tipo de gráfica (en este caso, línea)
        data: data, // Datos definidos anteriormente
        options: {
          animation: {
            duration: 6000, // Duración de la animación en milisegundos
            easing: "easeOutQuart", // Función de interpolación
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
              max: 10,
            },
          },
        },
      };

      new Chart(ctx, config);
    }
    /* Grafica inclinad en caso de ansiedad grave */
    if (resultText === "Ansiedad Grave.") {
      // Datos para el gráfico
      const data = {
        labels: ["Puntaje Inicial", "Puntaje Final"], // Etiquetas en el eje X
        datasets: [
          {
            label: resultText,
            data: [0, totalScore], // Datos en el eje Y
            fill: true, // Rellenar área bajo la línea
            borderColor: "rgba(220, 20, 60, 1)", // Color de la línea
            backgroundColor: "rgba(255, 99, 71, 0.7)",
          },
        ],
      };

      const config = {
        type: "line", // Tipo de gráfica (en este caso, línea)
        data: data, // Datos definidos anteriormente
        options: {
          animation: {
            duration: 6000, // Duración de la animación en milisegundos
            easing: "easeOutQuart", // Función de interpolación
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
              max: 70,
            },
          },
        },
      };

      new Chart(ctx, config);
    }

    if (resultText === "Ansiedad Moderada.") {
      // Datos para el gráfico
      const data = {
        labels: ["Puntaje Inicial", "Puntaje Final"], // Etiquetas en el eje X
        datasets: [
          {
            label: resultText,
            data: [totalScore, totalScore], // Datos en el eje Y
            fill: true, // Rellenar área bajo la línea
            borderColor: "rgba(255, 204, 51, 1)", // Color de la línea
            backgroundColor: "rgba(255, 255, 153, 0.7)",
          },
        ],
      };

      const config = {
        type: "line", // Tipo de gráfica (en este caso, línea)
        data: data, // Datos definidos anteriormente
        options: {
          animation: {
            duration: 6000, // Duración de la animación en milisegundos
            easing: "easeOutQuart", // Función de interpolación
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
              max: 30,
            },
          },
        },
      };

      new Chart(ctx, config);
    }

    if (resultText === "Ansiedad Leve.") {
      // Datos para el gráfico
      const data = {
        labels: ["Puntaje"], // Etiquetas en el eje X
        datasets: [
          {
            label: resultText,
            data: [totalScore], // Datos en el eje Y
            fill: true, // Rellenar área bajo la línea
            borderColor: "rgba(30, 144, 255, 1)", // Color de la línea
            backgroundColor: "rgba(135, 206, 250, 0.7)",
            borderWidth: 5,
          },
        ],
      };

      const config = {
        type: "bar", // Tipo de gráfica (en este caso, línea)
        data: data, // Datos definidos anteriormente
        options: {
          animation: {
            duration: 6000, // Duración de la animación en milisegundos
            easing: "easeOutQuart", // Función de interpolación
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
              max: 20,
            },
          },
        },
      };

      new Chart(ctx, config);
    }

     //variable  que guardan  la categoria de puntuacion y el resultado  //////////////////////////////////////////////////////////////////
     let resultGral = [resultText,totalScore]
     console.log(resultGral);
     enviodatos("Tests Ansiedad", totalScore); 
    // Ocultar el botón de envío una vez que se ha generado el gráfico
    form.querySelector("input[type=submit]").style.display = "none";
    document.getElementById("caja-form").style.display = "none";
    var cajaResultados = document.getElementById("caja-resultados");
    console.log("caja-resultados:", cajaResultados);
    cajaResultados.style.backgroundColor = "#f0f0f0";
    cajaResultados.style.border = "1px solid #ccc";
    cajaResultados.style.borderRadius = "5px";
    cajaResultados.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
  });
}

function validarFormDepresion() {
  const formDepresion = document.getElementById("formDepresion");

  formDepresion.addEventListener("submit", function (event) {
    event.preventDefault();
    // Aquí puedes realizar la evaluación de las respuestas del formulario
    const responses = [];

    for (let i = 1; i <= 21; i++) {
      const question = document.querySelector(`input[name="p${i}"]:checked`);
      if (!question) {
        Swal.fire({
          title: "Error!",
          text: `Por favor, complete todas las preguntas antes de enviar el formulario.`,
          icon: "error",
          confirmButtonText: "Enterado",
        });
        return;
      }

      responses.push(parseInt(question.value));
    }

    // Calcula la puntuación total
    const totalScore = responses.reduce((acc, score) => acc + score, 0);

    // Puedes definir tus propias reglas para interpretar los resultados
    if (totalScore >= 0 && totalScore <= 13) {
      Swal.fire({
        title: "Resultado:",
        text: `No hay evidencia significativa de depresión.`,
        icon: "info",
        confirmButtonText: "Enterado!",
      });
    } else if (totalScore >= 14 && totalScore <= 19) {
      Swal.fire({
        title: "Resultado:",
        text: `Depresión Leve.`,
        icon: "info",
        confirmButtonText: "Enterado!",
      });
    } else if (totalScore >= 20 && totalScore <= 28) {
      Swal.fire({
        title: "Resultado:",
        text: `Depresión Moderada.`,
        icon: "info",
        confirmButtonText: "Enterado!",
      });
    } else if (totalScore >= 28 && totalScore <= 63) {
      Swal.fire({
        title: "Resultado:",
        text: `Depresión Grave.`,
        icon: "info",
        confirmButtonText: "Enterado!",
      });
    }
    formDepresion.style.display = "none";
  });


}

function graficaDepresion() {
  const depressionName = "Inventario de Depresión de Beck (BDI-II)";
 
  
  const form = document.getElementById("formDepresion");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const responses = [];

    for (let i = 1; i <= 21; i++) {
      const question = document.querySelector(`input[name="p${i}"]:checked`);

      responses.push(parseInt(question.value));
    }

    const totalScore = responses.reduce((acc, score) => acc + score, 0);

    // Crear un elemento canvas para el gráfico
    const canvas = document.createElement("canvas");
    canvas.id = "myChart";
    document.getElementById("caja-resultados").appendChild(canvas);

    const ctx = document.getElementById("myChart").getContext("2d");

    let resultText = ""; // Inicialmente, el texto del resultado está en blanco

    if (totalScore >= 0 && totalScore <= 13) {
      resultText = "No hay evidencia significativa de depresión.";
    } else if (totalScore >= 14 && totalScore <= 19) {
      resultText = "Depresión leve.";
    } else if (totalScore >= 20 && totalScore <= 28) {
      resultText = "Depresión moderada.";
    } else if (totalScore >= 29 && totalScore <= 63) {
      resultText = "Depresión grave.";
    }

    if (resultText === "No hay evidencia significativa de depresión.") {
      // Datos para el gráfico
      const data = {
        labels: ["Resultados"],
        datasets: [
          {
            label: "Puntuación",
            data: [totalScore],
            backgroundColor: "rgba(70, 130, 180, 1)",
            borderColor: "rgba(173, 216, 230, 0.7)",
            borderWidth: 1,
          },
        ],
      };

      // Opciones del gráfico (puedes personalizar según tus necesidades)
      const options = {
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 20, // Ajusta esto según el rango máximo posible
          },
        },
      };

      // Crear el gráfico
      const myChart = new Chart(ctx, {
        type: "bar",
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: 63, // Ajusta esto según el rango máximo posible
            },
          },
          plugins: {
            title: {
              display: true,

              text: resultText, // Establece el título del gráfico
            },
          },
        },
      });
    }

    if (resultText === "Depresión leve.") {
      // Datos para el gráfico
      const data = {
        labels: ["Puntaje"], // Etiquetas en el eje X
        datasets: [
          {
            label: resultText,
            data: [totalScore], // Datos en el eje Y
            fill: true, // Rellenar área bajo la línea
            borderColor: "rgba(30, 144, 255, 1)", // Color de la línea
            backgroundColor: "rgba(135, 206, 250, 0.7)",
            borderWidth: 5,
          },
        ],
      };

      const config = {
        type: "bar", // Tipo de gráfica (en este caso, línea)
        data: data, // Datos definidos anteriormente
        options: {
          animation: {
            duration: 6000, // Duración de la animación en milisegundos
            easing: "easeOutQuart", // Función de interpolación
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
              max: 20,
            },
          },
        },
      };

      new Chart(ctx, config);
    }

    if (resultText === "Depresión moderada.") {
      // Datos para el gráfico
      const data = {
        labels: ["Puntaje Inicial", "Puntaje Final"], // Etiquetas en el eje X
        datasets: [
          {
            label: resultText,
            data: [totalScore, totalScore], // Datos en el eje Y
            fill: true, // Rellenar área bajo la línea
            borderColor: "rgba(255, 204, 51, 1)", // Color de la línea
            backgroundColor: "rgba(255, 255, 153, 0.7)",
          },
        ],
      };

      const config = {
        type: "line", // Tipo de gráfica (en este caso, línea)
        data: data, // Datos definidos anteriormente
        options: {
          animation: {
            duration: 6000, // Duración de la animación en milisegundos
            easing: "easeOutQuart", // Función de interpolación
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
              max: 30,
            },
          },
        },
      };

      new Chart(ctx, config);
    }

    if (resultText === "Depresión grave.") {
      // Datos para el gráfico
      const data = {
        labels: ["Puntaje Inicial", "Puntaje Final"], // Etiquetas en el eje X
        datasets: [
          {
            label: resultText,
            data: [0, totalScore], // Datos en el eje Y
            fill: true, // Rellenar área bajo la línea
            borderColor: "rgba(220, 20, 60, 1)", // Color de la línea
            backgroundColor: "rgba(255, 99, 71, 0.7)",
          },
        ],
      };

      const config = {
        type: "line", // Tipo de gráfica (en este caso, línea)
        data: data, // Datos definidos anteriormente
        options: {
          animation: {
            duration: 6000, // Duración de la animación en milisegundos
            easing: "easeOutQuart", // Función de interpolación
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
              max: 70,
            },
          },
        },
      };

      new Chart(ctx, config);
    }
    // Puedes personalizar aún más el gráfico, como el título, colores, leyendas, etc.

      //variable  que guardan  la categoria de puntuacion y el resultado  //////////////////////////////////////////////////////////////////
      let resultGral = [resultText,totalScore]
      console.log(resultGral);
      enviodatos("Tests Depresion", totalScore); 

    // Ocultar el botón de envío una vez que se ha generado el gráfico
    var cajaResultados = document.getElementById("caja-resultados");
    document.getElementById("caja-form").style.display = "none";
    cajaResultados.style.backgroundColor = "#f0f0f0";
    cajaResultados.style.border = "1px solid #ccc";
    cajaResultados.style.borderRadius = "5px";
    cajaResultados.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
  });
}

function validarFormBurnout() {
  const formBurnout = document.getElementById("formBurnout");
  const textoinicial = document.getElementById("caja-instrucciones");
  const resultadosDiv = document.getElementById("caja-resultados");

  formBurnout.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir el envío del formulario

    // Obtener todas las respuestas del formulario
    const responses = {};
    let formEmpty = true; // Variable para verificar si todas las preguntas están contestadas

    for (let i = 1; i <= 22; i++) {
      const questionName = "p" + i;
      const selectedRadio = document.querySelector(
        `input[name=${questionName}]:checked`
      );

      if (selectedRadio) {
        const response = parseInt(selectedRadio.value);
        responses[questionName] = response;
      } else {
        formEmpty = false; // Marcar como no contestada si falta alguna respuesta
        break; // Salir del bucle si falta una respuesta
      }
    }
    /* Alerta por si el formulario esa vacio*/
    if (!formEmpty) {
      Swal.fire({
        title: "Error!",
        text: "Por favor, responde todas las preguntas antes de enviar el formulario.",
        icon: "error",
        confirmButtonText: "Enterado",
      });
      return;
    }

    // Calcular las puntuaciones de CE, DP y RP
    const ceScore =
      (responses.p1 + responses.p6 + responses.p11 + responses.p16) / 4;
    const dpScore =
      (responses.p5 + responses.p10 + responses.p15 + responses.p20) / 4;
    const rpScore =
      (responses.p2 +
        responses.p3 +
        responses.p4 +
        responses.p7 +
        responses.p8 +
        responses.p9 +
        responses.p12 +
        responses.p13 +
        responses.p14 +
        responses.p17 +
        responses.p18 +
        responses.p19 +
        responses.p21 +
        responses.p22) /
      14;

    // Función para determinar la categoría (baja, media o alta)
    function getCategory(score, lowCutoff, highCutoff) {
      if (score <= lowCutoff) {
        return "baja";
      } else if (score >= highCutoff) {
        return "alta";
      } else {
        return "media";
      }
    }

    //variable que contiene todos los resulltados  ////////////////////////////////////////////////////////////////////
    const categoryGral=[ceScore,dpScore,rpScore];
    console.log(categoryGral);
    enviodatos("Tests Burnout", categoryGral);
    // Calcular las categorías para CE, DP y RP
    const ceCategory = getCategory(ceScore, 18, 27);
    const dpCategory = getCategory(dpScore, 5, 10);
    const rpCategory = getCategory(rpScore, 33, 40);

    // Crear un mensaje con los resultados

    const resultadosMensaje = `
      Puntuación de Cansancio Emocional (CE): ${ceScore} (${ceCategory})<br>
      Puntuación de Despersonalización (DP): ${dpScore} (${dpCategory})<br>
      Puntuación de Realización Personal (RP): ${rpScore} (${rpCategory})<br>
    `;
    const resultadosMensajeSA = `
      Puntuación de Cansancio Emocional (CE): ${ceScore} (${ceCategory})
      Puntuación de Despersonalización (DP): ${dpScore} (${dpCategory})
      Puntuación de Realización Personal (RP): ${rpScore} (${rpCategory})
    `;

    // Mostrar los resultados en el div "caja-resultados"
    resultadosDiv.innerHTML = resultadosMensaje;

    // Agregar una alerta para confirmar el envío del formulario

    Swal.fire({
      title: "Resultado:",
      text: resultadosMensajeSA,
      icon: "info",
      confirmButtonText: "Enterado",
    });

    formBurnout.style.display = "none";
   
  });
}

function graficasBurnout() {
  const form = document.getElementById("formBurnout");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir el envío del formulario

    // Obtener todas las respuestas del formulario
    const responses = {};
    let formEmpty = true; // Variable para verificar si todas las preguntas están contestadas

    for (let i = 1; i <= 22; i++) {
      const questionName = "p" + i;
      const selectedRadio = document.querySelector(
        `input[name=${questionName}]:checked`
      );

      if (selectedRadio) {
        const response = parseInt(selectedRadio.value);
        responses[questionName] = response;
      } else {
        formEmpty = false; // Marcar como no contestada si falta alguna respuesta
        break; // Salir del bucle si falta una respuesta
      }
    }

    // Alerta por si el formulario está vacío
    if (!formEmpty) {
      Swal.fire({
        title: "Error!",
        text: "Por favor, responde todas las preguntas antes de enviar el formulario.",
        icon: "error",
        confirmButtonText: "Enterado",
      });
      return;
    }

    // Calcular las puntuaciones de CE, DP y RP
    const ceScore =
      (responses.p1 + responses.p6 + responses.p11 + responses.p16) / 4;
    const dpScore =
      (responses.p5 + responses.p10 + responses.p15 + responses.p20) / 4;
    const rpScore =
      (responses.p2 +
        responses.p3 +
        responses.p4 +
        responses.p7 +
        responses.p8 +
        responses.p9 +
        responses.p12 +
        responses.p13 +
        responses.p14 +
        responses.p17 +
        responses.p18 +
        responses.p19 +
        responses.p21 +
        responses.p22) /
      14;

    // Crear un mensaje con los resultados
    const resultadosMensaje = `
      Puntuación de Cansancio Emocional (CE): ${ceScore}
      Puntuación de Despersonalización (DP): ${dpScore}
      Puntuación de Realización Personal (RP): ${rpScore}
    `;

    // Luego, crea un gráfico basado en los resultados
    mostrarGraficaCE_DP_RP(ceScore, dpScore, rpScore);
    document.getElementById("caja-form").style.display = "none";
    var cajaResultados = document.getElementById("caja-resultados");
    console.log("caja-resultados:", cajaResultados);
    cajaResultados.style.backgroundColor = "#f0f0f0";
    cajaResultados.style.border = "1px solid #ccc";
    cajaResultados.style.borderRadius = "5px";
    cajaResultados.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
  });
}

// Función para mostrar una gráfica de barras
function mostrarGraficaCE_DP_RP(ceScore, dpScore, rpScore) {
  const canvas = document.getElementById("myChart");

  if (canvas) {
    canvas.remove(); // Eliminar el gráfico anterior si existe
  }

  // Crear un nuevo elemento canvas para el gráfico
  const newCanvas = document.createElement("canvas");
  newCanvas.id = "myChart";
  document.getElementById("caja-resultados").appendChild(newCanvas);

  const ctx = newCanvas.getContext("2d");

  // Datos para el gráfico
  const data = {
    labels: ["CE", "DP", "RP"],
    datasets: [
      {
        label: "Puntuación",
        data: [ceScore, dpScore, rpScore],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Opciones del gráfico (puedes personalizar según tus necesidades)
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Desactivar el mantenimiento automático del aspect ratio
    scales: {
      x: {
        beginAtZero: true,
        max: 20,
      },
      y: {
        beginAtZero: true,
        max: 10, // Ajusta según tus necesidades
      },
    },
  };

  // Crear el gráfico
  const myChart = new Chart(ctx, {
    type: "bar",
    data: data,
    options: options,
  });
}



function graficaAnsiedadSeguimiento(porcentaje) {

  let cajaDisplayArea = document.getElementById("displayArea");
  cajaDisplayArea.style.display = "inline";

  // Crear un elemento canvas para el gráfico
  const canvas = document.createElement("canvas");
  canvas.id = "myChart";
  canvas.style.width = "100%";
  canvas.style.maxWidth = "1000px";
  canvas.style.height = "100%";
  canvas.style.maxHeight = "450px";

  document.getElementById("displayArea").appendChild(canvas);
  const ctx = document.getElementById("myChart").getContext("2d");

  let resultText = ""; // Inicialmente, el texto del resultado está en blanco

  if (porcentaje >= 0 && porcentaje <= 7) {
    resultText = "Ansiedad Minima";
  } else if (porcentaje >= 8 && porcentaje <= 15) {
    resultText = "Ansiedad Leve.";
  } else if (porcentaje >= 16 && porcentaje <= 25) {
    resultText = "Ansiedad Moderada.";
  } else if (porcentaje >= 26 && porcentaje <= 63) {
    resultText = "Ansiedad Grave.";
  }

  if (resultText === "Ansiedad Minima") {
    // Datos para el gráfico
    const data = {
      labels: ["Puntaje Final", "Puntaje Inicial"], // Etiquetas en el eje X
      datasets: [
        {
          label: resultText,
          data: [porcentaje, 0], // Datos en el eje Y
          fill: true, // Rellenar área bajo la línea
          borderColor: "rgba(70, 130, 180, 1)", // Color de la línea
          backgroundColor: "rgba(173, 216, 230, 0.7)",
        },
      ],
    };

    const config = {
      type: "line", // Tipo de gráfica (en este caso, línea)
      data: data, // Datos definidos anteriormente
      options: {
        animation: {
          duration: 6000, // Duración de la animación en milisegundos
          easing: "easeOutQuart", // Función de interpolación
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
            max: 10,
          },
        },
      },
    };

    new Chart(ctx, config);
  }
  /* Grafica inclinada en caso de ansiedad grave */
  if (resultText === "Ansiedad Grave.") {
    // Datos para el gráfico
    const data = {
      labels: ["Puntaje Inicial", "Puntaje Final"], // Etiquetas en el eje X
      datasets: [
        {
          label: resultText,
          data: [0, porcentaje], // Datos en el eje Y
          fill: true, // Rellenar área bajo la línea
          borderColor: "rgba(220, 20, 60, 1)", // Color de la línea
          backgroundColor: "rgba(255, 99, 71, 0.7)",
        },
      ],
    };

    const config = {
      type: "line", // Tipo de gráfica (en este caso, línea)
      data: data, // Datos definidos anteriormente
      options: {
        animation: {
          duration: 6000, // Duración de la animación en milisegundos
          easing: "easeOutQuart", // Función de interpolación
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
            max: 70,
          },
        },
      },
    };

    new Chart(ctx, config);
  }

  if (resultText === "Ansiedad Moderada.") {
    // Datos para el gráfico
    const data = {
      labels: ["Puntaje Inicial", "Puntaje Final"], // Etiquetas en el eje X
      datasets: [
        {
          label: resultText,
          data: [porcentaje, porcentaje], // Datos en el eje Y
          fill: true, // Rellenar área bajo la línea
          borderColor: "rgba(255, 204, 51, 1)", // Color de la línea
          backgroundColor: "rgba(255, 255, 153, 0.7)",
        },
      ],
    };

    const config = {
      type: "line", // Tipo de gráfica (en este caso, línea)
      data: data, // Datos definidos anteriormente
      options: {
        animation: {
          duration: 6000, // Duración de la animación en milisegundos
          easing: "easeOutQuart", // Función de interpolación
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
            max: 30,
          },
        },
      },
    };

    new Chart(ctx, config);
  }

  if (resultText === "Ansiedad Leve.") {
    // Datos para el gráfico
    const data = {
      labels: ["Puntaje"], // Etiquetas en el eje X
      datasets: [
        {
          label: resultText,
          data: [porcentaje], // Datos en el eje Y
          fill: true, // Rellenar área bajo la línea
          borderColor: "rgba(30, 144, 255, 1)", // Color de la línea
          backgroundColor: "rgba(135, 206, 250, 0.7)",
          borderWidth: 5,
        },
      ],
    };

    const config = {
      type: "bar", // Tipo de gráfica (en este caso, línea)
      data: data, // Datos definidos anteriormente
      options: {
        animation: {
          duration: 6000, // Duración de la animación en milisegundos
          easing: "easeOutQuart", // Función de interpolación
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
            max: 20,
          },
        },
      },
    };

    new Chart(ctx, config);
  }



  enviodatos("Tests Ansiedad", porcentaje);
  // Ocultar el botón de envío una vez que se ha generado el gráfico


}

function graficaDepresionSeguimiento(porcentaje) {

  let cajaDisplayArea = document.getElementById("displayArea");
  cajaDisplayArea.style.display = "inline";
  // Crear un elemento canvas para el gráfico
  const canvas = document.createElement("canvas");
  canvas.id = "myChart";

  canvas.style.width = "100%";
  canvas.style.maxWidth = "1000px";
  canvas.style.height = "100%";
  canvas.style.maxHeight = "650px";

  document.getElementById("displayArea").appendChild(canvas);

  const ctx = document.getElementById("myChart").getContext("2d");

  let resultText = ""; // Inicialmente, el texto del resultado está en blanco

  if (porcentaje >= 0 && porcentaje <= 13) {
    resultText = "No hay evidencia significativa de depresión.";
  } else if (porcentaje >= 14 && porcentaje <= 19) {
    resultText = "Depresión leve.";
  } else if (porcentaje >= 20 && porcentaje <= 28) {
    resultText = "Depresión moderada.";
  } else if (porcentaje >= 29 && porcentaje <= 63) {
    resultText = "Depresión grave.";
  }

  if (resultText === "No hay evidencia significativa de depresión.") {
    // Datos para el gráfico
    const data = {
      labels: ["Puntaje"], // Etiquetas en el eje X
      datasets: [
        {
          label: resultText,
          data: [porcentaje], // Datos en el eje Y
          fill: true, // Rellenar área bajo la línea
          borderColor: "rgba(30, 144, 255, 1)", // Color de la línea
          backgroundColor: "rgba(135, 206, 250, 0.7)",
          borderWidth: 5,
        },
      ],
    };

    const config = {
      type: "bar", // Tipo de gráfica (en este caso, línea)
      data: data, // Datos definidos anteriormente
      options: {
        animation: {
          duration: 6000, // Duración de la animación en milisegundos
          easing: "easeOutQuart", // Función de interpolación
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
            max: 20,
          },
        },
      },
    };

    new Chart(ctx, config);
  }

  if (resultText === "Depresión leve.") {
    // Datos para el gráfico
    const data = {
      labels: ["Puntaje"], // Etiquetas en el eje X
      datasets: [
        {
          label: resultText,
          data: [porcentaje], // Datos en el eje Y
          fill: true, // Rellenar área bajo la línea
          borderColor: "rgba(30, 144, 255, 1)", // Color de la línea
          backgroundColor: "rgba(135, 206, 250, 0.7)",
          borderWidth: 5,
        },
      ],
    };

    const config = {
      type: "bar", // Tipo de gráfica (en este caso, línea)
      data: data, // Datos definidos anteriormente
      options: {
        animation: {
          duration: 6000, // Duración de la animación en milisegundos
          easing: "easeOutQuart", // Función de interpolación
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
            max: 20,
          },
        },
      },
    };

    new Chart(ctx, config);
  }

  if (resultText === "Depresión moderada.") {
    // Datos para el gráfico
    const data = {
      labels: ["Puntaje Inicial", "Puntaje Final"], // Etiquetas en el eje X
      datasets: [
        {
          label: resultText,
          data: [porcentaje, porcentaje], // Datos en el eje Y
          fill: true, // Rellenar área bajo la línea
          borderColor: "rgba(255, 204, 51, 1)", // Color de la línea
          backgroundColor: "rgba(255, 255, 153, 0.7)",
        },
      ],
    };

    const config = {
      type: "line", // Tipo de gráfica (en este caso, línea)
      data: data, // Datos definidos anteriormente
      options: {
        animation: {
          duration: 6000, // Duración de la animación en milisegundos
          easing: "easeOutQuart", // Función de interpolación
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
            max: 30,
          },
        },
      },
    };

    new Chart(ctx, config);
  }

  if (resultText === "Depresión grave.") {
    // Datos para el gráfico
    const data = {
      labels: ["Puntaje Inicial", "Puntaje Final"], // Etiquetas en el eje X
      datasets: [
        {
          label: resultText,
          data: [0, porcentaje], // Datos en el eje Y
          fill: true, // Rellenar área bajo la línea
          borderColor: "rgba(220, 20, 60, 1)", // Color de la línea
          backgroundColor: "rgba(255, 99, 71, 0.7)",
        },
      ],
    };

    const config = {
      type: "line", // Tipo de gráfica (en este caso, línea)
      data: data, // Datos definidos anteriormente
      options: {
        animation: {
          duration: 6000, // Duración de la animación en milisegundos
          easing: "easeOutQuart", // Función de interpolación
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
            max: 70,
          },
        },
      },
    };

    new Chart(ctx, config);
  }

  enviodatos("Tests Depresion", porcentaje);

}

function mostrarGraficaCE_DP_RP_Seguimiento(ceScore, dpScore, rpScore) {
  let cajaDisplayArea = document.getElementById("displayArea");
  cajaDisplayArea.style.display = "inline";

  const canvas = document.getElementById("myChart");


  if (canvas) {
    canvas.remove(); // Eliminar el gráfico anterior si existe
  }

  // Crear un nuevo elemento canvas para el gráfico
  const newCanvas = document.createElement("canvas");
  newCanvas.id = "myChart";
  newCanvas.style.width = "100%";
  newCanvas.style.maxWidth = "950px";
  newCanvas.style.height = "100%";
  newCanvas.style.maxHeight = "650px";
  document.getElementById("displayArea").appendChild(newCanvas);
  const ctx = newCanvas.getContext("2d");

  // Datos para el gráfico
  const data = {
    labels: ["CE", "DP", "RP"],
    datasets: [
      {
        label: "Puntuación",
        data: [ceScore, dpScore, rpScore],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Opciones del gráfico (puedes personalizar según tus necesidades)
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Desactivar el mantenimiento automático del aspect ratio
    scales: {
      x: {
        beginAtZero: true,
        max: 20,
      },
      y: {
        beginAtZero: true,
        max: 10, // Ajusta según tus necesidades
      },
    },
  };

  // Crear el gráfico
  const myChart = new Chart(ctx, {
    type: "bar",
    data: data,
    options: options,
  });
}


document.addEventListener("DOMContentLoaded", function() {
  // Selecciona el primer botón con la clase 'primer-test'
  const primerBoton = document.querySelector(".primer-test");

  if (primerBoton) {
    // Desencadena el evento 'click' en el primer botón
    primerBoton.click();
  }
});

function changeContent(boton, testId, tipoTest) {
  // Obtén el input correspondiente al botón clicado
  const input = document.getElementById(`btn-${testId}`);
 
  // Seleccionar todos los botones con la clase "boton-test"

  const botones = document.querySelectorAll(".boton-test");

  botones.forEach((boton) => {
    boton.classList.remove("btnTests");
  });

  // Agrega la clase "btnTests" solo al botón seleccionado
  boton.classList.add("btnTests");


  const canvas = document.getElementById("myChart");
  if (canvas) {
    canvas.remove();
  }


  // Definir un arreglo para almacenar los parámetros (debe declararse fuera de esta función)
  if (typeof parametrosBurnout === "undefined") {
    var parametrosBurnout = [];

  }

  // Declarar variables para los valores de Burnout
  let parametro1, parametro2, parametro3;

  // Verifica si se encontró el input y obtén su valor
  if (input) {

    const porcentajeTest = input.value;

    // Llama a la función de dibujo correspondiente según el tipo de prueba
    if (tipoTest === "Tests Depresion") {
      // Llama a la función para el gráfico de depresión
      graficaDepresionSeguimiento(porcentajeTest);
    } else if (tipoTest === "Tests Ansiedad") {


      // Llama a la función para el gráfico de ansiedad
      graficaAnsiedadSeguimiento(porcentajeTest);
    } else if (tipoTest === "Tests Burnout") {
      // Llama a la función para el gráfico de burnout
      const valores = porcentajeTest.split(','); // Divide la cadena en valores separados por comas
      parametrosBurnout.push(...valores); // Agrega los valores al arreglo parametrosBurnout

      //alert("Parámetros Burnout: " + parametrosBurnout.join(", "));

      if (parametrosBurnout.length >= 3) {
        // Asigna los valores a las variables individuales
        parametro1 = parametrosBurnout[0];
        parametro2 = parametrosBurnout[1];
        parametro3 = parametrosBurnout[2];

        // Muestra las variables en una alerta
        //alert("Parametro 1: " + parametro1 + "\nParametro 2: " + parametro2 + "\nParametro 3: " + parametro3);

        // Llama a la función de gráfico Burnout
        mostrarGraficaCE_DP_RP_Seguimiento(parametro1, parametro2, parametro3);
      }
    }


  } else {
    console.log(`No se encontró el input para ${testId}`);
  }
}

function enviodatos(tipoTest,porcentaje) {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/TeleMindCare/Api/Tests/Create/`;
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

   
  // Datos de ejemplo, reemplaza esto con los datos reales
  const testData = {
    tipoTest:tipoTest,
    porcentaje:String(porcentaje),
  };

  // Realiza la solicitud usando el token CSRF
fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify(testData),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
}





if(document.querySelector('#container-testm')){
  
  function changeContent(testId) {
    const displayArea = document.getElementById('displayArea');
    switch (testId) {
        case 'test_1':
            displayArea.innerHTML = 'Información del test 1';
            break;
        case 'test_2':
            displayArea.innerHTML = 'Información del test 2';
            break;
        case 'test_3':
            displayArea.innerHTML = 'Información del test 3';
            break;
        case 'test_4':
            displayArea.innerHTML = 'Información del test 4';
            break;
        default:
            displayArea.innerHTML = 'Selecciona un test';
    }

    // Agregar el botón de gráficas de nuevo
    const btnGraph = document.createElement('button');
    btnGraph.id = 'btnGraph';
    btnGraph.innerHTML = 'Ir a gráficas';
    displayArea.appendChild(btnGraph);
}

}