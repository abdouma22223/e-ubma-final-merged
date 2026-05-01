import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Chatbot } from "@/components/Chatbot";
import ubmaLogo from "@/assets/ubma-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

import { RequestManagement } from "@/components/teacher/RequestManagement";
import { GradesManagement } from "@/components/teacher/GradesManagement";
import { StudentMonitoring } from "@/components/teacher/StudentMonitoring";
import { DocumentValidation } from "@/components/teacher/DocumentValidation";
import { CourseManagement } from "@/components/teacher/CourseManagement";
import { RequestTimeline } from "@/components/teacher/RequestTimeline";
import { Messaging } from "@/components/teacher/Messaging";
import { TeacherRequestsBell } from "@/components/teacher/TeacherRequestsBell";
import type { StudentRequest } from "@/data/teacherMockData";
import { mockRequests } from "@/data/teacherMockData";

// ... rest of the file ...
