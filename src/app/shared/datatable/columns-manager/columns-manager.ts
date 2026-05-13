import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideChevronDown,
  lucideChevronLeft,
  lucideChevronRight,
  lucideGripVertical,
  lucidePin,
  lucideSettings2,
  lucideX,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { Column, ColumnPinningPosition, Table } from '@tanstack/angular-table';

interface DataTableColumnMeta {
  translationKey?: string;
  columnLabel?: string;
}

@Component({
  selector: 'adm-data-table-column-manager',
  imports: [DragDropModule, TranslocoModule, HlmDropdownMenuImports, HlmIconImports, HlmButtonImports],
  providers: [
    provideIcons({
      lucideCheck,
      lucideChevronDown,
      lucideChevronLeft,
      lucideChevronRight,
      lucideSettings2,
      lucideGripVertical,
      lucidePin,
      lucideX,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: 'columns-manager.css',
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
              @let meta = getMeta(column);
              <hlm-dropdown-menu-checkbox-indicator />
              @if (meta.translationKey) {
                {{ meta.translationKey | transloco }}
              } @else if (meta.columnLabel) {
                {{ meta.columnLabel }}
              } @else {
                {{ humanizeColumnId(column.id) }}
              }
            </button>
            <span class="inline-flex items-center justify-center p-2">
              <ng-icon hlmIcon class="text-muted-foreground cursor-grab active:cursor-grabbing" name="lucideGripVertical" />
            </span>

            @if (column.getCanPin()) {
              <button
                type="button"
                hlmDropdownMenuItem
                class="w-auto"
                aria-label="Pin options"
                title="Pin options"
                side="right"
                align="start"
                [hlmDropdownMenuTrigger]="pinMenu"
              >
                <ng-icon
                  hlmIcon
                  size="sm"
                  name="lucidePin"
                  [class.text-primary]="!!column.getIsPinned()"
                  [class.text-muted-foreground]="!column.getIsPinned()"
                />
              </button>

              <ng-template #pinMenu>
                <hlm-dropdown-menu-sub>
                  <button type="button" hlmDropdownMenuItem (triggered)="pinColumn(column, 'left')">
                    <ng-icon hlmIcon size="sm" name="lucideChevronLeft" class="rtl:rotate-180" />
                    <span>{{ 'buttons.pinStart' | transloco }}</span>
                    @if (column.getIsPinned() === 'left') {
                      <ng-icon hlmIcon size="sm" class="ms-auto" name="lucideCheck" />
                    }
                  </button>

                  <button type="button" hlmDropdownMenuItem (triggered)="pinColumn(column, 'right')">
                    <ng-icon hlmIcon size="sm" name="lucideChevronRight" class="rtl:rotate-180" />
                    <span>{{ 'buttons.pinEnd' | transloco }}</span>
                    @if (column.getIsPinned() === 'right') {
                      <ng-icon hlmIcon size="sm" class="ms-auto" name="lucideCheck" />
                    }
                  </button>

                  <button type="button" hlmDropdownMenuItem (triggered)="pinColumn(column, false)">
                    <ng-icon hlmIcon size="sm" name="lucideX" />
                    <span>{{ 'buttons.unpin' | transloco }}</span>
                    @if (!column.getIsPinned()) {
                      <ng-icon hlmIcon size="sm" class="ms-auto" name="lucideCheck" />
                    }
                  </button>
                </hlm-dropdown-menu-sub>
              </ng-template>
            }
          </div>
        }
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class DataTableColumnsManager<T> {
  // ==========================================
  // Inputs
  // ==========================================
  public readonly table = input.required<Table<T>>();

  // ==========================================
  // State
  // ==========================================
  protected readonly hidableColumns = computed(() => {
    return this.table()
      .getAllLeafColumns()
      .filter((col) => col.getCanHide());
  });

  // ==========================================
  // Public Methods
  // ==========================================
  protected onDrop(event: CdkDragDrop<string[]>) {
    const table = this.table();
    const hidableIds = this.hidableColumns().map((c) => c.id);

    moveItemInArray(hidableIds, event.previousIndex, event.currentIndex);

    const hidableSet = new Set(hidableIds);
    let hidableIndex = 0;
    const newOrder = table.getAllLeafColumns().map((col) => (hidableSet.has(col.id) ? hidableIds[hidableIndex++] : col.id));
    table.setColumnOrder(newOrder);
  }

  protected pinColumn(column: Column<T, unknown>, position: ColumnPinningPosition | false) {
    column.pin(position);
  }

  protected getMeta(column: Column<T, unknown>): DataTableColumnMeta {
    return (column.columnDef.meta as DataTableColumnMeta | undefined) ?? {};
  }

  protected humanizeColumnId(id: string): string {
    const pretty = id
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[._-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return pretty ? pretty[0].toUpperCase() + pretty.slice(1) : id;
  }
}
