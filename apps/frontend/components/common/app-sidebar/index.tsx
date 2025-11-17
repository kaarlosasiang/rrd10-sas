"use client"

import * as React from "react"
import {
    AudioWaveform,
    Calculator,
    FileText,
    GalleryVerticalEnd,
    LayoutDashboard,
    Receipt,
    Settings2,
    TrendingUp,
    Users,
    Wallet,
} from "lucide-react"

import {NavMain} from "./nav-main"
import {NavProjects} from "./nav-projects"
import {NavUser} from "./nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image";

// This is sample data.
const data = {
    user: {
        name: "John Accountant",
        email: "john@rrd10.com",
        avatar: "/avatars/user.jpg",
    },
    teams: [
        {
            name: "RRD10 Main",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Tax Department",
            logo: Calculator,
            plan: "Professional",
        },
        {
            name: "Audit Team",
            logo: AudioWaveform,
            plan: "Business",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            icon: LayoutDashboard,
            isActive: true,
            items: [
                {
                    title: "Overview",
                    url: "#",
                },
                {
                    title: "Analytics",
                    url: "#",
                },
                {
                    title: "Reports",
                    url: "#",
                },
            ],
        },
        {
            title: "Transactions",
            url: "#",
            icon: Receipt,
            items: [
                {
                    title: "All Transactions",
                    url: "#",
                },
                {
                    title: "Income",
                    url: "#",
                },
                {
                    title: "Expenses",
                    url: "#",
                },
                {
                    title: "Recurring",
                    url: "#",
                },
            ],
        },
        {
            title: "Invoicing",
            url: "#",
            icon: FileText,
            items: [
                {
                    title: "All Invoices",
                    url: "#",
                },
                {
                    title: "Create Invoice",
                    url: "#",
                },
                {
                    title: "Pending",
                    url: "#",
                },
                {
                    title: "Paid",
                    url: "#",
                },
            ],
        },
        {
            title: "Clients",
            url: "#",
            icon: Users,
            items: [
                {
                    title: "All Clients",
                    url: "#",
                },
                {
                    title: "Active",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Financial Reports",
            url: "#",
            icon: TrendingUp,
            items: [
                {
                    title: "Profit & Loss",
                    url: "#",
                },
                {
                    title: "Balance Sheet",
                    url: "#",
                },
                {
                    title: "Cash Flow",
                    url: "#",
                },
                {
                    title: "Tax Summary",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Company",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Integrations",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Q4 Tax Filing",
            url: "#",
            icon: Calculator,
        },
        {
            name: "Annual Audit 2025",
            url: "#",
            icon: FileText,
        },
        {
            name: "Payroll Management",
            url: "#",
            icon: Wallet,
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div
                                    className="flex aspect-square items-center justify-center rounded-lg">
                                    <Image src={"/rrd10_icon.png"} alt={"RRD10 Icon"} width={32} height={32}/>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-bold">RRD10</span>
                                    <span className="truncate text-xs">Smart Accounting System</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
                <NavProjects projects={data.projects}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
