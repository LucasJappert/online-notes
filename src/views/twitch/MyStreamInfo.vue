<template>
    <div class="stream-info">
        <div class="city">🌍 Rafaela, Argentina</div>
        <div class="time">{{ currentTime }}</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Reactive variable to hold the current time
const currentTime = ref("");

// Function to update the time every second
const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

onMounted(() => {
    updateTime();
    setInterval(updateTime, 1000); // Update the time every second
});
</script>

<style scoped lang="scss">
.stream-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: "Orbitron", sans-serif;
    padding: 20px;
    background-color: #00000060;
    border-radius: 15px;
    animation: rotate-shadow 10s infinite linear;
    margin: 40px;
}

.city {
    color: #ff00ff; /* Neon pink */
    font-size: 24px;
    margin-bottom: 10px;
    text-shadow: 0 0 10px rgba(255, 0, 255, 0.7);
}

.time {
    color: #00ffff; /* Neon cyan */
    font-size: 20px;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
}
</style>
