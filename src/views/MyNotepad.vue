<template>
    <v-container class="dark-theme">
        <v-row>
            <v-col cols="12">
                <h1 class="title">📝 Current Note</h1>
                <v-textarea v-model="currentNote" label="Escribe tu nota..." rows="15" outlined class="note-textarea"
                    @input="autoSaveCurrentNote"></v-textarea>
                <v-btn @click="saveNote" color="success" class="save-btn">💾 SAVE NOTE</v-btn>
            </v-col>

            <v-col cols="12" class="mt-5">
                <h2 class="subtitle">📋 Menú de Notas Guardadas</h2>
                <v-btn @click="toggleNotes" color="secondary" class="toggle-btn">
                    {{ notesVisible ? '👀 Ocultar Notas' : '📂 Mostrar Notas' }}
                </v-btn>

                <v-row v-if="notesVisible" class="notes-grid">
                    <v-col v-for="(note, index) in savedNotes" :key="index" cols="4" class="mb-3">
                        <v-card class="text-center note-card" outlined elevation="2">
                            <v-card-title class="note-title">{{ formatDate(note.date) }} - {{ note.title
                                }}</v-card-title>
                            <v-card-subtitle class="note-subtitle">{{ note.content.substring(0, 20)
                                }}...</v-card-subtitle>
                            <v-card-actions>
                                <v-btn @click="openNoteModal(note)" text color="primary">📝 Ver</v-btn>
                                <v-btn @click="confirmDelete(index)" text color="red">🗑️ Eliminar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>

            <!-- Modal para ver la nota -->
            <v-dialog v-model="isNoteModalOpen" max-width="600px" transition="dialog-transition">
                <v-card>
                    <v-card-title>{{ selectedNote.title }}</v-card-title>
                    <v-card-text>{{ selectedNote.content }}</v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="isNoteModalOpen = false">Cerrar</v-btn>
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
        };
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
        openNoteModal(note) {
            this.selectedNote = note;
            this.isNoteModalOpen = true;
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
    min-height: 300px;
}

.save-btn {
    margin: 10px 0;
}

.toggle-btn {
    margin-top: 15px;
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
</style>