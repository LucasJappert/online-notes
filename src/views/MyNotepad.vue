<template>
    <v-container class="dark-theme">
        <v-row>
            <v-col cols="12">
                <h1 class="title">📝 Current Note</h1>
                <v-textarea v-model="currentNote" label="" outlined class="note-textarea" rows="30"
                    @input="autoSaveCurrentNote" ref="currentTextarea"></v-textarea>
                <v-btn @click="saveNote" color="success" class="save-btn">💾 SAVE NOTE</v-btn>
            </v-col>

            <v-col cols="12" class="mt-5">
                <h2 class="subtitle">📋 Menú de Notas Guardadas</h2>
                <!-- Buscador de notas -->
                <v-text-field v-model="searchQuery" label="Buscar notas..." outlined class="search-bar"></v-text-field>

                <v-btn @click="toggleNotes" color="secondary" class="toggle-btn">
                    {{ notesVisible ? '👀 Ocultar Notas' : '📂 Mostrar Notas' }}
                </v-btn>

                <div class="spacer"></div> <!-- Espacio debajo del botón de ocultar notas -->

                <v-row v-if="notesVisible" class="notes-grid" style="max-height: 400px; overflow-y: auto;">
                    <v-col v-for="(note, index) in sortedFilteredNotes" :key="index" cols="4" class="mb-3">
                        <v-card class="text-center note-card" outlined elevation="2">
                            <v-card-title class="note-title">{{ formatDate(note.date) }} - {{ note.title
                                }}</v-card-title>
                            <v-card-subtitle class="note-subtitle">{{ note.content.substring(0, 20)
                                }}...</v-card-subtitle>
                            <v-card-actions>
                                <v-btn @click="openNoteModal(note, index)" text color="primary">📝 Editar</v-btn>
                                <v-btn @click="confirmDelete(index)" text color="red">🗑️ Eliminar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>

            <!-- Modal para ver y editar la nota -->
            <v-dialog v-model="isNoteModalOpen" max-width="80%" transition="dialog-transition">
                <v-card class="dark-theme">
                    <v-card-title>📝 Editar Nota</v-card-title>
                    <v-card-text>
                        <v-textarea v-model="selectedNote.content" rows="35" outlined
                            class="note-textarea"></v-textarea>
                    </v-card-text>
                    <v-card-actions class="justify-space-between">
                        <v-btn color="grey" @click="isNoteModalOpen = false">Cancelar</v-btn>
                        <v-btn color="success" @click="updateNote">💾 Guardar Cambios</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <!-- Confirmación para eliminar nota -->
            <v-dialog v-model="isDeleteConfirmOpen" max-width="400px">
                <v-card>
                    <v-card-title class="headline">¿Estás seguro?</v-card-title>
                    <v-card-text>¿Quieres eliminar esta nota?</v-card-text>
                    <v-card-actions>
                        <v-btn @click="isDeleteConfirmOpen = false">Cancelar</v-btn>
                        <v-btn color="red" @click="deleteNote(selectedDeleteIndex)">Eliminar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            currentNote: '',
            savedNotes: [],
            notesVisible: true,
            isNoteModalOpen: false,
            isDeleteConfirmOpen: false,
            selectedDeleteIndex: null,
            selectedNote: {},
            searchQuery: '',
        };
    },
    computed: {
        sortedFilteredNotes() {
            // Filtrar por búsqueda y ordenar las notas por fecha (descendente)
            return this.savedNotes
                .filter(
                    note =>
                        note.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        note.content.toLowerCase().includes(this.searchQuery.toLowerCase())
                )
                .sort((a, b) => {
                    // Convertimos las fechas de los strings a objetos Date para ordenarlas
                    const dateA = new Date(a.date.split('/').reverse().join('/')); // Formato dd/mm/yyyy
                    const dateB = new Date(b.date.split('/').reverse().join('/'));
                    return dateB - dateA; // Orden descendente
                });
        }
    },
    mounted() {
        this.loadNotes();
        this.loadCurrentNote();
    },
    methods: {
        saveNote() {
            if (this.currentNote) {
                const currentDate = this.getCurrentDate();
                this.savedNotes.push({
                    title: `Nota ${this.savedNotes.length + 1}`,
                    content: this.currentNote,
                    date: currentDate,
                });
                this.currentNote = '';
                this.saveToLocalStorage();
                localStorage.removeItem('currentNote');
                // Foco en el textarea después de guardar la nota
                this.$nextTick(() => {
                    this.$refs.currentTextarea.focus();
                });
            }
        },
        loadNotes() {
            const savedNotes = localStorage.getItem('savedNotes');
            if (savedNotes) {
                this.savedNotes = JSON.parse(savedNotes);
            }
        },
        saveToLocalStorage() {
            localStorage.setItem('savedNotes', JSON.stringify(this.savedNotes));
        },
        loadCurrentNote() {
            const storedCurrentNote = localStorage.getItem('currentNote');
            if (storedCurrentNote) {
                this.currentNote = storedCurrentNote;
            }
        },
        autoSaveCurrentNote() {
            localStorage.setItem('currentNote', this.currentNote);
        },
        toggleNotes() {
            this.notesVisible = !this.notesVisible;
        },
        openNoteModal(note, index) {
            this.selectedNote = note;
            this.selectedDeleteIndex = index;
            this.isNoteModalOpen = true;
        },
        updateNote() {
            // Actualizar la nota seleccionada y guardar los cambios
            this.$set(this.savedNotes, this.selectedDeleteIndex, this.selectedNote);
            this.saveToLocalStorage();
            this.isNoteModalOpen = false;
        },
        confirmDelete(index) {
            this.selectedDeleteIndex = index;
            this.isDeleteConfirmOpen = true;
        },
        deleteNote(index) {
            this.savedNotes.splice(index, 1);
            this.saveToLocalStorage();
            this.isDeleteConfirmOpen = false;
        },
        getCurrentDate() {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            return `${day}/${month}/${year}`;
        },
        formatDate(dateString) {
            return dateString;
        }
    }
};
</script>

<style scoped>
.dark-theme {
    background-color: #1e1e1e;
    color: #ffffff;
}

.title,
.subtitle {
    color: #ffffff;
    text-align: center;
}

.note-textarea {
    background-color: #2c2c2c !important;
    color: #ffffff !important;
    border-color: #555 !important;
    height: 70vh !important;
}

.save-btn {
    margin: 10px 0;
}

.toggle-btn {
    margin-top: 15px;
}

.spacer {
    margin-bottom: 20px;
    /* Espacio debajo del botón de ocultar notas */
}

.notes-grid {
    justify-content: center;
}

.note-card {
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    background-color: #333333;
    color: #ffffff;
}

.note-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
}

.note-title {
    font-weight: bold;
}

.note-subtitle {
    font-size: 14px;
    color: #aaaaaa;
}

.search-bar {
    margin-bottom: 20px;
}

.v-dialog {
    transition: opacity 0.3s ease;
}

.dialog-transition-enter-active,
.dialog-transition-leave-active {
    opacity: 1;
    transition: opacity 0.5s;
}

.dialog-transition-enter,
.dialog-transition-leave-to {
    opacity: 0;
}

.v-card-actions {
    display: flex;
    justify-content: space-between;
}
</style>
