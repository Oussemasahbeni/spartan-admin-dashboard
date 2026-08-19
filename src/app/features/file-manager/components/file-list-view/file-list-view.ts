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
import { InitialsPipe } from '@shared/pipes/initials/initials.pipe';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { FILE_ICONS, FileManagerFile } from '../../model/file';
import { FileActions } from '../file-actions/file-actions';

@Component({
  selector: 'adm-file-list-view',
  imports: [
    TranslocoModule,
    NgIcon,
    HlmAvatarImports,
    HlmBadgeImports,
    HlmButtonImports,
    HlmTableImports,
    FileActions,
    BytesPipe,
    DatePipe,
    InitialsPipe,
  ],
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
    class: 'block',
  },
  template: `
    <table *transloco="let t; prefix: 'fileManager.files'" hlmTable>
      <thead hlmTHead>
        <tr hlmTr>
          <th hlmTh class="ps-0">{{ t('name') }}</th>
          <th hlmTh class="hidden md:table-cell">{{ t('owner') }}</th>
          <th hlmTh class="hidden lg:table-cell">{{ t('modified') }}</th>
          <th hlmTh class="hidden sm:table-cell">{{ t('size') }}</th>
          <th hlmTh class="w-20">
            <span class="sr-only">{{ t('actions') }}</span>
          </th>
        </tr>
      </thead>
      <tbody hlmTBody>
        @for (file of files(); track file.id) {
          <tr hlmTr>
            <td hlmTd class="ps-0">
              <div class="flex min-w-0 items-center gap-3">
                <ng-icon class="text-muted-foreground shrink-0" size="20" [name]="fileIcons[file.kind]" />
                <button hlmBtn variant="link" size="sm" type="button" class="h-auto max-w-72 justify-start px-0">
                  <span class="truncate">{{ file.name }}</span>
                </button>
                @if (file.shared) {
                  <hlm-badge variant="outline" class="hidden xl:inline-flex">{{ t('shared') }}</hlm-badge>
                }
              </div>
            </td>
            <td hlmTd class="hidden md:table-cell">
              <div class="flex items-center gap-2">
                <hlm-avatar size="sm">
                  <span hlmAvatarFallback>{{ file.owner | initials }}</span>
                </hlm-avatar>
                <span>{{ file.owner }}</span>
              </div>
            </td>
            <td hlmTd class="text-muted-foreground hidden lg:table-cell">
              {{ file.modifiedAt | date: 'mediumDate' : undefined : lang() }}
            </td>
            <td hlmTd class="text-muted-foreground hidden sm:table-cell">
              {{ file.size | bytes }}
            </td>
            <td hlmTd>
              <div class="flex items-center justify-end">
                <button
                  hlmBtn
                  variant="ghost"
                  size="icon-sm"
                  type="button"
                  [attr.aria-label]="t(file.starred ? 'unstar' : 'star', { name: file.name })"
                  (click)="toggleStar.emit(file.id)"
                >
                  <ng-icon name="lucideStar" [class]="file.starred ? '[&_svg]:fill-current' : ''" />
                </button>
                <adm-file-actions [file]="file" (toggleStar)="toggleStar.emit(file.id)" />
              </div>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class FileListView {
  protected readonly lang = inject(LanguageService).currentLang;

  public readonly files = input.required<FileManagerFile[]>();

  public readonly toggleStar = output<string>();

  protected readonly fileIcons = FILE_ICONS;
}
