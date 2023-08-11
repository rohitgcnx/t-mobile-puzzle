import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { addToReadingList, getReadingList, removeFromReadingList } from '@tmo/books/data-access';
import { Book } from '@tmo/shared/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent implements OnDestroy {
  readingList$ = this.store.select(getReadingList);
  subscriptions: Subscription[] = [];

  constructor(
    private readonly store: Store,
    private _snackBar: MatSnackBar
  ) {}

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
    this.showPrompt(item);
  }

  showPrompt(item) {
    const snackBarRef = this._snackBar.open('Removed', 'Undo', {
      duration: 3000
    });
    
    const snackSubscription: Subscription = snackBarRef.onAction().subscribe(() => {
      const book: Book = {
        id: item.id,
        ...item
      }
      this.store.dispatch(addToReadingList({book}))
    })
    this.subscriptions.push(snackSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}