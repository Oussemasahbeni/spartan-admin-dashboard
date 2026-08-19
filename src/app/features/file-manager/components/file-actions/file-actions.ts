import { Component, input, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideMoreVertical, lucideShare2, lucideStar, lucideTrash2 } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { FileManagerFile } from '../../model/file';

@Component({
  selector: 'adm-file-actions',
  imports: [TranslocoModule, NgIcon, HlmButtonImports, HlmDropdownMenuImports],
  providers: [provideIcons({ lucideDownload, lucideMoreVertical, lucideShare2, lucideStar, lucideTrash2 })],
  host: {
    class: 'contents',
  },
  template: `
    <ng-container *transloco="let t; prefix: 'fileManager.actions'">
      <button
        hlmBtn
        variant="ghost"
        size="icon-sm"
        type="button"
        [attr.aria-label]="t('actionsFor', { name: file().name })"
        [hlmDropdownMenuTrigger]="menu"
      >
        <ng-icon name="lucideMoreVertical" />
      </button>

      <ng-template #menu>
        <hlm-dropdown-menu class="w-48">
          <hlm-dropdown-menu-group>
            <button hlmDropdownMenuItem type="button" (triggered)="toggleStar.emit()">
              <ng-icon name="lucideStar" />
              {{ file().starred ? t('removeStar') : t('addStar') }}
            </button>
            <button hlmDropdownMenuItem type="button">
              <ng-icon name="lucideDownload" />
              {{ t('download') }}
            </button>
            <button hlmDropdownMenuItem type="button">
              <ng-icon name="lucideShare2" />
              {{ t('copyLink') }}
            </button>
          </hlm-dropdown-menu-group>
          <hlm-dropdown-menu-separator />
          <hlm-dropdown-menu-group>
            <button hlmDropdownMenuItem variant="destructive" type="button">
              <ng-icon name="lucideTrash2" />
              {{ t('trash') }}
            </button>
          </hlm-dropdown-menu-group>
        </hlm-dropdown-menu>
      </ng-template>
    </ng-container>
  `,
})
export class FileActions {
  public readonly file = input.required<FileManagerFile>();

  public readonly toggleStar = output<void>();
}
