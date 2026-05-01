import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList, BarChart3, Award, ShieldCheck, PenSquare, Mailbox,
  Binary, Globe, Bot, Lock, FileText, GraduationCap, User, Trash2, QrCode, X, Share2,
} from "lucide-react";
import { Chatbot } from "@/components/Chatbot";
import ubmaLogo from "@/assets/ubma-logo.png";
import avatarStudent from "@/assets/avatar-student.png";
import avatarTeacher from "@/assets/avatar-teacher.png";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StudentMessaging } from "@/components/student/StudentMessaging";
import { NewRequestDialog } from "@/components/student/NewRequestDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRequests } from "@/hooks/useRequests";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { toast } from "sonner";
import { apiGetDocuments, apiUploadDocument, apiDownloadDocument, apiShareDocument } from "@/lib/api";

// ... rest of the file ...
