export interface NavGroup {
  label?: string;
  items: NavigationItem[];
}

export interface NavigationItem {
  title: string;
  key?: string;
  url?: string;
  icon?: string;
  expanded?: boolean;
  children?: NavigationItem[];
}
