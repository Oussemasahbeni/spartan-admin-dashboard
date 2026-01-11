import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, input, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideFile, lucideX } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { BytesPipe } from 'ngx-oneforall/pipes/bytes';

@Component({
  selector: 'adm-attachment-card',
  templateUrl: './attachment-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmIconImports, BytesPipe, TranslocoModule],
  providers: [
    provideIcons({
      lucideFile,
      lucideX,
    }),
  ],
})
export class AttachmentCard {
  private readonly platformId = inject(PLATFORM_ID);

  readonly file = input.required<File>();

  remove = output<void>();

  handleRemove(): void {
    this.remove.emit();
  }

  /** Check if file is an image */
  isImageFile(): boolean {
    return this.file().type.startsWith('image/');
  }

  /** Get file preview URL for images */
  getFilePreviewUrl(): string {
    if (isPlatformBrowser(this.platformId) && this.isImageFile()) {
      return URL.createObjectURL(this.file());
    }
    return '';
  }
}
