import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder, FormControl } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { 
  debounceTime, 
  distinctUntilChanged,
} from 'rxjs/operators';
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
    private readonly fb: FormBuilder
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

    const inputSubscription: Subscription = this.searchForm.get('term').valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.searchBooks();
    })

    this.subscriptions.push(inputSubscription);
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchTerm = 'javascript';
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchTerm) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  trackByFn(item: Book): string {
    return item.id;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}