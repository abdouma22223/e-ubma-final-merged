import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid, Award, ListChecks, GitCommitVertical, ShieldCheck, LogOut,
  Inbox, GraduationCap, Users, FileCheck2, MessagesSquare, BookOpen,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/Sidebar";
import ubmaLogo from "@/assets/ubma-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

// ... rest of the file ...
