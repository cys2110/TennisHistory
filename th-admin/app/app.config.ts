export default defineAppConfig({
  ui: {
    colors: {
      primary: "indigo",
      Singles: "emerald",
      Doubles: "orange",
      ATP: "sky",
      WTA: "fuchsia",
      Men: "cyan",
      Women: "pink",
      Main: "violet",
      Qualifying: "stone",
      error: "red",
      success: "green"
    },
    badge: { defaultVariants: { variant: "subtle" } },
    button: { defaultVariants: { variant: "subtle" }, slots: { base: "cursor-pointer" } },
    select: { slots: { content: "min-w-fit" } },
    selectMenu: { slots: { content: "min-w-fit" } },
    dashboardPanel: {
      slots: {
        root: "h-screen max-w-screen",
        body: "scroll-smooth"
      }
    },
    formField: { slots: { label: "font-semibold" } },
    modal: { slots: { content: "p-5" } },
    input: { slots: { base: "w-full" } }
  }
})
