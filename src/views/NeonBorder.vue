<template>
    <div class="container">
        <div class="neon-border">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "NeonBorder",
};
</script>

<style lang="scss">
body,
.dark-theme,
html {
    background-color: transparent !important;
    background: transparent !important;
}

/* Aplica a todos los elementos en la página */
* {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer y Edge */
}

*::-webkit-scrollbar {
    display: none; /* Chrome, Safari y Opera */
}
</style>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-color: transparent;
    padding: 80px;
}
.neon-border {
    position: relative;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 0 40px #00c8ff, 0 0 40px #df01f8;
    border: 5px solid transparent;
    background: transparent;
    box-sizing: border-box;
    animation: rotate-shadow 10s infinite linear;
    height: 100%;
    width: 100%;
}

@keyframes neon-glow {
    0% {
        box-shadow: 0 0 10px #00c8ff20, 0 0 10px #df01f820;
    }
    100% {
        box-shadow: 0 0 40px #df01f8, 0 0 40px #00c8ffff;
    }
}

@keyframes rotate-shadow {
    0% {
        box-shadow: 0 0 40px #00c8ff, 0 0 40px #df01f8, -10px -10px 40px #00c8ff, 10px 10px 40px #df01f8;
    }
    25% {
        box-shadow: -10px 10px 40px #00c8ff, 10px -10px 40px #df01f8;
    }
    50% {
        box-shadow: 10px 10px 40px #df01f8, -10px -10px 40px #00c8ff;
    }
    75% {
        box-shadow: 10px -10px 40px #df01f8, -10px 10px 40px #00c8ff;
    }
    100% {
        box-shadow: 0 0 40px #00c8ff, 0 0 40px #df01f8, -10px -10px 40px #00c8ff, 10px 10px 40px #df01f8;
    }
}
</style>
