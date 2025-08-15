import {
  LayoutDashboard,
  ListChecks,
  LucideIcon,
  Calendar,
  Users,
  User,
  Settings,
  Activity,
  FileText,
  Building2,
  CreditCard,
  CircleUserRound,
  File,
  Scale,
  Mailbox,
  Percent,
  SlidersHorizontal,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  current: boolean;
}

export function Sidebar() {
  const pathname = usePathname();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated" && isMounted) {
      toast({
        title: "Unauthenticated",
        description: "Please login to access the admin dashboard.",
      });
      router.push("/");
    }
  }, [status, toast, router, isMounted]);

  const navigation: NavItem[] = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin",
    },
    {
      name: "Appointments",
      href: "/admin/appointments",
      icon: Calendar,
      current: pathname === "/admin/appointments",
    },
    {
      name: "Patients",
      href: "/admin/patients",
      icon: Users,
      current: pathname === "/admin/patients",
    },
    {
      name: "Doctors",
      href: "/admin/doctors",
      icon: User,
      current: pathname === "/admin/doctors",
    },
    {
      name: "Queue",
      href: "/admin/queue",
      icon: Users,
      current: pathname === "/admin/queue"
    },
    {
      name: "Staffs",
      href: "/admin/staffs",
      icon: Users,
      current: pathname === "/admin/staffs",
    },
    {
      name: "Clinics",
      href: "/admin/clinics",
      icon: Building2,
      current: pathname === "/admin/clinics",
    },
    {
      name: "Enquiries",
      href: "/admin/enquiries",
      icon: Mailbox,
      current: pathname === "/admin/enquiries",
    },
    {
      name: "Expenses",
      href: "/admin/expenses",
      icon: CreditCard,
      current: pathname === "/admin/expenses",
    },
    {
      name: "Services",
      href: "/admin/services",
      icon: ListChecks,
      current: pathname === "/admin/services",
    },
    {
      name: "Medical University",
      href: "/admin/medical-university",
      icon: ListChecks,
      current: pathname === "/admin/medical-university",
    },
    {
      name: "Percentage",
      href: "/admin/percentage",
      icon: Percent,
      current: pathname === "/admin/percentage",
    },
    {
      name: "Sliders",
      href: "/admin/sliders",
      icon: SlidersHorizontal,
      current: pathname === "/admin/sliders",
    },
    {
      name: "Audiometry",
      href: "/admin/audiometry",
      icon: Scale,
      current: pathname === "/admin/audiometry",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: pathname === "/admin/settings",
    },
  ];

  if (status === "loading") {
    return (
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1">
      {navigation.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className={`flex items-center space-x-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground ${
            item.current ? "bg-secondary text-foreground" : "text-muted-foreground"
          }`}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.name}</span>
        </a>
      ))}
    </div>
  );
}
