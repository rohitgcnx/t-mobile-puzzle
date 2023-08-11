import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  removeFromReadingList,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder, FormControl } from '@angular/forms';
import { Book, ReadingListItem } from '@tmo/shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books: ReadingListBook[];
  subscriptions: Subscription[] = [];

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    public _snackBar: MatSnackBar
  ) {}

  set searchTerm(term: string) {
    this.searchForm.setValue({term});
  }
  
  get searchTerm(): string {
    return (this.searchForm.get('term') as FormControl).value;
  }

  ngOnInit(): void {
    const storeSubscription: Subscription = this.store.select(getAllBooks).subscribe(books => {
      this.books = books;
    });
    this.subscriptions.push(storeSubscription);
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
    this.showPrompt(book);
  }

  searchExample() {
    this.searchTerm = 'javascript';
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  trackByFn(item: Book): string {
    return item.id;
  }

  showPrompt(book: Book) {
    const snackBarRef = this._snackBar.open('Added', 'Undo', {
      duration: 3000
    });
    
    const snackSubscription: Subscription = snackBarRef.onAction().subscribe(() => {
      const item: ReadingListItem = {
        bookId: book.id,
        ...book
      }
      this.store.dispatch(removeFromReadingList({ item }))
    })
    this.subscriptions.push(snackSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}