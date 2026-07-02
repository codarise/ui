import {
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Layout,
  LogOut,
  Menu,
} from "lucide-react"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface NavigationItem {
  name: string
  href: string
  icon: ComponentType<{ className?: string }>
  badge?: string
  description?: string
  children?: NavigationItem[]
  /** When true, only highlights on an exact href match. */
  exact?: boolean
}

export interface NavigationGroup {
  title: string
  items: NavigationItem[]
  /** When true, group starts collapsed. */
  defaultClosed?: boolean
}

export interface SidebarUser {
  name: string
  email?: string
  initials: string
  /** Label shown under the name (e.g. "Admin in Project X"). */
  roleLabel?: string
}

export interface SidebarMenuItem {
  label: string
  href: string
  icon?: ComponentType<{ className?: string }>
}

/* ------------------------------------------------------------------ */
/* Provider + Context                                                  */
/* ------------------------------------------------------------------ */

interface SidebarContextValue {
  isOpen: boolean
  isMobile: boolean
  toggle: () => void
  close: () => void
  open: () => void
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export interface SidebarProviderProps {
  children: ReactNode
  /** Initial open state (desktop). Default: true on desktop, false on mobile. */
  defaultOpen?: boolean
  /** Persist open state to localStorage under this key. Default: "sidebar-open". */
  storageKey?: string
  /** Mobile breakpoint in px. Default: 1024 (lg). */
  mobileBreakpoint?: number
}

export function SidebarProvider({
  children,
  defaultOpen,
  storageKey = "sidebar-open",
  mobileBreakpoint = 1024,
}: SidebarProviderProps) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false
    return window.innerWidth < mobileBreakpoint
  })
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === "undefined") return true
    if (defaultOpen !== undefined) return defaultOpen
    const saved = localStorage.getItem(storageKey)
    if (saved !== null) {
      try {
        return JSON.parse(saved) as boolean
      } catch {
        // ignore malformed
      }
    }
    return window.innerWidth >= mobileBreakpoint
  })

  useEffect(() => {
    let currentIsMobile = window.innerWidth < mobileBreakpoint
    const checkMobile = () => {
      const nextIsMobile = window.innerWidth < mobileBreakpoint
      if (nextIsMobile === currentIsMobile) return
      currentIsMobile = nextIsMobile
      setIsMobile(nextIsMobile)
      setIsOpen(!nextIsMobile)
    }
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [mobileBreakpoint])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(isOpen))
  }, [isOpen, storageKey])

  const value: SidebarContextValue = {
    isOpen,
    isMobile,
    toggle: () => setIsOpen((v) => !v),
    close: () => setIsOpen(false),
    open: () => setIsOpen(true),
  }

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider")
  return ctx
}

/* ------------------------------------------------------------------ */
/* Sidebar shell                                                       */
/* ------------------------------------------------------------------ */

export interface SidebarProps {
  children: ReactNode
  className?: string
}

export function Sidebar({ children, className }: SidebarProps) {
  const { isOpen } = useSidebar()
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-full bg-sidebar",
        "transition-all duration-300 ease-in-out",
        "lg:relative lg:translate-x-0",
        isOpen
          ? "w-72 translate-x-0"
          : "w-16 -translate-x-full lg:translate-x-0",
        className
      )}
    >
      <div className="flex h-full flex-col overflow-hidden">{children}</div>
    </aside>
  )
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

export interface SidebarHeaderProps {
  /** Logo / brand shown when sidebar is open. */
  logo?: ReactNode
  /** Compact brand shown when sidebar is collapsed. */
  collapsedLogo?: ReactNode
  className?: string
}

