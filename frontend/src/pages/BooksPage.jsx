import { useState, useEffect } from "react";
import { getBooks, createBook, updateBook, deleteBook } from "../api/books";
import Header from "../components/Header";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoadingBooks(true);
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      console.error("Error al obtener los libros:", error);
    } finally {
      setIsLoadingBooks(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createBook({ title });
      setTitle("");
      fetchBooks();
    } catch (error) {
      setError(error.response?.data?.error || "Error al crear el libro");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Estás seguro de eliminar este libro?")) return;

    try {
      setDeletingId(id);
      await deleteBook(id);
      fetchBooks();
    } catch (error) {
      console.error("Error al eliminar el libro:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartEdit = (book) => {
    setEditingId(book._id);
    setEditTitle(book.title);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const handleUpdate = async (id) => {
    if (!editTitle.trim()) {
      setError("El título es obligatorio");
      return;
    }

    try {
      setUpdatingId(id);
      setError("");
      await updateBook(id, { title: editTitle });
      setEditingId(null);
      setEditTitle("");
      fetchBooks();
    } catch (error) {
      setError(error.response?.data?.error || "Error al actualizar el libro");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">My Books Collection</h1>
          <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del libro"
            className="flex-1 bg-transparent border border-gray-600 rounded-lg px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="border border-gray-600 rounded-lg px-8 py-4 text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {/* Loading state */}
        {isLoadingBooks && (
          <div className="text-center text-gray-500 py-12">
            Cargando libros...
          </div>
        )}

        {!isLoadingBooks && books.length > 0 && (
          <div className="space-y-4">
            {books.map((book) => (
              <div
                key={book._id}
                className="border border-gray-700 rounded-lg px-6 py-4 flex items-center justify-between hover:border-gray-600 transition-colors"
              >
                {editingId === book._id ? (
                  <>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 mr-4"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(book._id)}
                        disabled={updatingId === book._id}
                        className="border border-gray-600 rounded-lg px-6 py-2 text-white hover:bg-green-900/20 hover:border-green-500 transition-colors disabled:opacity-50"
                      >
                        {updatingId === book._id ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={updatingId === book._id}
                        className="border border-gray-600 rounded-lg px-6 py-2 text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-white">{book.title}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartEdit(book)}
                        className="border border-gray-600 rounded-lg px-6 py-2 text-white hover:bg-blue-900/20 hover:border-blue-500 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        disabled={deletingId === book._id}
                        className="border border-gray-600 rounded-lg px-6 py-2 text-white hover:bg-red-900/20 hover:border-red-500 transition-colors disabled:opacity-50"
                      >
                        {deletingId === book._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {!isLoadingBooks && books.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No hay libros agregados
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default BooksPage;
