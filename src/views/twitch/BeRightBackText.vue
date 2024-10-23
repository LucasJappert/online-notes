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
export default {
    name: "AnimatedText",
    props: {
        text: {
            type: String,
            default: "BE RIGHT BACK",
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
            return this.text.split("");
        },
    },
    mounted() {
        this.resetPositions();
        this.startAnimationCycle();
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
    },
};
</script>

<style scoped>
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
    font-family: "Arial", sans-serif;
    font-size: 5rem;
    position: relative;
    opacity: 0;
    color: #fff;
    text-shadow: 0 0 10px #00ffff, 0 0 20px #ff00ff, 0 0 30px #00ffff;
    animation: moveToCenter 1.5s ease-in-out forwards;
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
</style>
