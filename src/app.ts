/* eslint-disable @typescript-eslint/no-non-null-assertion */
class Book {
    public title: string;
    public author: string;
    public isbn: string;
    public constructor(title: string, author: string, isbn: string) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class Store {
    private static books: Book[];

    public static getBooks(): Book[] {
        if (localStorage.getItem("books") == null) {
            this.books = [];
        } else {
            this.books = JSON.parse(localStorage.getItem("books")!);
        }
        return this.books;
    }

    public static addBook(book: Book): void {
        const books = this.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    public static removeBook(isbn: string): void {
        const books = this.getBooks();
        books.forEach((book, index): void => {
            if (book.isbn == isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem("books", JSON.stringify(books));
    }
}

class UI {
    public static displayBooks(): void {
        const books = Store.getBooks();
        books.forEach((book): void => {
            UI.addBookToList(book);
        });
    }

    public static addBookToList(book: Book): void {
        const list = document.getElementById("book-list")!;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    public static deleteBook(el: HTMLElement): void {
        if (el.classList.contains("delete")) {
            el.parentElement!.parentElement!.remove();
        }
    }

    public static showAlert(message: string, className: string): void {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container")!;
        const form = document.getElementById("book-form")!;
        container.insertBefore(div, form);
        setTimeout((): void => {
            document.querySelector(".alert")!.remove();
        }, 3000);
    }

    public static clearFields(): void {
        (document.getElementById("title") as HTMLInputElement).value = "";
        (document.getElementById("author") as HTMLInputElement).value = "";
        (document.getElementById("isbn") as HTMLInputElement).value = "";
    }
}

document.addEventListener("DOMContentLoaded", UI.displayBooks);

document.getElementById("book-form")!.addEventListener("submit", (e): void => {
    e.preventDefault();
    const title = (document.getElementById("title") as HTMLInputElement).value;
    const author = (document.getElementById("author") as HTMLInputElement).value;
    const isbn = (document.getElementById("isbn") as HTMLInputElement).value;
    if (title == "" || author == "" || isbn == "") {
        UI.showAlert("Please fill in all fields", "danger");
    } else {
        const book = new Book(title, author, isbn);
        UI.addBookToList(book);
        Store.addBook(book);
        UI.showAlert("Book Added", "success");
        UI.clearFields();
    }
});

document.getElementById("book-list")!.addEventListener("click", (e): void => {
    let target = e.target as HTMLElement;
    UI.deleteBook(target);
    Store.removeBook(target.parentElement!.previousElementSibling!.textContent!);
    UI.showAlert("Book Removed", "success");
});
