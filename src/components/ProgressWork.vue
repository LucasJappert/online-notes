<template>
    <div>
        <!-- Barra de progreso -->
        <div class="timeline-bar">
            <div
                v-for="segment in segments"
                :key="segment.title"
                class="segment"
                :style="segmentStyle(segment)"
                :class="['segment', isCompletedSegment(segment) ? 'completed-segment' : '']"
            >
                <div v-if="isCurrentSegment(segment)" class="progress" :style="progressStyle(segment)"></div>
                <span class="segment-title">{{ segment.title }}</span>
            </div>
        </div>

        <!-- Botón PLAY -->
        <div class="play-button-container">
            <v-btn class="play-button" @click="startTimeline">Play</v-btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, CSSProperties } from "vue";

interface Segment {
    title: string;
    startTime: string;
    endTime: string;
}

// Estado y variables
const currentProgress = ref<number>(0);
let intervalId: number | null = null;
const segments = ref<Segment[]>([
    { title: "Hard work", startTime: "06:00", endTime: "08:00" },
    { title: "Daily", startTime: "08:00", endTime: "08:15" },
    { title: "Hard work", startTime: "08:15", endTime: "12:00" },
    { title: "Lunch", startTime: "12:00", endTime: "13:00" },
    { title: "Hard work", startTime: "13:00", endTime: "14:00" },
    { title: "Nap", startTime: "14:00", endTime: "14:15" },
    { title: "Hard work", startTime: "14:15", endTime: "16:00" },
    { title: "Random", startTime: "16:00", endTime: "18:00" },
]);

const startTime = ref<string>("14:00");
const endTime = ref<string>(segments.value[segments.value.length - 1].endTime);

// Métodos
const startTimeline = () => {
    intervalId = setInterval(updateProgress, 1000) as unknown as number;
};

const updateProgress = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    currentProgress.value = calculateMinutes(currentTime);

    console.log("Current time in minutes:", currentProgress.value);
};

// Función para comparar si un segmento ya ha terminado
const isCompletedSegment = (segment: Segment) => {
    const now = new Date();
    const currentTime = calculateMinutes(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
    const segmentEndTime = calculateMinutes(segment.endTime);
    return currentTime >= segmentEndTime; // Si el tiempo actual es mayor o igual al final del segmento
};

const calculateMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

const isCurrentSegment = (segment: Segment): boolean => {
    const currentTime = currentProgress.value;
    const segmentStart = calculateMinutes(segment.startTime);
    const segmentEnd = calculateMinutes(segment.endTime);

    const isCurrent = currentTime >= segmentStart && currentTime <= segmentEnd;

    if (isCurrent) {
        console.log(`Segment ${segment.title} is active`);
    }

    return isCurrent;
};

const currentSegmentProgress = (segment: Segment): number => {
    const currentTime = currentProgress.value;
    const segmentStart = calculateMinutes(segment.startTime);
    const segmentEnd = calculateMinutes(segment.endTime);
    const segmentDuration = segmentEnd - segmentStart;

    const progress = ((currentTime - segmentStart) / segmentDuration) * 100;

    console.log(`Progress for segment ${segment.title}:`, progress);

    return progress;
};

const segmentStyle = (segment: Segment): CSSProperties => {
    const segmentEndMinutes = calculateMinutes(segment.endTime) - calculateMinutes(segment.startTime);
    const segmentDuration = segmentEndMinutes;

    return {
        width: `${(segmentDuration / totalMinutes.value) * 100}%`,
    };
};

const progressStyle = (segment: Segment): CSSProperties => {
    return {
        width: `${currentSegmentProgress(segment)}%`,
    };
};

// Computed para calcular los minutos totales
const totalMinutes = computed(() => {
    return calculateMinutes(endTime.value) - calculateMinutes(startTime.value);
});

// Limpiar el intervalo al desmontar
onBeforeUnmount(() => {
    if (intervalId !== null) {
        clearInterval(intervalId);
    }
});
</script>

<style scoped>
.timeline-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background-color: #121212; /* Fondo oscuro */
    padding: 10px;
    border-radius: 10px; /* Bordes redondeados */
}

.segment {
    background-color: #000000;
    font-weight: bold;
    color: #ffffff; /* Texto blanco para buen contraste */
    position: relative;
    overflow: hidden;
    height: 40px;
    display: inline-block;
    background-color: #1c1c1c; /* Fondo aún más oscuro para los segmentos */
    border-radius: 10px; /* Bordes redondeados */
    /* border: 2px solid rgba(0, 255, 255, 0.8); */
    margin: auto 5px;
    box-shadow: 0px 0px 10px rgba(0, 255, 255, 0.5); /* Efecto de resplandor en los segmentos */
}

.segment-title {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #00ffff; /* Celeste neón para los títulos */
    font-size: 16px;
    font-weight: bold;
    text-shadow: 0px 0px 10px rgba(0, 255, 255, 0.8), 0px 0px 10px rgba(255, 0, 255, 0.8); /* Efecto de sombra neón */
    z-index: 1;
}
.completed-segment {
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 0, 255, 0.4), rgba(0, 255, 255, 0.4), rgba(255, 0, 255, 0.4)); /* Degradado neón */
    background-size: 200% 100%;
    border-radius: 10px;
    box-shadow: 0px 0px 15px rgba(0, 255, 255, 0.5); /* Resplandor neón */
}

.progress {
    height: 100%;
    position: absolute;
    transition: width 1s ease;
    background: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.1),
        rgba(255, 0, 255, 0.4),
        rgba(0, 255, 255, 0.4),
        rgba(255, 0, 255, 0.4)
    ); /* Degradado animado neón */
    background-size: 200% 100%; /* Tamaño del fondo */
    animation: slideBackground 3s linear infinite; /* Animación de diagonales */
    overflow: hidden;
    z-index: 0;
    border-radius: 10px;
    box-shadow: 0px 0px 15px rgba(0, 255, 255, 0.5); /* Efecto de resplandor alrededor del progreso completado */
}

@keyframes slideBackground {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

.play-button-container {
    text-align: center; /* Centra el botón horizontalmente */
    margin-top: 20px; /* Espacio entre la barra de progreso y el botón */
}

.play-button {
    background-color: #ff00ff; /* Rosa neón para el botón */
    color: #ffffff; /* Texto blanco */
    font-weight: bold;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(255, 0, 255, 0.8), 0px 0px 10px rgba(0, 255, 255, 0.8); /* Efecto neón en el botón */
    padding: 10px 20px;
    transition: transform 0.2s ease;
}

.play-button:hover {
    transform: scale(1.1); /* Aumenta ligeramente el tamaño del botón al hacer hover */
}
</style>
