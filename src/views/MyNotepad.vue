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
                    <v-btn @click="importNotes" outlined color="secondary" class="my-2 import-button"> <v-icon>mdi-download</v-icon>Import </v-btn>
                    <v-btn @click="exportNotes" outlined color="secondary" class="my-2 export-button ml-2" :class="getSpecialClasses"
                        ><v-icon>mdi-upload</v-icon> Export</v-btn
                    >
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
const LAST_EXPORTED_DATE_KEY = "lastExportedDate";
const LAST_EXPORTED_DATA_KEY = "lastExportedData";
import { WarmConfirmAsync } from "../plugins/sweet-alerts";
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
            lastExportedDate: new Date().toISOString(),
            lastExportedData: null,
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
        getSpecialClasses() {
            const lastExportedData = this.lastExportedData;
            if (!lastExportedData) return ["bg-pulse"];

            // Verify if current notes and saved notes are the same as the last exported data
            const lastExportedNotes = JSON.parse(lastExportedData);
            const sameCurrentNotes = JSON.stringify(this.currentNote) === JSON.stringify(lastExportedNotes.currentNote);
            const sameSavedNotes = JSON.stringify(this.savedNotes) === JSON.stringify(lastExportedNotes.savedNotes);

            if (sameCurrentNotes && sameSavedNotes) return [];

            return ["bg-pulse"];
        },
    },
    mounted() {
        this.lastExportedData = localStorage.getItem(LAST_EXPORTED_DATA_KEY);
        this.loadNotes();
        this.loadCurrentNote();
        this.CheckLastExportedNotes();
    },
    methods: {
        exportNotes() {
            const { savedNotes, currentNote } = this;
            const dataToSave = { savedNotes, currentNote };
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToSave));
            const downloadAnchorNode = document.createElement("a");
            downloadAnchorNode.setAttribute("href", dataStr);
            const stringDate = new Date().toISOString().slice(0, 10);
            console.log(import.meta.env.DEV);
            const fileName = `${import.meta.env.DEV ? "dev-" : ""}my-speedy-notes-${stringDate}.json`;
            downloadAnchorNode.setAttribute("download", fileName);
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            const now = new Date().toISOString();
            this.lastExportedDate = now;
            localStorage.setItem(LAST_EXPORTED_DATE_KEY, now);
            localStorage.setItem(LAST_EXPORTED_DATA_KEY, JSON.stringify(dataToSave));
            this.lastExportedData = JSON.stringify(dataToSave);
        },
        verifyImportedData(data) {
            if (!data) return false;
            if (!data.savedNotes || !data.currentNote) return false;
            if (!Array.isArray(data.savedNotes)) return false;
            if (typeof data.currentNote !== "string") return false;
            return true;
        },
        tryGetJsonFromData(data) {
            try {
                return JSON.parse(data);
            } catch (error) {
                return null;
            }
        },
        async importNotes() {
            const confirmResult = await WarmConfirmAsync(
                "Are you sure you want to continue?",
                "This process will add notes that doesn't exist in your current list, and will overwrite your not saved current note",
            );
            if (!confirmResult) return;

            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        console.log(typeof reader.result);
                        const data = this.tryGetJsonFromData(reader.result);
                        if (!this.verifyImportedData(data)) return alert("Invalid file format");

                        let importedNotes = 0;
                        for (const note of data.savedNotes) {
                            const existingNote = this.savedNotes.find((n) => n.content === note.content);
                            if (existingNote) continue;

                            const maxNoteId = Math.max(...this.savedNotes.map((n) => n.id));
                            note.id = maxNoteId + 1;
                            note.title = `Nota ${note.id}`;
                            this.savedNotes.push(note);
                            importedNotes++;
                        }
                        this.savedNotes.sort((a, b) => b.date.localeCompare(a.date));
                        if (importedNotes > 0) alert(`🎉 ${importedNotes} notes imported!`);
                        else alert("⚠️ All notes already exist in your notes.");

                        this.currentNote = data.currentNote;

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
        CheckLastExportedNotes() {
            const lastExportedNotes = localStorage.getItem(LAST_EXPORTED_DATE_KEY);
            if (lastExportedNotes) {
                this.lastExportedDate = lastExportedNotes;
                return;
            }

            const now = new Date().toISOString();
            localStorage.setItem(LAST_EXPORTED_DATE_KEY, now);
            this.lastExportedDate = now;
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
