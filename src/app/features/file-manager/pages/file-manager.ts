import { Component, computed, inject, signal } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideClock,
  lucideFolder,
  lucideFolderPlus,
  lucideGrid2x2,
  lucideList,
  lucideMoreVertical,
  lucideSearch,
  lucideSlidersHorizontal,
  lucideUpload,
} from '@ng-icons/lucide';
import { BytesPipe } from '@shared/pipes/bytes/bytes.pipe';
import { TimeAgoPipe } from '@shared/pipes/timeago/time-ago.pipe';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';

import { FileGridView } from '../components/file-grid-view/file-grid-view';
import { FileListView } from '../components/file-list-view/file-list-view';
import { FileFilter, FileManagerFile, FileManagerView, FileSort, FileTypeFilter } from '../model/file';
import { FILES, FOLDERS } from '../model/file-manager-data';
import { ToggleValue } from '@spartan-ng/brain/toggle-group';

@Component({
  selector: 'adm-file-manager',
  imports: [
    TranslocoModule,
    NgIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmDropdownMenuImports,
    HlmEmptyImports,
    HlmInputGroupImports,
    HlmToggleGroupImports,
    FileGridView,
    FileListView,
    BytesPipe,
    TimeAgoPipe,
  ],
  providers: [
    provideIcons({
      lucideArrowUpDown,
      lucideClock,
      lucideFolder,
      lucideFolderPlus,
      lucideGrid2x2,
      lucideList,
      lucideMoreVertical,
      lucideSearch,
      lucideSlidersHorizontal,
      lucideUpload,
    }),
  ],
  templateUrl: './file-manager.html',
})
export default class FileManager {
  // ==========================================
  // State
  // ==========================================

  protected readonly lang = inject(TranslocoService).activeLang;

  protected readonly view = signal<FileManagerView>('grid');
  protected readonly searchQuery = signal('');

  protected readonly showFilter = signal<FileFilter>('all');
  protected readonly typeFilter = signal<FileTypeFilter>('all');
  protected readonly sortBy = signal<FileSort>('modified');

  protected readonly folders = FOLDERS;
  protected readonly files = signal<FileManagerFile[]>(FILES);

  protected readonly showFilters: FileFilter[] = ['all', 'starred', 'shared'];
  protected readonly typeFilters: FileTypeFilter[] = ['all', 'archive', 'design', 'document', 'pdf', 'spreadsheet'];
  protected readonly sortOptions: FileSort[] = ['modified', 'name', 'size'];

  protected readonly filteredFolders = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return this.folders;
    return this.folders.filter((folder) => folder.name.toLowerCase().includes(query));
  });

  protected readonly filteredFiles = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const show = this.showFilter();
    const type = this.typeFilter();

    const files = this.files().filter(
      (file) =>
        (!query || file.name.toLowerCase().includes(query)) &&
        (show === 'all' || (show === 'starred' ? file.starred : file.shared)) &&
        (type === 'all' || file.kind === type)
    );

    switch (this.sortBy()) {
      case 'name':
        return [...files].sort((a, b) => a.name.localeCompare(b.name));
      case 'size':
        return [...files].sort((a, b) => b.size - a.size);
      default:
        // Data is already ordered by last modified.
        return files;
    }
  });

  // ==========================================
  // Methods
  // ==========================================

  protected onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected onViewChange(value: ToggleValue<FileManagerView>): void {
    this.view.set(value as FileManagerView);
  }

  protected toggleStar(fileId: string): void {
    this.files.update((files) => files.map((file) => (file.id === fileId ? { ...file, starred: !file.starred } : file)));
  }
}
