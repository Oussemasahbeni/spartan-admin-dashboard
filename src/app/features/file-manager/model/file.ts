export type FileKind = 'document' | 'spreadsheet' | 'design' | 'pdf' | 'archive';

export type FileManagerView = 'grid' | 'list';

export type FileFilter = 'all' | 'starred' | 'shared';

export type FileTypeFilter = 'all' | FileKind;

export type FileSort = 'modified' | 'name' | 'size';

export const FILE_ICONS: Record<FileKind, string> = {
  archive: 'lucideFileArchive',
  design: 'lucideFileImage',
  document: 'lucideFileText',
  pdf: 'lucideFile',
  spreadsheet: 'lucideFileChartColumn',
};

export interface FileManagerFolder {
  id: string;
  name: string;
  fileCount: number;
  size: number;
  updatedAt: Date;
}

export interface FileManagerFile {
  id: string;
  name: string;
  kind: FileKind;
  size: number;
  owner: string;
  modifiedAt: Date;
  shared: boolean;
  starred: boolean;
}
