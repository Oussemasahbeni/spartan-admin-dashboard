export interface NavigationItem {
  title: string;
  key?: string;
  url?: string;
  icon?: string;
  children?: NavigationItem[];
}
