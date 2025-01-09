import {
  Home,
  ListOrdered,
  Shirt,
  Star,
  UserCog2Icon,
  Users2Icon,
} from "lucide-react";

export type Route = {
  pathname: string;
  icon: any;
  menu: string;
  type: string;
};

export const getRoutes = (role: string | null): Route[] => {
  switch (role) {
    case "Admin":
      return [
        {
          pathname: "/dashboard/admin",
          icon: Home,
          menu: "Dashboard",
          type: "Overview",
        },
        {
          pathname: "/dashboard/admin",
          icon: ListOrdered,
          menu: "Orders",
          type: "Bussines",
        },
        {
          pathname: "/dashboard/admin",
          icon: Shirt,
          menu: "Services",
          type: "Bussines",
        },
        {
          pathname: "/dashboard/admin/management-staff/",
          icon: UserCog2Icon,
          menu: "Staff",
          type: "People Management",
        },
        {
          pathname: "/dashboard/admin",
          icon: Users2Icon,
          menu: "User",
          type: "People Management",
        },
        {
          pathname: "/dashboard/admin",
          icon: Star,
          menu: "Feedback",
          type: "Insights",
        },
      ];
    case "Staff":
      return [
        {
          pathname: "/dashboard/staff",
          icon: Home,
          menu: "Dashboard",
          type: "Overview",
        },
      ];
    default:
      return [];
  }
};
