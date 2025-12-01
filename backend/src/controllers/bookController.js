import Book from "../models/Book.js";

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los libros" });
  }
};

export const createBook = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      const error = new Error("El título es obligatorio");
      return res.status(400).json({ error: error.message });
    }

    const book = new Book({ title: title.trim() });
    await book.save();

    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el libro" });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || title.trim() === "") {
      const error = new Error("El título es obligatorio");
      return res.status(400).json({ error: error.message });
    }

    const book = await Book.findById(id);

    if (!book) {
      const error = new Error("Libro no encontrado");
      return res.status(404).json({ error: error.message });
    }

    book.title = title.trim();
    await book.save();

    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el libro" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      const error = new Error("Libro no encontrado");
      return res.status(404).json({ error: error.message });
    }

    await book.deleteOne();

    res.json({ message: "Libro eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el libro" });
  }
};
