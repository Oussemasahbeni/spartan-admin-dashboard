import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideGripVertical, lucideSettings2 } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { Table } from '@tanstack/angular-table';

@Component({
  selector: 'adm-data-table-column-manager',
  imports: [DragDropModule, TranslocoModule, HlmDropdownMenuImports, HlmIconImports, HlmButtonImports],
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideSettings2,
      lucideGripVertical,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: 'data-table-column-manager.css',
  template: `
    <button type="button" class="hidden sm:flex" hlmBtn variant="outline" align="end" [hlmDropdownMenuTrigger]="columnMenu">
      <ng-icon hlmIcon name="lucideSettings2" size="sm" />
      <span>{{ 'buttons.columns' | transloco }}</span>
      <ng-icon hlmIcon name="lucideChevronDown" size="sm" />
    </button>

    <ng-template #columnMenu>
      <hlm-dropdown-menu class="columns-list" cdkDropList (cdkDropListDropped)="onDrop($event)">
        @for (column of hidableColumns(); track column.id) {
          <div cdkDrag class="group column-box flex items-center gap-2 px-2">
            <button
              type="button"
              hlmDropdownMenuCheckbox
              class="flex-1"
              [checked]="column.getIsVisible()"
              (triggered)="column.toggleVisibility()"
            >
              <hlm-dropdown-menu-checkbox-indicator />
              @if (column.columnDef.meta?.translationKey) {
                {{ column.columnDef.meta?.translationKey | transloco }}
              } @else {
                {{ column.columnDef.header }}
              }
            </button>
            <ng-icon
              cdkDragHandle
              hlmIcon
              class="text-muted-foreground cursor-grab active:cursor-grabbing"
              name="lucideGripVertical"
            />
          </div>
        }
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class DataTableColumnManager<T> {
  readonly table = input.required<Table<T>>();

  protected readonly hidableColumns = computed(() => {
    return this.table()
      .getAllLeafColumns()
      .filter((col) => col.getCanHide());
  });

  protected onDrop(event: CdkDragDrop<string[]>) {
    const table = this.table();
    const hidableIds = this.hidableColumns().map((c) => c.id);

    moveItemInArray(hidableIds, event.previousIndex, event.currentIndex);
    table.setColumnOrder(['select', ...hidableIds, 'actions']);
  }
}
