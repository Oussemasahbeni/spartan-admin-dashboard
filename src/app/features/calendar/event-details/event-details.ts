import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EventApi } from '@fullcalendar/core/index.js';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideAlignLeft, lucideCalendar, lucideClock, lucideMapPin, lucideTag } from '@ng-icons/lucide';
import { injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
  selector: 'adm-event-details',
  imports: [
    HlmDialogImports,
    HlmButtonImports,
    HlmBadgeImports,
    HlmIconImports,
    HlmSeparatorImports,
    TranslocoModule,
    DatePipe,
  ],
  providers: [
    provideIcons({
      lucideCalendar,
      lucideClock,
      lucideMapPin,
      lucideAlignLeft,
      lucideTag,
    }),
  ],
  templateUrl: './event-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetails {
  private readonly _dialogContext = injectBrnDialogContext<{ event: EventApi }>();

  readonly event = signal(this._dialogContext.event);
}
