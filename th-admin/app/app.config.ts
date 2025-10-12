export default defineAppConfig({
  ui: {
    colors: {
      primary: "sky",
      Singles: "emerald",
      Doubles: "orange",
      ATP: "violet",
      WTA: "fuchsia",
      Men: "cyan",
      Women: "pink",
      Main: "indigo",
      Qualifying: "stone",
      error: "red",
      success: "green",
      warning: "amber"
    },
    icons: {
      check: "line-md:confirm-square-twotone",
      chevronDown: "line-md:chevron-small-down",
      close: "line-md:close-circle-twotone",
      loading: "line-md:loading-twotone-loop",
      menu: "line-md:list",
      plus: "line-md:plus-square-twotone",
      reload: "line-md:rotate-270",
      search: "line-md:search-twotone",
      success: "line-md:circle-to-confirm-circle-twotone-transition",
      tip: "solar:layers-line-duotone",
      upload: "line-md:uploading"
    },
    badge: { defaultVariants: { variant: "subtle", size: "xs" } },
    button: { defaultVariants: { variant: "subtle", size: "sm" }, slots: { base: "cursor-pointer" } },
    select: {
      slots: {
        base: "w-full cursor-pointer",
        content: "min-w-fit",
        item: "cursor-pointer",
        trailingIcon: "group-data-[state=open]:rotate-180 transition-transform duration-300"
      },
      defaultVariants: { size: "sm" }
    },
    selectMenu: {
      slots: {
        base: "w-full cursor-pointer",
        content: "min-w-fit",
        item: "cursor-pointer",
        trailingIcon: "group-data-[state=open]:rotate-180 transition-transform duration-300"
      },
      defaultVariants: { size: "sm" }
    },
    dashboardPanel: {
      slots: {
        root: "h-screen max-w-screen",
        body: "scroll-smooth"
      }
    },
    formField: {
      slots: { label: "font-semibold", error: "text-xs", description: "text-xs", help: "text-xs", hint: "text-xs" },
      defaultVariants: { size: "sm" }
    },
    modal: { slots: { body: "*:my-2", content: "p-5", footer: "justify-between" } },
    input: { slots: { root: "w-full" }, defaultVariants: { size: "sm" } },
    inputNumber: {
      slots: { root: "w-full" },
      defaultVariants: { size: "sm" },
      variants: {
        orientation: {
          horizontal: {
            decrement: "hidden"
          }
        }
      }
    },
    inputTags: { slots: { root: "w-full" }, defaultVariants: { size: "sm" } },
    textarea: { defaultVariants: { size: "sm" }, slots: { root: "w-full" } },
    commandPalette: {
      slots: { input: "[&>input]:h-8", item: "text-xs" },
      variants: {
        active: {
          false: { item: "data-highlighted:not-data-disabled:before:bg-default" }
        }
      }
    },
    dropdownMenu: {
      variants: {
        active: {
          true: { item: "before:bg-default text-primary" },
          false: { item: "data-highlighted:not-data-disabled:before:bg-default" }
        }
      }
    }
  }
})
