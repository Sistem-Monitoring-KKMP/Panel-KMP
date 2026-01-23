import { type ComponentType, lazy } from "react";
import { type LucideIcon, Users, Building2, ClipboardList } from "lucide-react";

// Lazy load pages
// const Dashboard = lazy(() => import("@/pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const ManajemenUser = lazy(() => import("@/pages/ManajemenUser").then((m) => ({ default: m.ManajemenUser })));
const ManajemenAnggota = lazy(() => import("@/pages/ManajemenAnggota").then((m) => ({ default: m.ManajemenAnggota })));
const ManajemenKoperasi = lazy(() => import("@/pages/ManajemenKoperasi").then((m) => ({ default: m.ManajemenKoperasi })));
const PanelKoperasi = lazy(() => import("@/pages/PanelKoperasi").then((m) => ({ default: m.PanelKoperasi })));

// Kuesioner pages for anggota
const Kuesioner = lazy(() => import("@/pages/Kuesioner").then((m) => ({ default: m.Kuesioner })));
const KuesionerOrganisasi = lazy(() => import("@/pages/KuesionerOrganisasi").then((m) => ({ default: m.KuesionerOrganisasi })));
const KuesionerBisnis = lazy(() => import("@/pages/KuesionerBisnis").then((m) => ({ default: m.KuesionerBisnis })));

export type UserRole = "superadmin" | "admin" | "anggota";

export interface RouteConfig {
  path: string;
  title: string;
  component: ComponentType<any>;
  icon?: LucideIcon;
  roles: UserRole[];
  showInSidebar?: boolean;
  parent?: string;
  children?: RouteConfig[];
}

// Add Breadcrumb interface
export interface BreadcrumbItem {
  label: string;
  path: string;
  isHome: boolean;
  isCurrent?: boolean;
}

export const routes: RouteConfig[] = [
  // {
  //   path: "/dashboard",
  //   title: "Dashboard",
  //   component: Dashboard,
  //   icon: LayoutDashboard,
  //   roles: ["superadmin", "admin", "anggota"],
  //   showInSidebar: true,
  // },
  {
    path: "/manajemen-data",
    title: "Manajemen Data",
    component: () => null, // Parent tidak punya component
    icon: Users,
    roles: ["superadmin", "admin"],
    showInSidebar: true,
    children: [
      {
        path: "/manajemen-data/user",
        title: "Manajemen User",
        component: ManajemenUser,
        roles: ["superadmin", "admin"],
        showInSidebar: true,
        parent: "Manajemen Data",
      },
      {
        path: "/manajemen-data/anggota",
        title: "Manajemen Anggota",
        component: ManajemenAnggota,
        roles: ["superadmin", "admin"],
        showInSidebar: true,
        parent: "Manajemen Data",
      },
    ],
  },
  {
    path: "/manajemen-koperasi",
    title: "Manajemen Koperasi",
    component: () => null,
    icon: Building2,
    roles: ["superadmin", "admin"],
    showInSidebar: true,
    children: [
      {
        path: "/manajemen-koperasi/profil",
        title: "Profil Koperasi",
        component: ManajemenKoperasi,
        roles: ["superadmin", "admin"],
        showInSidebar: true,
        parent: "Manajemen Koperasi",
      },
      {
        path: "/panel-koperasi/:koperasiId",
        title: "Panel Koperasi",
        component: PanelKoperasi,
        roles: ["superadmin", "admin"],
        showInSidebar: false,
      },
    ],
  },
  // Kuesioner Menu - For Anggota (Members)
  {
    path: "/kuesioner",
    title: "Kuesioner",
    component: Kuesioner,
    icon: ClipboardList,
    roles: ["anggota"],
    showInSidebar: true,
    children: [
      {
        path: "/kuesioner/organisasi",
        title: "Kuesioner Organisasi",
        component: KuesionerOrganisasi,
        roles: ["anggota"],
        showInSidebar: true,
        parent: "Kuesioner",
      },
      {
        path: "/kuesioner/bisnis",
        title: "Kuesioner Bisnis",
        component: KuesionerBisnis,
        roles: ["anggota"],
        showInSidebar: true,
        parent: "Kuesioner",
      },
    ],
  },
];

// Helper: Get all routes as flat array
export const getAllRoutes = (): RouteConfig[] => {
  const flatRoutes: RouteConfig[] = [];

  const flatten = (routeList: RouteConfig[]) => {
    routeList.forEach((route) => {
      flatRoutes.push(route);
      if (route.children) {
        flatten(route.children);
      }
    });
  };

  flatten(routes);
  return flatRoutes;
};

// Helper: Get route config by path
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return getAllRoutes().find((route) => route.path === path);
};

// Helper: Get breadcrumb items for current path
export const getBreadcrumbs = (currentPath: string): BreadcrumbItem[] => {
  const route = getRouteByPath(currentPath);
  if (!route) return [];

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: "Dashboard",
      path: "/",
      isHome: true,
      isCurrent: currentPath === "/",
    },
  ];

  if (currentPath !== "/") {
    if (route.parent) {
      breadcrumbs.push({
        label: route.parent,
        path: "",
        isHome: false,
        isCurrent: false,
      });
    }
    breadcrumbs.push({
      label: route.title,
      path: currentPath,
      isHome: false,
      isCurrent: true,
    });
  }

  return breadcrumbs;
};
