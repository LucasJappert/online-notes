<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="p-relative">
                <v-textarea
                    v-model="currentNote"
                    placeholder="✏️ Write here..."
                    outlined
                    class="note-textarea"
                    rows="30"
                    @input="autoSaveCurrentNote"
                    ref="currentTextarea"
                ></v-textarea>
                <v-btn :disabled="currentNote == ''" @click="saveNote" color="primary" class="my-2 save-button">💾 SAVE NOTE</v-btn>
            </v-col>

            <v-col cols="12" class="justify-space-between d-flex mt-2">
                <v-text-field class="search-box" v-model="searchQuery" placeholder="🔍 Search notes..." />
                <div>
                    <!-- Creamos un boton para importar -->
                    <v-btn @click="importNotes" outlined color="secondary" class="my-2 import-button"> <v-icon>mdi-download</v-icon>Import </v-btn>
                    <v-btn @click="exportNotes" outlined color="secondary" class="my-2 export-button ml-2"><v-icon>mdi-upload</v-icon> Export</v-btn>
                </div>
            </v-col>

            <v-col cols="12" class="">
                <v-row class="notes-grid">
                    <div v-for="(note, index) in sortedFilteredNotes" :key="index" class="ma-3" @click="openNoteModal(note, index)">
                        <v-card class="text-center note-card" outlined elevation="2">
                            <v-card-title class="note-title">{{ formatDate(note.date) }} - {{ note.title }}</v-card-title>

                            <v-card-subtitle class="note-subtitle">{{ note.content.substring(0, 200) }}...</v-card-subtitle>
                            <v-card-actions>
                                <v-btn @click.stop="confirmDelete(note)" color="red">🗑️ Delete</v-btn>
                                <v-btn color="primary">📝 Show/Edit</v-btn>
                            </v-card-actions>
                        </v-card>
                    </div>
                </v-row>
            </v-col>

            <!-- Modal para ver y editar la nota -->
            <v-dialog v-if="editingNote != null" v-model="isNoteModalOpen" max-width="80%" transition="dialog-transition">
                <v-card class="dark-theme">
                    <v-card-title>📝 Editing note</v-card-title>
                    <v-card-text>
                        <v-textarea v-model="editingNote.content" rows="35" outlined class="note-textarea"></v-textarea>
                    </v-card-text>
                    <v-card-actions class="justify-space-between">
                        <v-btn color="grey" @click="isNoteModalOpen = false">Cancel</v-btn>
                        <v-btn :disabled="updateButtonDisabled" color="success" @click="updateNote">💾 Save changes</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <!-- Confirmación para eliminar nota -->
            <v-dialog v-if="noteToDelete" v-model="isDeleteConfirmOpen">
                <v-card>
                    <v-card-title class="headline">⚠️ Are you sure you want to delete this note?</v-card-title>
                    <v-card-text>
                        <v-textarea v-model="noteToDelete.content" rows="35" outlined class="note-textarea" disabled></v-textarea>
                    </v-card-text>
                    <v-card-actions class="justify-space-between">
                        <v-btn @click="isDeleteConfirmOpen = false">Cancel</v-btn>
                        <v-btn color="red" @click="deleteNote()">Delete now</v-btn>
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
            currentNote: "",
            savedNotes: [],
            isNoteModalOpen: false,
            isDeleteConfirmOpen: false,
            noteToDelete: null,
            editingNote: null,
            searchQuery: "",
        };
    },
    computed: {
        sortedFilteredNotes() {
            return this.savedNotes
                .filter(
                    (note) =>
                        note.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        note.content.toLowerCase().includes(this.searchQuery.toLowerCase()),
                )
                .sort((a, b) => b.id - a.id);
        },
        updateButtonDisabled() {
            const noteToUpdate = this.savedNotes.find((note) => note.id === this.editingNote.id);
            return this.editingNote.content == noteToUpdate.content;
        },
    },
    mounted() {
        this.loadNotes();
        this.loadCurrentNote();
    },
    methods: {
        exportNotes() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.savedNotes));
            const downloadAnchorNode = document.createElement("a");
            downloadAnchorNode.setAttribute("href", dataStr);
            const stringDate = new Date().toISOString().slice(0, 10);
            downloadAnchorNode.setAttribute("download", `my-speedy-notes-${stringDate}.json`);
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        },
        importNotes() {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const data = JSON.parse(reader.result);
                        let importedNotes = 0;
                        for (const note of data) {
                            //Verificamos si la nota ya existe, comparando el contenido
                            const existingNote = this.savedNotes.find((n) => n.content === note.content);
                            if (existingNote) continue;

                            const maxNoteId = Math.max(...this.savedNotes.map((n) => n.id));
                            note.id = maxNoteId + 1;
                            note.title = `Nota ${note.id}`;
                            this.savedNotes.push(note);
                            importedNotes++;
                        }
                        this.savedNotes.sort((a, b) => b.date.localeCompare(a.date));
                        // Hacemos un alert con la cantidad de notas importadas usando algun emoticon
                        if (importedNotes > 0) alert(`🎉 ${importedNotes} notes imported!`);
                        else alert("⚠️ All notes already exist in your notepad.");
                        this.saveToLocalStorage();
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        },
        saveNote() {
            if (this.currentNote) {
                const currentDate = this.getCurrentDate();

                // ID autoincremental
                const newId = this.savedNotes.length > 0 ? Math.max(...this.savedNotes.map((note) => note.id)) + 1 : 1;

                this.savedNotes.push({
                    id: newId,
                    title: `Nota ${newId}`,
                    content: this.currentNote,
                    date: currentDate,
                });

                this.currentNote = "";
                this.saveToLocalStorage();
                localStorage.removeItem("currentNote");

                // Focus on the textarea
                this.$nextTick(() => {
                    this.$refs.currentTextarea.focus();
                });
            }
        },
        loadNotes() {
            const savedNotes = localStorage.getItem("savedNotes");
            if (savedNotes) {
                this.savedNotes = JSON.parse(savedNotes);
            }
        },
        saveToLocalStorage() {
            localStorage.setItem("savedNotes", JSON.stringify(this.savedNotes));
        },
        loadCurrentNote() {
            const storedCurrentNote = localStorage.getItem("currentNote");
            if (storedCurrentNote) {
                this.currentNote = storedCurrentNote;
            }
        },
        autoSaveCurrentNote() {
            localStorage.setItem("currentNote", this.currentNote);
        },
        openNoteModal(note) {
            this.editingNote = JSON.parse(JSON.stringify(note));
            this.isNoteModalOpen = true;
        },
        updateNote() {
            const noteToUpdate = this.savedNotes.find((note) => note.id === this.editingNote.id);
            noteToUpdate.content = this.editingNote.content;
            this.saveToLocalStorage();
            this.isNoteModalOpen = false;
            this.editingNote = null;
        },
        confirmDelete(note) {
            this.noteToDelete = note;
            this.isDeleteConfirmOpen = true;
        },
        deleteNote() {
            if (!this.noteToDelete) return;

            this.savedNotes = this.savedNotes.filter((note) => note.id !== this.noteToDelete.id);
            this.noteToDelete = null;
            this.saveToLocalStorage();
            this.isDeleteConfirmOpen = false;
        },
        getCurrentDate() {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, "0");
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const year = today.getFullYear();
            return `${day}/${month}/${year}`;
        },
        formatDate(dateString) {
            return dateString;
        },
    },
};
</script>

<style scoped lang="scss">
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
    background-color: #282828;
    color: #aaaaaa;
    transition: all 0.2s ease;
    width: 300px;

    &:hover {
        background-color: #ffffff10;
        transform: scale(1.05);
    }
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

.search-box {
    max-width: 500px;
}

.save-button {
    position: absolute;
    right: 20px;
    bottom: 10px;
}
</style>
