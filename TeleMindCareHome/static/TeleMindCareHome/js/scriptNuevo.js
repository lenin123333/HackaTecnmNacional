document.addEventListener("DOMContentLoaded", function () {
    const formAnsiedad = document.getElementById("formAnsiedad");
    const formDepresion = document.getElementById("formDepresion");
    const formBurnout = document.getElementById("formBurnout");
    
    if (formAnsiedad) {
        initializeForm(formAnsiedad, "Ansiedad", [33]);
    }
    if (formDepresion) {
        initializeForm(formDepresion, "Depresión", [33]);
    }
    if (formBurnout) {
        createBarChart();
    }
});

function initializeForm(form, testName, cutoffs) {
   
    const textoinicial = document.getElementById("caja-form");
    const resultadosDiv = document.getElementById("caja-resultados");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const responses = getFormResponses(form);

        if (responses.length === 0) {
            showErrorAlert("Por favor, complete todas las preguntas antes de enviar el formulario.");
            return;
        }
        const totalScore = calculateTotalScore(responses); //se calculara el resultado
        
        /*variable para hacer pruebas con las graficas */
        //totalScore=13;
        const category = getCategory(totalScore, cutoffs);

        const resultText = `${testName} ${category}`;
        const resultsMessage = `
        Puntuación total: ${totalScore}
        Interpretación: ${resultText}
    `;
    //variable  que guardan el tipo de test que se realizo, la categoria de puntuacion y el resultado
        let resultGral = [testName,category,totalScore]
        console.log(resultGral);

   
        resultadosDiv.innerHTML = `<pre>${resultsMessage}</pre>`;
        showAlert("Resultado:", resultsMessage);
        hideFormAndInstructions(form, textoinicial);

        createLineChart(totalScore, testName, category);

        if (testName === "Burnout") {
            createBarChart();
        }

    });
}

function getFormResponses(form) {
    const responses = [];
    for (let i = 1; i <= 21; i++) {
        const questionName = `p${i}`;
        const selectedRadio = form.querySelector(`input[name="${questionName}"]:checked`);

        if (selectedRadio) {
            responses.push(parseInt(selectedRadio.value));
        } else {
            return []; // Al menos una pregunta sin respuesta
        }
    }
    return responses;
}

function calculateTotalScore(responses) {
    return responses.reduce((acc, score) => acc + score, 0);
}

function getCategory(totalScore, cutoffs) {
    if (totalScore <= cutoffs[0]) {
        return "Mínima";
    } else if (totalScore <= cutoffs[1]) {
        return "Leve";
    } else if (totalScore <= cutoffs[2]) {
        return "Moderada";
    } else {
        return "Grave";
    }
}

function showAlert(title, text, icon = "info", buttonText = "Enterado") {
    Swal.fire({ title, text, icon, confirmButtonText: buttonText });
}

function showErrorAlert(text) {
    showAlert("Error!", text, "error");
}

