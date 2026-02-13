// Fake in-memory database
let books = [
    { id: 1, title: 'Atomic Habits', author: 'James Clear' },
    { id: 2, title: 'Deep Work', author: 'Cal Newport' }
];

// GET /books
exports.getAllBooks = (req, res) => {
    res.json(books);
};

// GET /books/:id
exports.getBookById = (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
};

// POST /books
exports.createBook = (req, res) => {
    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author
    };

    books.push(newBook);
    res.status(201).json(newBook);
};

// PUT /books/:id
exports.updateBook = (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    book.title = req.body.title;
    book.author = req.body.author;

    res.json(book);
};

// DELETE /books/:id
exports.deleteBook = (req, res) => {
    const id = parseInt(req.params.id);
    books = books.filter(b => b.id !== id);

    res.json({ message: 'Book deleted successfully' });
};
