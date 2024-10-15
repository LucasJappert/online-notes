<template>
    <div>
        <!-- Barra de progreso -->
        <div class="timeline-bar">
            <div
                v-for="(segment, index) in segments"
                :key="segment.title"
                class="segment"
                :style="segmentStyle(segment)"
                :class="['segment', isCompletedSegment(segment) ? 'completed-segment' : 'current-segment']"
            >
                <div v-if="isCurrentSegment(segment)" class="progress" :style="progressStyle(segment)"></div>
                <span class="segment-title">{{ segment.title }}</span>

                <span v-if="index == 0" class="range_from range">{{ segment.startTime }}</span>
                <span class="range_to range">{{ segment.endTime }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, CSSProperties, onMounted } from "vue";

interface Segment {
    title: string;
    startTime: string;
    endTime: string;
}

// Estado y variables
const currentProgress = ref<number>(0);
let intervalId: number | null = null;

// const segments = ref<Segment[]>([{ title: "Work", startTime: "01:00", endTime: "08:00" }]);
const segments = ref<Segment[]>([
    { title: "Work", startTime: "06:00", endTime: "08:00" },
    { title: "Daily", startTime: "08:00", endTime: "08:15" },
    { title: "Work", startTime: "08:15", endTime: "12:00" },
    { title: "Launch", startTime: "12:00", endTime: "12:45" },
    { title: "Work", startTime: "12:45", endTime: "14:00" },
    { title: "Nap", startTime: "14:00", endTime: "14:15" },
    { title: "Work", startTime: "14:15", endTime: "16:00" },
    { title: "Random time", startTime: "16:00", endTime: "20:00" },
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

onMounted(() => {
    startTimeline();
});

// Limpiar el intervalo al desmontar
onBeforeUnmount(() => {
    if (intervalId !== null) {
        clearInterval(intervalId);
    }
});
</script>

<style scoped lang="scss">
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
    color: #ff00ffcc; /* Texto blanco para buen contraste */
    position: relative;
    height: 40px;
    display: inline-block;
    background-color: #1c1c1c; /* Fondo aún más oscuro para los segmentos */
    border-radius: 10px; /* Bordes redondeados */
    /* border: 2px solid #00ffffcc; */
    margin: auto 10px;
    box-shadow: 0px 0px 10px #ff00ffcc; /* Efecto de resplandor en los segmentos */
    min-width: 50px;
    width: 100%;
    text-shadow: 0px 0px 10px #ff00ffcc; /* Efecto de sombra neón */

    .segment-title {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
        font-weight: bold;
        z-index: 1;
    }
}
.completed-segment {
    background: linear-gradient(45deg, #ff00ff66, #00000090, #00000090, #00000090, #ff00ff66); /* Degradado neón */
    background-size: 100% 100%;
    border-radius: 10px;
}
.current-segment {
    box-shadow: 0px 0px 10px #00ffffcc; /* Efecto de resplandor en los segmentos */
    color: #00ffffcc; /* Texto blanco para buen contraste */
    text-shadow: 0px 0px 10px #000000; /* Efecto de sombra neón */
}
.range {
    position: absolute;
    top: 100%;
    transform: translateY(-50%) rotate(-90deg);
    color: #00ffff;
    width: 0px;
    height: 0px;
    display: block;
}
.range_from {
    left: 0;
    margin-left: -20px;
}
.range_to {
    right: 0;
    margin-right: 2px;
}

.progress {
    height: 100%;
    position: absolute;
    transition: width 1s ease;
    background: linear-gradient(45deg, #00ffff66, #00ffff66 25%, #ff00ff66 50%, #00ffff66 90%);
    background-size: 200% 100%; /* Tamaño del fondo */
    animation: slideBackground 3s linear infinite; /* Animación de diagonales */
    overflow: hidden;
    z-index: 0;
    border-radius: 10px;
    box-shadow: 0px 0px 15px #00ffff80; /* Efecto de resplandor alrededor del progreso completado */
}

@keyframes slideBackground {
    0% {
        background-position: 0% 50%;
    }
    100% {
        background-position: 200% 50%;
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
    box-shadow: 0px 0px 10px #ff00ffcc, 0px 0px 10px #00ffffcc; /* Efecto neón en el botón */
    padding: 10px 20px;
    transition: transform 0.2s ease;
}

.play-button:hover {
    transform: scale(1.1); /* Aumenta ligeramente el tamaño del botón al hacer hover */
}
</style>