function hideFormAndInstructions(form, instructions) {
    form.style.display = "none";
    instructions.style.display = "none";

}
function createBarChart() {
    const form = document.getElementById("formBurnout");
    const textoinicial = document.getElementById("caja-form");
    const resultadosDiv = document.getElementById("caja-resultados");
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevenir el envío del formulario

        // Obtener todas las respuestas del formulario
        const responses = {};
        let formEmpty = true; // Variable para verificar si todas las preguntas están contestadas

        for (let i = 1; i <= 22; i++) {
            const questionName = "p" + i;
            const selectedRadio = document.querySelector(`input[name=${questionName}]:checked`);

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
            showErrorAlert('Por favor, responde todas las preguntas antes de enviar el formulario.');
            return;
        }

        // Calcular las puntuaciones de CE, DP y RP
        const ceScore = (responses.p1 + responses.p6 + responses.p11 + responses.p16) / 4;
        const dpScore = (responses.p5 + responses.p10 + responses.p15 + responses.p20) / 4;
        const rpScore = (responses.p2 + responses.p3 + responses.p4 + responses.p7 + responses.p8 + responses.p9 + responses.p12 + responses.p13 + responses.p14 + responses.p17 + responses.p18 + responses.p19 + responses.p21 + responses.p22) / 14;

        // Calcular las categorías para CE, DP y RP
        const ceCategory = getCategory(ceScore, 18, 27);
        const dpCategory = getCategory(dpScore, 5, 10);
        const rpCategory = getCategory(rpScore, 33, 40);

        //variable que contiene todos los resulltados
        const categoryGral=[ceScore,dpScore,rpScore];
        console.log(categoryGral);

        // Crear un mensaje con los resultados
        const resultadosMensaje = `
        Puntuación de Cansancio Emocional (CE) : ${ceScore}
      Puntuación de Despersonalización (DP) : ${dpScore} 
      Puntuación de Realización Personal (RP) : ${rpScore} 
    `;

        const resultadosMensajeSweetAlert = `

      Puntuación de Cansancio Emocional (CE) : ${ceScore} (${ceCategory})<br>
      Puntuación de Despersonalización (DP) : ${dpScore} (${dpCategory})<br>
      Puntuación de Realización Personal (RP) : ${rpScore} (${rpCategory})
    `;
        resultadosDiv.innerHTML =`<pre>${resultadosMensajeSweetAlert}</pre>`;

        showAlert('Resultados:', resultadosMensaje);

        hideFormAndInstructions(form, textoinicial);
        // Luego, crea un gráfico basado en los resultados
        mostrarGraficaCE_DP_RP(ceScore, dpScore, rpScore);

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
                label:"Resultados",
                data: [ceScore, dpScore, rpScore],
                backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(75, 192, 192, 0.2)"],
                borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)"],
                borderWidth: 1,
            },
        ],
    };

    // Opciones del gráfico (puedes personalizar según tus necesidades)
    const options = {
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 10, // Ajusta esto según el rango máximo posible
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
/** Formulario de Ansiedad y Depresion */
function createLineChart(totalScore, testName, category) {
    const canvas = document.createElement("canvas");
    canvas.id = "myChart";
    document.getElementById("caja-resultados").appendChild(canvas);

    const ctx = canvas.getContext("2d");
    grficasDep(totalScore, testName, category,ctx);
}

function grficasDep(totalScore, testName, category,ctx){
    const formAnsiedad = document.getElementById("formAnsiedad");
    const formDepresion = document.getElementById("formDepresion");

    if(formAnsiedad){
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
                labels: ['Inicio','Final'], // leyenda en los puntos
                datasets: [
                    {
                        label: resultText,
                        data: [totalScore,0],
                        fill: true, // Rellenar área bajo la línea
                        backgroundColor: "rgba(0, 128, 0, 0.1)", //Color de Fondo
                        borderColor: "rgba(0, 128, 0, 1)",//Color deBorde
                        borderWidth: 1,
                    },
                ],
            };
            // Opciones del gráfico (puedes personalizar según tus necesidades)
            const options = {
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: 70, // Ajusta esto según el rango máximo posible
                    },
                },
            };
            // Crear el gráfico
            const myChart = new Chart(ctx, {
                type: "line",
                data: data,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            suggestedMax: 70, // Ajusta esto según el rango máximo posible
                        },
                    },
                },
            });
        }
        if (resultText === "Ansiedad Leve.") {
            // Datos para el gráfico
            const data = {
                labels: ['Puntaje'], // Etiquetas en el eje X
                datasets: [
                    {
                        label: resultText,
                        data: [totalScore], // Datos en el eje Y
                        fill: true, // Rellenar área bajo la línea
                        borderColor: 'rgba(255, 165, 0, 1)',
                        backgroundColor: 'rgba(255, 165, 0, 0.1)',
                        borderWidth:1,
                    },
                ],
            };

            const config = {
                type: 'bar', // Tipo de gráfica (en este caso, línea)
                data: data, // Datos definidos anteriormente
                options: {
                    animation: {
                        duration: 6000, // Duración de la animación en milisegundos
                        easing: 'easeOutQuart', // Función de interpolación
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
                labels: ["Puntaje"], // Etiquetas en el eje X
                datasets: [
                    {
                        label: resultText,
                        data: [totalScore], // Datos en el eje Y
                        fill: true, // Rellenar área bajo la línea
                        borderColor: 'rgba(255, 0, 0, 1)', // Color de la línea
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        borderWidth:1,
                    },
                ],
            };

            const config = {
                type: 'bar', // Tipo de gráfica (en este caso, línea)
                data: data, // Datos definidos anteriormente
                options: {
                    animation: {
                        duration: 6000, // Duración de la animación en milisegundos
                        easing: 'easeOutQuart', // Función de interpolación
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
        if (resultText === "Ansiedad Grave.") {
            // Datos para el gráfico
            const data = {
                labels: ['Puntaje Inicial', 'Puntaje Final'], // Etiquetas en el eje X
                datasets: [
                    {
                        label: resultText,
                        data: [0, totalScore], // Datos en el eje Y
                        fill: true, // Rellenar área bajo la línea
                        borderColor: 'rgba(139, 0, 0, 1)', // Color de la línea
                        backgroundColor: 'rgba(139, 0, 0, 0.1)',
                        borderWidth:1,
                    },
                ],
            };

            const config = {
                type: 'line', // Tipo de gráfica (en este caso, línea)
                data: data, // Datos definidos anteriormente
                options: {
                    animation: {
                        duration: 6000, // Duración de la animación en milisegundos
                        easing: 'easeOutQuart', // Función de interpolación
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
    }
    if(formDepresion){
        let resultText = ""; // Inicialmente, el texto del resultado está en blanco
   
        if (totalScore >= 0 && totalScore <= 13) {
            resultText = "Minima";
        } else if (totalScore >= 14 && totalScore <= 19) {
            resultText = "Leve";
        } else if (totalScore >= 20 && totalScore <= 28) {
            resultText = "Moderada";
        } else if (totalScore >= 29 && totalScore <= 63) {
            resultText = "Grave";
        }

        if (resultText === "Minima") {
            // Datos para el gráfico
            const data = {
                labels: ['Inicio','Final'],
                datasets: [
                    {
                        label: resultText,
                        data: [totalScore,0],
                        fill:true,
                        backgroundColor: "rgba(0, 128, 0, 0.1)",
                        borderColor: "rgba(0, 128, 0, 1)",
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
                type: "line",
                data: data,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            suggestedMax: 70, // Ajusta esto según el rango máximo posible
                        },
                    },
                   
                },
            });
    
        }
        if (resultText === "Leve") {
           // Datos para el gráfico
           const data = {
            labels: ['Puntaje'], // Etiquetas en el eje X
            datasets: [
                {
                    label:resultText,
                    data: [totalScore], // Datos en el eje Y
                    fill: true, // Rellenar área bajo la línea
                    borderColor: 'rgba(255, 165, 0, 1)', // Color de la línea
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    borderWidth:1,
                },
            ],
        };

        const config = {
            type: 'bar', // Tipo de gráfica (en este caso, línea)
            data: data, // Datos definidos anteriormente
            options: {
                animation: {
                    duration: 6000, // Duración de la animación en milisegundos
                    easing: 'easeOutQuart', // Función de interpolación
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
        if (resultText === "Moderada") {
            // Datos para el gráfico
            const data = {
                labels: ["Puntaje"], // Etiquetas en el eje X
                datasets: [
                    {
                        label:resultText ,
                        data: [totalScore], // Datos en el eje Y
                        fill: true, // Rellenar área bajo la línea
                        borderColor: 'rgba(255, 0, 0, 1)', // Color de la línea
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        borderWidth:1,
                    },
                ],
            };
    
            const config = {
                type: 'bar', // Tipo de gráfica (en este caso, línea)
                data: data, // Datos definidos anteriormente
                options: {
                    animation: {
                        duration: 6000, // Duración de la animación en milisegundos
                        easing: 'easeOutQuart', // Función de interpolación
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
        if (resultText === "Grave") {
            // Datos para el gráfico
            const data = {
                labels: ['Puntaje Inicial', 'Puntaje Final'],
                datasets: [
                    {
                        label: testName + " " + category,
                        data: [0, totalScore],
                        fill: true,
                        borderColor: 'rgba(139, 0, 0, 1)',
                        backgroundColor: 'rgba(139, 0, 0, 0.1)',
                        borderWidth: 1,
                    },
                ],
            };
    
            const config = {
                type: 'line',
                data: data,
                options: {
                    animation: {
                        duration: 6000,
                        easing: 'easeOutQuart',
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
    }
}