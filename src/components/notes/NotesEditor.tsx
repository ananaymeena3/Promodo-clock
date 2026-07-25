import React, { useState } from 'react';
import { useNoteStore } from '../../store/useNoteStore';
import {
  FileText,
  Folder,
  Plus,
  Trash2,
  Pin,
  Search,
  Eye,
  Edit3,
  Tag,
  BookOpen,
} from 'lucide-react';
import { soundEngine } from '../../services/soundGenerator';

export const NotesEditor: React.FC = () => {
  const {
    notes,
    folders,
    activeNoteId,
    setActiveNoteId,
    createNote,
    updateNote,
    deleteNote,
    togglePinNote,
    searchQuery,
    setSearchQuery,
    selectedFolderId,
    setSelectedFolderId,
  } = useNoteStore();

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolderId ? n.folderId === selectedFolderId : true;
    return matchesSearch && matchesFolder;
  });

  const activeNote = notes.find((n) => n.id === activeNoteId);

  return (
    <div className="w-full max-w-7xl mx-auto h-[calc(100vh-120px)] flex gap-6">
      {/* Sidebar Folders & Notes List */}
      <div className="w-80 glass-panel rounded-3xl border border-white/10 p-4 flex flex-col h-full">
        {/* Top Folders selector */}
        <div className="space-y-1 pb-3 mb-3 border-b border-white/10">
          <button
            onClick={() => {
              soundEngine.playClickSound();
              setSelectedFolderId(null);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedFolderId === null
                ? 'bg-purple-600/30 text-white border border-purple-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>All Notes</span>
            <span className="ml-auto text-[10px] font-mono bg-white/5 px-1.5 py-0.5 rounded">{notes.length}</span>
          </button>

          {folders.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                soundEngine.playClickSound();
                setSelectedFolderId(f.id);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedFolderId === f.id
                  ? 'bg-purple-600/30 text-white border border-purple-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Folder className="w-4 h-4 text-amber-400" />
              <span>{f.name}</span>
            </button>
          ))}
        </div>

        {/* Search Notes & Add Button */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-8 pr-3 py-1.5 rounded-xl text-xs"
            />
          </div>
          <button
            onClick={() => {
              soundEngine.playClickSound();
              createNote();
            }}
            className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-600/30"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Notes Items List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredNotes.map((note) => {
            const isActive = note.id === activeNoteId;
            return (
              <div
                key={note.id}
                onClick={() => {
                  soundEngine.playClickSound();
                  setActiveNoteId(note.id);
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/50 text-white shadow-lg'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-white truncate max-w-[170px]">{note.title || 'Untitled'}</h4>
                  {note.isPinned && <Pin className="w-3 h-3 text-amber-400 fill-amber-400" />}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{note.content || 'Empty note content...'}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Note Main Editor Area */}
      <div className="flex-1 glass-panel rounded-3xl border border-white/10 p-6 flex flex-col h-full">
        {activeNote ? (
          <>
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                placeholder="Note Title..."
                className="bg-transparent text-xl font-extrabold text-white focus:outline-none w-full"
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isPreviewMode
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {isPreviewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
                </button>

                <button
                  onClick={() => togglePinNote(activeNote.id)}
                  className={`p-2 rounded-xl border ${
                    activeNote.isPinned
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  <Pin className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteNote(activeNote.id)}
                  className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl border border-white/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Note Content Input or Preview */}
            <div className="flex-1 overflow-y-auto">
              {isPreviewMode ? (
                <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed text-sm whitespace-pre-wrap font-sans">
                  {activeNote.content || '*No content to preview yet...*'}
                </div>
              ) : (
                <textarea
                  value={activeNote.content}
                  onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                  placeholder="Write your thoughts, Markdown documentation, or ideas here..."
                  className="w-full h-full bg-transparent text-slate-200 text-sm focus:outline-none resize-none font-mono leading-relaxed"
                />
              )}
            </div>

            {/* Footer Autosave status */}
            <div className="pt-3 border-t border-white/10 flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Autosaved locally</span>
              <span>Updated: {new Date(activeNote.updatedAt).toLocaleTimeString()}</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3">
            <FileText className="w-12 h-12 text-slate-600" />
            <p className="text-sm">Select or create a note to begin writing</p>
          </div>
        )}
      </div>
    </div>
  );
};
