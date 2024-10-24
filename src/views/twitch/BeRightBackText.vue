<template>
    <div class="container">
        <div class="neon-text" :class="{ hidden: hideLetters }">
            <span v-for="(letter, index) in textArray" :key="index" class="letter" :style="getLetterStyle(index)">
                {{ letter }}
            </span>
        </div>
    </div>
</template>

<script>
const CreateSpark = (sparkContainer) => {
    const spark = document.createElement("div");
    spark.classList.add("spark");
    spark.style.position = "absolute";
    spark.style.width = "4px";
    spark.style.height = "4px";
    spark.style.backgroundColor = "#fff";
    spark.style.borderRadius = "50%";
    spark.style.transition = "all 1s cubic-bezier(0.05, 0.06, 0.05, 0.94)";
    spark.style.left = "50%";
    spark.style.top = "50%";
    spark.style.transform = `translate(-50%, -50%)`;
    spark.style.width = "0px";
    spark.style.height = "0px";
    setTimeout(() => {
        spark.style.width = "4px";
        spark.style.height = "4px";
        spark.style.transform = `translate(calc(-50% + ${(Math.random() - 0.5) * 200}px), calc(-50% + ${(Math.random() - 0.5) * 200}px))`;
    }, Math.random() * 1000);

    sparkContainer.appendChild(spark);
    setTimeout(() => {
        // const newSpark = CreateSpark(sparkContainer);
        // if (!sparkContainer) console.log("No container");
        // sparkContainer.appendChild(newSpark);
        sparkContainer.removeChild(spark);
        const childLength = sparkContainer.children.length;
        console.log(childLength);
        spark.remove();
    }, 1000);
};
export default {
    name: "AnimatedText",
    props: {
        text: {
            type: String,
            default: "BE  RIGHT  BACK",
        },
    },
    data() {
        return {
            positions: [],
            hideLetters: false, // Controla la visibilidad de las letras
        };
    },
    computed: {
        textArray() {
            return this.text.split("").filter((char) => char !== " "); // Divide el texto en un array de letras
        },
    },
    mounted() {
        this.resetPositions();
        this.startAnimationCycle();
        this.startSparks();
    },
    methods: {
        randomPosition() {
            // Genera posiciones aleatorias para cada letra
            const x = Math.random() * 100 - 50; // Entre -50% y 50% del ancho del viewport
            const y = Math.random() * 100 - 50; // Entre -50% y 50% del alto del viewport
            return { x, y };
        },
        getLetterStyle(index) {
            // Genera el estilo para la letra, asegurando que empiece desde una posición aleatoria
            if (this.positions[index]) {
                const { x, y } = this.positions[index];
                return {
                    "--randomX": `${x}vw`,
                    "--randomY": `${y}vh`,
                    animationDelay: `${index * 0.2}s`, // Añade un pequeño retraso para cada letra
                };
            }
            return { "--randomX": "0vw", "--randomY": "0vh" }; // Valor por defecto
        },
        resetPositions() {
            // Genera posiciones aleatorias para todas las letras
            this.positions = this.textArray.map(() => this.randomPosition());
        },
        startAnimationCycle() {
            setInterval(() => {
                // Oculta las letras y luego reinicia la animación
                this.hideLetters = true;
                setTimeout(() => {
                    this.resetPositions(); // Reinicia las posiciones antes de mostrar las letras nuevamente
                    this.hideLetters = false; // Vuelve a mostrar las letras
                }, 1000); // Tiempo de ocultación
            }, 7000); // Cada ciclo dura 7 segundos
        },
        startSparks() {
            const letters = document.querySelectorAll(".letter");
            letters.forEach((letter) => {
                this.createSparks(letter);
                // setInterval(() => {
                //     this.createSparks(letter);
                // }, 1000); // Intervalo para crear chispas cada segundo
            });
        },

        createSparks(letter) {
            const sparkContainer = document.createElement("div");
            sparkContainer.classList.add("spark-container");
            letter.appendChild(sparkContainer);

            for (let i = 0; i < 20; i++) {
                const spark = CreateSpark(sparkContainer);
            }

            // setTimeout(() => {
            //     sparkContainer.remove();
            // }, 1000);
        },
    },
};
</script>

<style lang="scss">
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: #000;
}

.neon-text {
    display: flex;
    gap: 0.5rem; /* Espaciado entre letras */
}

.letter {
    font-family: "Tahoma", sans-serif;
    font-size: 5rem;
    position: relative;
    opacity: 0;
    opacity: 1;
    color: #fff;
    text-shadow: 0 0 10px #00ffff, 0 0 20px #ff00ff, 0 0 30px #00ffff;
    animation: moveToCenter 1.5s ease-in-out forwards;
    font-weight: bold;
}

@keyframes moveToCenter {
    0% {
        opacity: 0;
        transform: translate(var(--randomX), var(--randomY)); /* Empieza en la posición aleatoria */
    }
    100% {
        opacity: 1;
        transform: translate(0, 0); /* Termina en la posición final */
    }
}

/* Ocultar las letras con una transición */
.hidden .letter {
    animation: fadeOut 1s forwards;
}

@keyframes fadeOut {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

.spark-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
}

.spark {
    // position: absolute;
    // width: 4px;
    // height: 4px;
    // background-color: #fff;
    // border-radius: 50%;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    // transition: all 5s cubic-bezier(0.05, 0.06, 0.05, 0.94);
    // transform: scale(1) !important;
    // animation: spark-animation 1s ease-out forwards;
}
</style>
