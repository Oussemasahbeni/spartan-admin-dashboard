import { DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { LanguageService } from '@core/config/language-service';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideFile,
  lucideFileArchive,
  lucideFileChartColumn,
  lucideFileImage,
  lucideFileText,
  lucideStar,
} from '@ng-icons/lucide';
import { BytesPipe } from '@shared/pipes/bytes/bytes.pipe';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { FILE_ICONS, FileManagerFile } from '../../model/file';
import { FileActions } from '../file-actions/file-actions';

@Component({
  selector: 'adm-file-grid-view',
  imports: [TranslocoModule, NgIcon, HlmButtonImports, HlmCardImports, FileActions, BytesPipe, DatePipe],
  providers: [
    provideIcons({
      lucideFile,
      lucideFileArchive,
      lucideFileChartColumn,
      lucideFileImage,
      lucideFileText,
      lucideStar,
    }),
  ],
  host: {
    class: 'grid gap-4 sm:grid-cols-2 xl:grid-cols-4',
  },
  template: `
    <ng-container *transloco="let t; prefix: 'fileManager'">
      @for (file of files(); track file.id) {
        <hlm-card size="sm" class="group/file">
          <div hlmCardContent>
            <div class="bg-muted/50 relative flex h-36 items-center justify-center rounded-lg">
              <ng-icon class="text-muted-foreground" size="48" aria-hidden="true" [name]="fileIcons[file.kind]" />
              <button
                hlmBtn
                variant="secondary"
                size="icon-sm"
                type="button"
                class="absolute inset-e-2 top-2 opacity-0 group-hover/file:opacity-100 focus-visible:opacity-100"
                [class.opacity-100]="file.starred"
                [attr.aria-label]="t(file.starred ? 'files.unstar' : 'files.star', { name: file.name })"
                (click)="toggleStar.emit(file.id)"
              >
                <ng-icon name="lucideStar" [class]="file.starred ? '[&_svg]:fill-current' : ''" />
              </button>
              <div class="text-muted-foreground absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 text-xs">
                <span>{{ t('kind.' + file.kind) }}</span>
                <span>{{ file.size | bytes }}</span>
              </div>
            </div>
          </div>
          <hlm-card-header>
            <h3 hlmCardTitle class="truncate">{{ file.name }}</h3>
            <p hlmCardDescription class="truncate">
              {{
                t('files.modifiedBy', {
                  date: file.modifiedAt | date: 'mediumDate' : undefined : lang(),
                  owner: file.owner,
                })
              }}
            </p>
            <div hlmCardAction>
              <adm-file-actions [file]="file" (toggleStar)="toggleStar.emit(file.id)" />
            </div>
          </hlm-card-header>
        </hlm-card>
      }
    </ng-container>
  `,
})
export class FileGridView {
  protected readonly lang = inject(LanguageService).currentLang;

  public readonly files = input.required<FileManagerFile[]>();

  public readonly toggleStar = output<string>();

  protected readonly fileIcons = FILE_ICONS;
}
