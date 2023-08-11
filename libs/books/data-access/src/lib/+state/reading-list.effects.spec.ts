import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule, createBook, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });

  describe('markBookFinished$', () => {
    it('should work', done => {
      const item = createReadingListItem('A');
      const updatedItem = {
        update: {
          id: 'A',
          changes: {
            finished: true,
            finishedDate: new Date().toISOString()
          }
        }
      };
      actions = new ReplaySubject();
      actions.next(ReadingListActions.initMarkBookAsFinished(updatedItem));
      
      effects.markBookFinished$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.markBookAsFinished(updatedItem)
        );
        done();
      });
      const req = httpMock.expectOne(`/api/reading-list/${item.bookId}/finished`)
      req.flush(updatedItem);
      expect(req.request.method).toEqual('PUT');
    })

    it('should return failedMarkBookAsFinishedaction with ReadingListItem, on fail', done => {
      const item = createReadingListItem('A');
      actions = new ReplaySubject();
      const updatedItem = {
        update: {
          id: 'A',
          changes: {
            finished: true,
            finishedDate: new Date().toISOString()
          }
        }
      };
      actions.next(ReadingListActions.initMarkBookAsFinished(updatedItem));
      actions.next(ReadingListActions.markBookAsFinished(updatedItem));
      effects.markBookFinished$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.failedToMarkBookAsFinished(updatedItem)
        );
        done();
      });
      httpMock.expectOne(`/api/reading-list/${item.bookId}/finished`).flush(updatedItem, { status: 400, statusText: 'Bad Request' });
    });
  })
});