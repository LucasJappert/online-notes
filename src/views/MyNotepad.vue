<template>
    <v-container class="dark-theme" fluid>
        <v-row>
            <v-col cols="12">
                <v-textarea v-model="currentNote" placeholder="✏️ Write here..." outlined class="note-textarea"
                    rows="30" @input="autoSaveCurrentNote" ref="currentTextarea"></v-textarea>
                <v-btn :disabled="currentNote == ''" @click="saveNote" outlined color="primary" class="my-2">💾
                    SAVE</v-btn>
            </v-col>

            <v-col cols="6" class="">
                <!-- Buscador de notas -->
                <v-text-field v-model="searchQuery" placeholder="🔍 Search notes..." cleareable />
            </v-col>
            <v-col cols="12" class="">

                <div class="spacer"></div> <!-- Espacio debajo del botón de ocultar notas -->

                <v-row class="notes-grid" style="max-height: 400px; overflow-y: auto;">
                    <v-col v-for="(note, index) in sortedFilteredNotes" :key="index" cols="4" class="mb-3"
                        @click="openNoteModal(note, index)">
                        <v-card class="text-center note-card" outlined elevation="2">
                            <v-card-title class="note-title">{{ formatDate(note.date) }} - {{ note.title
                                }}</v-card-title>

                            <v-card-subtitle class="note-subtitle">{{ note.content.substring(0, 200)
                                }}...</v-card-subtitle>
                            <v-card-actions>
                                <v-btn @click.stop="confirmDelete(index)" outlined text color="red">🗑️
                                    Delete</v-btn>
                                <v-btn color="primary">📝 Show/Edit</v-btn>
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
            isNoteModalOpen: false,
            isDeleteConfirmOpen: false,
            selectedDeleteIndex: null,
            selectedNote: {},
            searchQuery: '',
        };
    },
    computed: {
        sortedFilteredNotes() {
            return this.savedNotes
                .filter(
                    note =>
                        note.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        note.content.toLowerCase().includes(this.searchQuery.toLowerCase())
                )
                .sort((a, b) => b.id - a.id); // Ordenar por ID en orden descendente
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

                // Determina el próximo ID de la nota
                const newId = this.savedNotes.length > 0 ? Math.max(...this.savedNotes.map(note => note.id)) + 1 : 1;

                this.savedNotes.push({
                    id: newId, // ID autoincremental
                    title: `Nota ${newId}`,
                    content: this.currentNote,
                    date: currentDate, // Mantener la fecha actual
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
        openNoteModal(note, index) {
            this.selectedNote = note;
            this.selectedDeleteIndex = index;
            this.isNoteModalOpen = true;
        },
        updateNote() {
            // Actualizar la nota seleccionada y guardar los cambios
            this.savedNotes[this.selectedDeleteIndex] = this.selectedNote;
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

<style scoped lang="scss">
.dark-theme {
    background-color: #1e1e1e;
    color: #cccccc;
}

.title,
.subtitle {
    color: #cccccc;
    text-align: center;
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
    color: #aaaaaa;
}

.note-card:hover {
    box-shadow: 0px 0px 10px #ffffff;
}

.note-title {
    font-weight: bold;
}

.note-subtitle {
    font-size: 14px;
    color: #aaaaaa;
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
