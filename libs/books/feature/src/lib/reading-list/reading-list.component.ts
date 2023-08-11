import { Component } from '@angular/core';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList, markBookAsFinished, initMarkBookAsFinished } from '@tmo/books/data-access';
import { ReadingListItem } from '@tmo/shared/models';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);

  constructor(private readonly store: Store) {}

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
  }

  markBookAsFinished(item) {
    if (!item.finished) {
      const update: Update<ReadingListItem> = {
        id: item?.bookId,
        changes: { 
          finished: !item.finished,
          finishedDate: new Date().toISOString()
        }
      };
      this.store.dispatch(initMarkBookAsFinished({update}));
    }
  }
}