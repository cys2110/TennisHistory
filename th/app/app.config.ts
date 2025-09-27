export default defineAppConfig({
  ui: {
    colors: {
      primary: "violet",
      atp: "sky",
      wta: "fuchsia",
      men: "cyan",
      women: "pink",
      active: "emerald",
      inactive: "zinc",
      singles: "orange",
      doubles: "indigo",
      success: "green",
      warning: "yellow",
      error: "red",
      info: "blue",
      tour: "teal",
      challenger: "stone",
      itf: "rose",
      main: "lime",
      qualifying: "gray"
    },
    icons: {
      arrowLeft: "line-md:arrow-left-circle-twotone",
      arrowRight: "line-md:arrow-right-circle-twotone",
      caution: "line-md:alert-circle-twotone-loop",
      check: "line-md:square-twotone-to-confirm-square-twotone-transition",
      chevronDoubleLeft: "line-md:chevron-small-double-left",
      chevronDoubleRight: "line-md:chevron-small-double-right",
      chevronDown: "line-md:chevron-small-down",
      chevronLeft: "line-md:chevron-small-left",
      chevronRight: "line-md:chevron-small-right",
      chevronUp: "line-md:chevron-small-up",
      close: "line-md:close-circle-twotone",
      copy: "solar:copy-bold-duotone",
      copyCheck: "tabler:copy-check",
      dark: "line-md:moon-rising-twotone-alt-loop",
      ellipsis: "tabler:dots-circle-horizontal",
      error: "line-md:close-circle-twotone",
      external: "line-md:external-link-rounded",
      eye: "line-md:watch-twotone",
      eyeOff: "line-md:watch-off-twotone",
      file: "line-md:file-document-twotone",
      folder: "tabler:folder",
      folderOpen: "tabler:folder-open",
      hash: "line-md:hash-small",
      info: "solar:info-circle-bold-duotone",
      light: "line-md:sun-rising-twotone-loop",
      loading: "line-md:loading-twotone-loop",
      menu: "solar:hamburger-menu-line-duotone",
      minus: "line-md:minus",
      panelClose: "tabler:layout-sidebar-left-collapse",
      panelOpen: "tabler:layout-sidebar-left-expand",
      plus: "line-md:plus",
      search: "line-md:search-twotone",
      success: "line-md:circle-to-confirm-circle-twotone-transition",
      system: "line-md:monitor-twotone",
      tip: "line-md:lightbulb-twotone",
      warning: "line-md:alert-twotone-loop"
    },
    dashboardSidebar: { slots: { header: "justify-center font-cursive lg:text-lg xl:text-xl 2xl:text-2xl" } },
    dashboardPanel: {
      slots: {
        root: "h-screen max-w-screen lg:max-w-[calc(100vw-3rem)] xl:max-w-[calc(100vw-4rem)]",
        body: "scroll-smooth"
      }
    },
    dashboardToolbar: { slots: { root: "py-2 flex-wrap gap-x-4 xl:gap-x-2" } },
    table: {
      slots: {
        root: "scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent",
        th: "text-xs md:text-sm text-center py-1",
        td: "text-xs md:text-sm text-center py-1"
      },
      defaultVariants: { loadingAnimation: "swing" }
    },
    badge: { defaultVariants: { variant: "outline" } },
    select: {
      slots: {
        base: "cursor-pointer w-full",
        content: "ring-primary cursor-pointer w-full",
        trailingIcon: "group-data-[state=open]:rotate-180 transition-transform duration-250"
      },
      defaultVariants: { variant: "none" }
    },
    selectMenu: {
      slots: {
        base: "cursor-pointer w-full",
        content: "ring-primary cursor-pointer lg:w-full",
        trailingIcon: "group-data-[state=open]:rotate-180 transition-transform duration-250"
      },
      defaultVariants: { variant: "none" }
    },
    dropdownMenu: {
      slots: { content: "max-h-80 !min-w-fit border border-primary", item: "cursor-pointer" }
    },
    button: {
      slots: { base: "cursor-pointer" },
      defaultVariants: { variant: "subtle" }
    },
    radioGroup: {
      slots: {
        indicator: "cursor-pointer",
        item: "cursor-pointer",
        label: "cursor-pointer"
      }
    },
    tabs: { slots: { trigger: "cursor-pointer" } },
    progress: { slots: { status: "!w-full" } }
  }
})
