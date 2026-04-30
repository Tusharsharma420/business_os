import { 
  Users, 
  Building2, 
  Megaphone, 
  Cpu, 
  Zap, 
  Plane, 
  Package, 
  LayoutGrid,
  Search,
  AlertTriangle,
  Factory,
  Wrench,
  Monitor,
  Save,
  RefreshCw,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Plus,
  X,
  LucideIcon
} from 'lucide-react-native';

export const IconMap: Record<string, LucideIcon> = {
  // Expense Categories
  'users': Users,
  'building-2': Building2,
  'megaphone': Megaphone,
  'cpu': Cpu,
  'zap': Zap,
  'plane': Plane,
  'package': Package,
  'layout-grid': LayoutGrid,
  
  // UI Icons
  'search': Search,
  'alert-triangle': AlertTriangle,
  'factory': Factory,
  'wrench': Wrench,
  'monitor': Monitor,
  'save': Save,
  'refresh-cw': RefreshCw,
  'trash-2': Trash2,
  'arrow-up-right': ArrowUpRight,
  'arrow-down-left': ArrowDownLeft,
  'chevron-right': ChevronRight,
  'plus': Plus,
  'x': X,
};

export function getIcon(name: string): LucideIcon {
  return IconMap[name] || LayoutGrid;
}
