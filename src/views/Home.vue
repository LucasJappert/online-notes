<template>
    <div class="container">

        <!-- Barra de Progreso -->
        <div class="progress-container">
            <h2>Progreso de Horas</h2>
            <v-row class="mt-2" no-gutters>
                <v-col cols="12" class="pa-0">
                    <v-text-field v-model.number="maxHours" label="Cantidad máxima de horas" type="number"
                        variant="outlined"></v-text-field>
                </v-col>

                <v-divider class="custom-divider mt-4"></v-divider>

                <v-row no-gutters class="mt-4 align-center">
                    <v-col cols="8">
                        <v-text-field v-model.number="addHoursInput" label="Horas a agregar" type="number"
                            variant="outlined"></v-text-field>
                    </v-col>
                    <v-col cols="4" class="d-flex justify-end">
                        <v-btn @click="addHours" color="green">Sumar</v-btn>
                    </v-col>
                </v-row>
            </v-row>


            <div class="progress-bar-container">
                <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
            </div>
            <p>{{ currentHours }} / {{ maxHours }} Horas</p>
        </div>

        <!-- Log de Horas -->
        <div class="log-container">
            <v-row no-gutters class="align-center">
                <v-col cols="8">
                    <h3>Logs de Cargas de Horas</h3>
                </v-col>
                <v-col cols="4" class="d-flex justify-end">
                    <v-btn @click="resetProgress" color="indigo">Resetear</v-btn>
                </v-col>
            </v-row>
            <ul>
                <li v-for="(log, index) in logs" :key="index">
                    <v-row no-gutters class="align-center">
                        <v-col cols="8">
                            {{ log.timestamp }} - {{ log.hoursAdded }} hora/s
                        </v-col>
                        <v-col cols="4" class="d-flex justify-end">
                            <v-btn @click="removeLog(index)" color="red">Eliminar</v-btn>
                        </v-col>
                    </v-row>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
//TODO: Limpiar horas agregadas luego de agregar un registro
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
    name: 'Home',
    setup() {
        const maxHours = ref<number>(6);
        const currentHours = ref<number>(0);
        const addHoursInput = ref<number>(0);
        const logs = ref<{ timestamp: string, hoursAdded: number; }[]>([]);

        const progressPercentage = computed(() => {
            return maxHours.value > 0
                ? (currentHours.value / maxHours.value) * 100
                : 0;
        });

        const addHours = () => {
            if (maxHours.value > 0 && addHoursInput.value > 0) {
                const hoursToAdd = addHoursInput.value;
                currentHours.value += hoursToAdd;

                if (currentHours.value > maxHours.value) {
                    currentHours.value = maxHours.value;
                }

                // Registrar la hora actual y la cantidad agregada
                const now = new Date();
                logs.value.push({
                    timestamp: now.toLocaleString(),
                    hoursAdded: hoursToAdd,
                });
            }
        };

        const resetProgress = () => {
            maxHours.value = 0;
            currentHours.value = 0;
            addHoursInput.value = 0;
            logs.value = []; // Limpiar el log
        };

        const removeLog = (index: number) => {
            const log = logs.value[index];
            currentHours.value -= log.hoursAdded;

            logs.value.splice(index, 1);
        };

        return {
            maxHours,
            currentHours,
            addHoursInput,
            progressPercentage,
            logs,
            addHours,
            resetProgress,
            removeLog
        };
    },
    mounted() {
    }
});
</script>

<style scoped>
.container {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.progress-container {
    margin-top: 30px;
}

input,
button {
    padding: 10px;
    margin: 5px;
    font-size: 16px;
}

.progress-bar-container {
    width: 100%;
    background-color: #CCCCCC;
    border-radius: 20px;
    margin: 20px 0;
    overflow: hidden;
}

.progress-bar {
    height: 30px;
    background-color: #0e8125;
    border-radius: 20px;
    transition: width 0.3s ease;
}

.log-container {
    margin-top: 20px;
    text-align: left;
}

.log-container h3 {
    font-size: 1.5rem;
}

.log-container ul {
    list-style-type: none;
    padding: 0;
}

.log-container li {
    background-color: #666666;
    padding: 3px 10px;
    margin: 5px 0;
    border-radius: 5px;
}

.custom-divider {
    height: 2px !important;
    max-height: none !important;
    background-color: #000000 !important;
    opacity: unset !important;
    border: none !important;
}
</style>
