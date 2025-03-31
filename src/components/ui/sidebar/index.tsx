
import * as React from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { SidebarProvider as OriginalSidebarProvider } from "./sidebar-context"

// Re-export everything from the context
export { 
  useSidebar,
  SidebarContext,
  SidebarProvider as OriginalSidebarProvider
} from "./sidebar-context"

// Re-export from layout components
export { 
  Sidebar, 
  SidebarTrigger, 
  SidebarRail, 
  SidebarInset 
} from "./sidebar-layout"

// Re-export section components
export { 
  SidebarInput, 
  SidebarHeader, 
  SidebarFooter, 
  SidebarSeparator, 
  SidebarContent 
} from "./sidebar-sections"

// Re-export group components
export { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupAction, 
  SidebarGroupContent 
} from "./sidebar-group"

// Re-export menu components
export { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarMenuAction, 
  SidebarMenuBadge, 
  SidebarMenuSkeleton 
} from "./sidebar-menu"

// Re-export submenu components
export { 
  SidebarMenuSub, 
  SidebarMenuSubItem, 
  SidebarMenuSubButton 
} from "./sidebar-submenu"

// Create the enhanced SidebarProvider wrapper with TooltipProvider
const EnhancedSidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen,
      open,
      onOpenChange,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <OriginalSidebarProvider
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        ref={ref}
        style={
          {
            "--sidebar-width": "16rem",
            "--sidebar-width-icon": "3rem",
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
          className
        )}
        {...props}
      >
        {children}
      </OriginalSidebarProvider>
    )
  }
)
EnhancedSidebarProvider.displayName = "SidebarProvider"

// Export the enhanced wrapper as SidebarProvider
export { EnhancedSidebarProvider as SidebarProvider }
