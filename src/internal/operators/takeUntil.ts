import { lift } from 'rxjs/internal/util/lift';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { fromSource } from "rxjs/internal/sources/fromSource";
import { FOType, ObservableInput, OperatorFunction, Sink, SinkArg } from 'rxjs/internal/types';

export function takeUntil<T>(notifier: ObservableInput<any>): OperatorFunction<T, T> {
  return lift((source: Observable<T>, dest: Sink<T>, subs: Subscription) => {
    let notified = false;
    const notifierSubs = new Subscription();
    subs.add(notifierSubs);

    fromSource(notifier)(FOType.SUBSCRIBE, (t: FOType, v: SinkArg<any>, notiferSubs: Subscription) => {
      if (t === FOType.NEXT) {
        notified = true;
        dest(FOType.COMPLETE, undefined, subs);
        subs.unsubscribe();
      }
    }, notifierSubs);

    if (!notified) {
      source(FOType.SUBSCRIBE, dest, subs);
    }
  });
}
