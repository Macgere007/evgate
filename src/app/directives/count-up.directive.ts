import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { animationFrameScheduler, BehaviorSubject, combineLatest, distinctUntilChanged, endWith, interval, map, switchMap, takeUntil, takeWhile } from 'rxjs';
import { Destroy } from './destroy';

const easeOutQuad = (x: number): number => x * (2 - x);

@Directive({
  selector: '[appCountUp]',
  // 'Destroy' is provided at the directive level
  providers: [Destroy],
})
export class CountUpDirective implements OnInit {

  private readonly count$ = new BehaviorSubject(0);
  private readonly duration$ = new BehaviorSubject(2000);
  private readonly last$ = new BehaviorSubject(100);

  private readonly currentCount$ = combineLatest([
    this.count$,
    this.last$,
    this.duration$
  ]).pipe(
    switchMap(([count, last, duration]) => {
      // get the time when animation is triggered
      const startTime = animationFrameScheduler.now();

      // use 'animationFrameScheduler' for better rendering performance
      return interval(0, animationFrameScheduler).pipe(
        // calculate elapsed time
        map(() => animationFrameScheduler.now() - startTime),
        // calculate progress
        map(elapsedTime => elapsedTime / duration),
        // complete when progress is greater than 1
        takeWhile(progress => progress <= 1),
        // apply quadratic ease-out function
        // for faster start and slower end of counting
        map(easeOutQuad),
        // calculate current count
        map(progress => last + Math.round(progress * (count - last))),
        // make sure that last emitted value is count
        endWith(count),
        distinctUntilChanged()
      );
    }),
  );

  @Input('appCountUp')
  set count(count: number) {
    //console.log('countUp set value to:', count);
    this.count$.next(count);
  }

  @Input()
  set last(last: number) {
    //console.log('countUp last set value to:', last);
    this.last$.next(last);
  }

  @Input()
  set duration(duration: number) {
    //console.log('countUp duration set value to:', duration);
    this.duration$.next(duration);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2,
    private readonly destroy$: Destroy
  ) { }

  ngOnInit(): void {
    this.displayCurrentCount();
  }

  private displayCurrentCount(): void {
    this.currentCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe((currentCount) => {
        //console.log('displayCurrentCount');
        this.renderer.setProperty(
          this.elementRef.nativeElement,
          'innerHTML',
          currentCount.toString()
        );
      });
  }
}
