export interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  alsoStartsWith?: string[];
}