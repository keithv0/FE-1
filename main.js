const books=[];
const render_event='render-the-book';
const saved_book='saved-book';
const keyStorage="my-book";


function cekStorage(){
    if (typeof Storage === "undefined" ) {
        alert("Browser anda tidak mendukung local storage");
        return false;
    }
    return true;
}

function saveData() {
    if (cekStorage()) {
        const parsed=JSON.stringify(books);
        
        localStorage.setItem(keyStorage, parsed);
        document.dispatchEvent(new Event(saved_book));
    }
}

document.addEventListener(saved_book, function() {
    console.log(localStorage.getItem(keyStorage));

    console.log("Berhasil Disimpan");
})

document.addEventListener('DOMContentLoaded', function() {
    
    const formSubmit=document.getElementById('bookForm');
    formSubmit.addEventListener('submit', function(event) {
        event.preventDefault();
        tambahBuku();
    });

    if(cekStorage()) {
        ambilData();
    }
});

function tambahBuku() {
    const judulBuku=document.getElementById('bookFormTitle').value;
    const penulisBuku=document.getElementById('bookFormAuthor').value;
    const tahunTerbit=document.getElementById('bookFormYear').value;
    const isComplete=document.getElementById('bookFormIsComplete').checked;

    const id=generateId();

    const bookObject=generateBookObject(id, judulBuku, penulisBuku, tahunTerbit, isComplete);

    books.push(bookObject);
    document.dispatchEvent(new Event(render_event));

    saveData()
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, judulBuku, penulisBuku, tahunTerbit, isComplete) {
    return{
        id,
        judulBuku,
        penulisBuku,
        tahunTerbit,
        isComplete
    }
}

document.addEventListener(render_event, function() {
    const inCompleted=document.getElementById('incompleteBookList');

    if(inCompleted) {
        inCompleted.innerHTML="";
    }

    const completed=document.getElementById("completeBookList");
    completed.innerHTML="";

    const searchBook=document.getElementById('hasilCari');
    searchBook.innerHTML=""

    for( const bookItem of books) {
        const bookElement=buatBuku(bookItem);

        if(!bookItem.isComplete) {
            inCompleted.append(bookElement);
        }else {
            completed.append(bookElement);
        }
    }

});

function buatBuku(bookObject) {

    const containerAll=document.createElement("div");
    containerAll.setAttribute("data-bookid", bookObject.id);
    containerAll.setAttribute("data-testid", "bookItem");
    containerAll.classList.add("konten");
    
    const judulBuku=document.createElement('h2');
    judulBuku.setAttribute("data-testid", "bookItemTitle");
    judulBuku.innerText=bookObject.judulBuku;
    judulBuku.classList.add('judul-buku')

    const penulisBuku=document.createElement('p');
    penulisBuku.setAttribute("data-testid", "bookItemAuthor");
    penulisBuku.innerText=bookObject.penulisBuku;
    penulisBuku.classList.add('penulis-buku')

    const tahunTerbit=document.createElement('p')
    tahunTerbit.setAttribute("data-testid", "bookItemYear");
    tahunTerbit.innerText=bookObject.tahunTerbit;
    tahunTerbit.classList.add('tahun-terbit')

    const containerButton=document.createElement("div");
    containerButton.classList.add("button-container");


    if(bookObject.isComplete) {
        const undoButton=document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.setAttribute("data-testid", "bookItemEditButton");
        undoButton.innerText="Belum Selesai";

        undoButton.addEventListener("click", function() {
            undoBook(bookObject.id);
        });

        const trashButton= document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.setAttribute("data-testid", "bookItemDeleteButton");
        trashButton.innerText="Hapus Buku";

        trashButton.addEventListener('click', function() {
            removeTask(bookObject.id);
        });

        containerButton.append(undoButton, trashButton);
    } else {

        const chekButton=document.createElement('button');
        chekButton.classList.add('check-button');
        chekButton.setAttribute("data-testid", "bookItemIsCompleteButton");
        chekButton.innerText="Selesai Dibaca";

        chekButton.addEventListener('click', function() {
            addTask(bookObject.id);
        });
        const trashButton=document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.setAttribute("data-testid", "bookItemDeleteButton");
        trashButton.innerText="Hapus Buku";

        trashButton.addEventListener("click", function() {
            removeTask(bookObject.id);
        });
        containerButton.append(chekButton, trashButton);
    }
    containerAll.append(judulBuku, penulisBuku, tahunTerbit, containerButton);

    return containerAll;
};

function addTask(bookid) {
    const bookTarget=findBook(bookid);

    if (bookTarget == null) {
        return;
    }

    bookTarget.isComplete=true;

    document.dispatchEvent(new Event(render_event));

    saveData();
};

function findBook(bookid) {
    for (const bookItem of books) {
        if(bookItem.id === bookid) {
            return bookItem;
        }
    }
    return null;
};

function removeTask(bookid) {
    const bookTarget=findBookIndex(bookid);

    if(bookTarget === -1 ) return;

    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(render_event))
    saveData();
}

function findBookIndex(bookid) {
    for (const index in books) {
        if(books[index].id === bookid) {
            return index;
        }
    }
    return -1;
};

function undoBook(bookid) {
    const bookTarget=findBook(bookid);

    if(bookTarget == null ) return;
    bookTarget.isComplete=false;

    document.dispatchEvent(new Event(render_event));

    saveData();
};

function ambilData() {
    const serializeData=localStorage.getItem(keyStorage);
    let data=JSON.parse(serializeData);

    if(data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(render_event));
}


const searchForm=document.getElementById("searchBook");
const searchInput=document.getElementById("searchBookTitle")
const btnSearch=document.getElementById("searchSubmit");
const searchDiv=document.getElementById("hasilCari");

function searchBook(event) {
    event.preventDefault();
    const keyword=searchInput.value.toLowerCase();
    const filterBook=books.filter(book => book.judulBuku.toLowerCase().includes(keyword));

    searchDiv.innerHTML="";

    if(filterBook.length>0) {
        filterBook.forEach(book => {
            // const bookItem=document.createElement("div");
            // bookItem.className="book-item";
            // bookItem.textContent=book.judulBuku;

            // searchDiv.appendChild(bookItem);


            const containerAll=document.createElement("div");
            containerAll.classList.add('konten');
            containerAll.setAttribute("data-testid", "bookItem");

            const bookTitle=document.createElement("h2");
            bookTitle.classList.add("judul-buku");
            bookTitle.setAttribute("data-testid","bookItemTitle");
            bookTitle.innerText=book.judulBuku;

            const authorBook=document.createElement("p")
            authorBook.classList.add('penulis-buku');
            authorBook.innerText=book.penulisBuku;

            const publicationYear=document.createElement('p');
            publicationYear.classList.add('tahun-terbit')
            publicationYear.innerText=book.tahunTerbit;

            const statusBaca=document.createElement('p');
            statusBaca.classList.add('status-cari');
            statusBaca.innerText=book.isComplete?"Sudah Dibaca" :"Belum Dibaca";

            containerAll.append(bookTitle, authorBook, publicationYear,  statusBaca);
            searchDiv.append(containerAll);
        });
    } else {
        
        const notFoundBook=document.createElement("h4");
        notFoundBook.innerText="Buku Tidak Ditemukan";
        searchDiv.append(notFoundBook);
    }
}

searchForm.addEventListener('submit', searchBook);
