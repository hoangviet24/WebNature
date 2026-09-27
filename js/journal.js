/* --- Journal Reader Modal & LocalStorage Logic --- */
const initialNotes = [
    {
        name: "Thanh Tùng",
        content: "Không gian tuyệt đẹp, lắng nghe tiếng hạc cầm và tiếng gió giúp tôi tìm lại sự tĩnh lặng sau những ngày làm việc mệt mỏi.",
        date: "25/09/2026"
    },
    {
        name: "Mộc Miên",
        content: "Cảm giác như được đứng giữa đồi hoa oải hương ngắm bình minh vậy. Thật bình yên!",
        date: "24/09/2026"
    }
];

function getStoredNotes() {
    const saved = localStorage.getItem('vale_journal_notes');
    return saved ? JSON.parse(saved) : initialNotes;
}

function saveNotes(notes) {
    localStorage.setItem('vale_journal_notes', JSON.stringify(notes));
}

function renderNotes() {
    const notes = getStoredNotes();
    const listElem = document.getElementById('journalList');
    const countElem = document.getElementById('journalCount');

    countElem.innerText = `${notes.length} ký sự`;
    listElem.innerHTML = '';

    notes.forEach((note, index) => {
        const item = document.createElement('div');
        item.className = 'glass-card p-4 rounded-xl space-y-2 border border-white/5 hover:border-amber-400/30 transition-all';
        item.innerHTML = `
            <div class="flex justify-between items-center text-xs text-amber-300">
                <span class="font-semibold">${escapeHTML(note.name)}</span>
                <span class="text-slate-400 font-mono">${note.date}</span>
            </div>
            <p class="text-slate-200 text-sm font-light leading-relaxed line-clamp-3">${escapeHTML(note.content)}</p>
            <button onclick="openJournalModal(${index})" class="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center space-x-1 pt-1">
                <i data-lucide="maximize-2" class="w-3 h-3"></i>
                <span>Phóng to xem hết nội dung</span>
            </button>
        `;
        listElem.appendChild(item);
    });
    lucide.createIcons();
}

function openJournalModal(index) {
    const notes = getStoredNotes();
    const note = notes[index];
    if (!note) return;

    document.getElementById('readJournalAuthor').innerText = note.name;
    document.getElementById('readJournalDate').innerText = note.date;
    document.getElementById('readJournalContent').innerText = note.content;
    document.getElementById('journalModal').classList.remove('hidden');
}

function closeJournalModal() {
    document.getElementById('journalModal').classList.add('hidden');
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

document.getElementById('journalForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('authorName');
    const contentInput = document.getElementById('journalContent');

    const newNote = {
        name: nameInput.value.trim(),
        content: contentInput.value.trim(),
        date: new Date().toLocaleDateString('vi-VN')
    };

    const notes = getStoredNotes();
    notes.unshift(newNote);
    saveNotes(notes);

    renderNotes();

    nameInput.value = '';
    contentInput.value = '';
});

// Initial Load
renderNotes();