export function SidebarHeader({
  logo,
  collapsedLogo,
  className,
}: SidebarHeaderProps) {
  const { isOpen, toggle } = useSidebar()
  return (
    <div className="pt-px">
      <div
        className={cn(
          "relative flex h-12 items-center justify-between fade-in",
          isOpen ? "px-5" : "px-4.5",
          className
        )}
      >
        {isOpen ? (
          <>
            {logo}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggle}
              className="hidden size-8 sm:block"
              aria-label="Collapse sidebar"
            >
              <Layout className="size-4 text-muted-foreground" />
            </Button>
          </>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggle}
                aria-label="Open sidebar"
                className="rounded-full ring-1 ring-border focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
              >
                {collapsedLogo ?? (
                  <Badge
                    variant="outline"
                    className="text-brand-gradient flex size-8 cursor-pointer items-center justify-center rounded-full text-xs"
                  >
                    D
                  </Badge>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Open sidebar</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */

export interface SidebarNavProps {
  groups: NavigationGroup[]
  /** Current path used for active-item highlighting. */
  activeHref?: string
  onItemClick?: () => void
  className?: string
}

export function SidebarNav({
  groups,
  activeHref = "",
  onItemClick,
  className,
}: SidebarNavProps) {
  const { isOpen } = useSidebar()
  return (
    <nav
      className={cn(
        "flex-1 space-y-4 pb-5",
        isOpen ? "px-5" : "px-3",
        className
      )}
    >
      {groups.map((group, index) => (
        <SidebarGroup
          key={`${group.title}-${index}`}
          group={group}
          isCollapsed={!isOpen}
          activeHref={activeHref}
          onItemClick={onItemClick}
        />
      ))}
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/* Group                                                               */
/* ------------------------------------------------------------------ */

interface SidebarGroupProps {
  group: NavigationGroup
  isCollapsed?: boolean
  activeHref?: string
  onItemClick?: () => void
}

function SidebarGroup({
  group,
  isCollapsed = false,
  activeHref = "",
  onItemClick,
}: SidebarGroupProps) {
  const [isExpanded, setIsExpanded] = useState(!group.defaultClosed)
  const toggleExpanded = () => setIsExpanded((prev) => !prev)

  if (isCollapsed) {
    return (
      <div className="space-y-1">
        {group.items.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            isCollapsed
            activeHref={activeHref}
            onClick={onItemClick}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      {group.title && (
        <button
          type="button"
          onClick={toggleExpanded}
          className={cn(
            "group flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm leading-none font-medium transition-all duration-200",
            "cursor-pointer border-b border-transparent hover:bg-muted/50 hover:text-accent-foreground",
            "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          )}
        >
          <span className="truncate text-xs font-medium text-muted-foreground">
            {group.title}
          </span>
          {isExpanded ? (
            <ChevronDown className="size-4 shrink-0 text-foreground/25 group-hover:text-accent-foreground" />
          ) : (
            <ChevronRight className="size-4 shrink-0 text-foreground/25 group-hover:text-accent-foreground" />
          )}
        </button>
      )}
      {isExpanded && (
        <div className="mt-1 space-y-1">
          {group.items.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              activeHref={activeHref}
              onClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Item                                                                */
/* ------------------------------------------------------------------ */

interface SidebarItemProps {
  item: NavigationItem
  isCollapsed?: boolean
  activeHref?: string
  onClick?: () => void
}

function isItemActive(item: NavigationItem, activeHref: string): boolean {
  if (item.exact) return activeHref === item.href
  if (activeHref === item.href) return true
  if (item.href === "/") return false
  if (activeHref.startsWith(item.href)) {
    const nextChar = activeHref.charAt(item.href.length)
    return nextChar === "/" || nextChar === "?" || nextChar === ""
  }
  return false
}

function SidebarItem({
  item,
  isCollapsed = false,
  activeHref = "",
  onClick,
}: SidebarItemProps) {
  const Icon = item.icon
  const childItems = item.children ?? []
  const hasChildren = childItems.length > 0
  const active = isItemActive(item, activeHref)
  const sectionActive =
    hasChildren &&
    (activeHref === item.href || activeHref.startsWith(`${item.href}/`))

  const content = (
    // NOTE: Uses a plain <a> — replace with your router's <Link> in your app.
    <a
      href={item.href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        "hover:bg-muted/50 hover:text-accent-foreground",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        active ? "bg-muted/50 text-accent-foreground" : "text-foreground"
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0 transition-colors",
          active
            ? "text-foreground/50"
            : "text-muted-foreground group-hover:text-accent-foreground"
        )}
      />
      {!isCollapsed && (
        <>
          <span className="line-clamp-1 truncate">{item.name}</span>
          {item.badge && (
            <Badge
              variant="secondary"
              className="ml-auto bg-background/50 shadow-sm"
            >
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </a>
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{item.name}</TooltipContent>
      </Tooltip>
    )
  }

  if (hasChildren) {
    return (
      <div className="space-y-1">
        {content}
        {sectionActive && (
          <div className="ml-4 space-y-1 border-l border-border/40 pl-2">
            {childItems.map((child) => (
              <SidebarItem
                key={child.href}
                item={child}
                activeHref={activeHref}
                onClick={onClick}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return content
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export interface SidebarFooterProps {
  user: SidebarUser
  /** Extra nodes rendered in the dropdown header (e.g. theme toggle). */
  extra?: ReactNode
  menuItems?: SidebarMenuItem[]
  onLogout?: () => void
  className?: string
}

export function SidebarFooter({
  user,
  extra,
  menuItems = [],
  onLogout,
  className,
}: SidebarFooterProps) {
  const { isOpen, isMobile, close } = useSidebar()

  const handleNavigationClick = () => {
    if (isMobile) close()
  }

  return (
    <div
      className={cn(
        "mx-auto w-full px-3 pb-3 md:right-0 md:bottom-0 md:left-0",
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isOpen ? (
            <Button
              variant="ghost"
              className="relative flex h-auto w-full items-center justify-start gap-3 px-3 py-2 text-left"
            >
              <Avatar>
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col items-start overflow-hidden text-left">
                <span className="w-full truncate text-sm leading-none font-medium">
                  {user.name}
                </span>
                {user.roleLabel && (
                  <span className="mt-1 w-full max-w-48 truncate text-xs leading-none text-muted-foreground">
                    {user.roleLabel}
                  </span>
                )}
              </div>
              <ChevronsUpDown className="absolute right-3 size-3 flex-shrink-0 shrink-0 text-muted-foreground" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="flex size-10 items-center justify-center rounded-full p-0"
              aria-label="User menu"
            >
              <Avatar>
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-72 space-y-1"
          side="top"
          sideOffset={8}
        >
          {user.email && (
            <DropdownMenuLabel className="pb-2">
              <div className="flex items-center justify-between">
                <span className="flex-1 truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
                {extra}
              </div>
            </DropdownMenuLabel>
          )}
          {menuItems.length > 0 && (
            <>
              {user.email && <DropdownMenuSeparator />}
              {menuItems.map((menuItem) => {
                const ItemIcon = menuItem.icon
                return (
                  <DropdownMenuItem key={menuItem.href} asChild>
                    <a
                      href={menuItem.href}
                      onClick={handleNavigationClick}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      {ItemIcon && (
                        <ItemIcon className="size-4 text-muted-foreground" />
                      )}
                      <span className="truncate">{menuItem.label}</span>
                    </a>
                  </DropdownMenuItem>
                )
              })}
            </>
          )}
          {onLogout && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 size-4 opacity-50" />
                Sign out
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile                                                              */
/* ------------------------------------------------------------------ */

export interface SidebarMobileProps {
  children: ReactNode
}

export function SidebarMobile({ children }: SidebarMobileProps) {
  const { isOpen, close, isMobile } = useSidebar()
  if (!isMobile) return null

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent side="left">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Main navigation menu
        </SheetDescription>
        <div className="flex h-full flex-col overflow-y-auto">{children}</div>
      </SheetContent>
    </Sheet>
  )
}

/* ------------------------------------------------------------------ */
/* Toggle                                                              */
/* ------------------------------------------------------------------ */

export interface SidebarToggleProps {
  className?: string
}

export function SidebarToggle({ className }: SidebarToggleProps) {
  const { toggle, isMobile } = useSidebar()
  if (!isMobile) return null

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className={className}
      aria-label="Toggle navigation menu"
    >
      <Menu className="size-5" />
    </Button>
  )
}
