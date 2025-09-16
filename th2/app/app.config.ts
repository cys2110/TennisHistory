export default defineAppConfig({
  ui: {
    commandPalette: {
      slots: {
        input: "[&>input]:h-10",
        item: "cursor-pointer"
      }
    },
    avatar: {
      slots: {
        image: "border border-border"
      }
    },
    navigationMenu: {
      slots: {
        root: "w-full",
        link: "text-xs xl:text-sm cursor-pointer"
      },
      defaultVariants: { variant: "link" }
    },
    breadcrumb: {
      slots: {
        link: "text-xs md:text-sm",
        linkLeadingIcon: "size-4 lg:size-5",
        linkLeadingAvatar: "border border-neutral-600 dark:border-neutral-400"
      },
      variants: { active: { true: { link: "text-primary" } } }
    },
    alert: {
      slots: {
        root: "w-fit mx-auto px-16",
        icon: "size-6",
        title: "text-lg font-semibold"
      },
      defaultVariants: { variant: "subtle" }
    },
    pagination: {
      slots: {
        item: "cursor-pointer",
        first: "cursor-pointer",
        last: "cursor-pointer",
        next: "cursor-pointer",
        prev: "cursor-pointer"
      }
    },
    tabs: {
      slots: {
        trigger: "cursor-pointer",
        label: "font-semibold",
        content: "text-sm"
      }
    },
    button: {
      slots: { base: "cursor-pointer" },
      defaultVariants: { variant: "subtle" }
    },
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
    slideover: { slots: { body: "flex flex-col gap-5" } },
    table: {
      slots: {
        root: "scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent",
        th: "text-xs md:text-sm text-center py-2",
        td: "text-xs md:text-sm text-center py-2"
      },
      defaultVariants: { loadingAnimation: "swing" }
    },
    badge: {
      defaultVariants: { variant: "outline" }
    },
    dropdownMenu: {
      slots: { content: "max-h-80 !min-w-fit border border-primary-700 dark:border-primary-600", item: "cursor-pointer" }
    },
    switch: {
      slots: {
        base: "data-[state=checked]:bg-primary-200 data-[state=unchecked]:dark:bg-primary-800 cursor-pointer",
        icon: "group-data-[state=unchecked]:text-primary-400"
      },
      defaultVariants: { size: "lg" }
    },
    checkboxGroup: {
      slots: {
        legend: "font-semibold",
        item: "cursor-pointer"
      }
    },
    checkbox: {
      slots: { base: "cursor-pointer has-data-[state=checked]:ring-0" },
      variants: {
        color: {
          primary: {
            indicator: "bg-transparent text-primary text-xl"
          }
        }
      }
    },
    collapsible: { slots: { content: "px-4 flex flex-col gap-2" } },
    slider: { slots: { root: "cursor-pointer" } }
  },
  uiPro: {
    dashboardSidebar: { slots: { header: "justify-center font-cursive lg:text-lg xl:text-xl 2xl:text-2xl" } },
    dashboardPanel: {
      slots: {
        root: "h-screen lg:w-19/20",
        body: "scroll-smooth"
      }
    },
    dashboardToolbar: { slots: { root: "py-2 flex-wrap gap-x-4 xl:gap-x-2" } },
    pageSection: { slots: { container: "py-4 sm:py-4 lg:py-4" } },
    pageCard: {
      slots: { footer: "self-center mt-auto pt-4 flex justify-center" }
    },
    prose: { badge: { base: "rounded-lg" } },
    radioGroup: {
      slots: {
        fieldset: "md:grid md:grid-cols-16 xl:flex",
        base: "cursor-pointer"
      },
      variants: {
        color: {
          primary: {
            base: "focus-visible:outline-primary ring-primary",
            indicator: "bg-primary-600 dark:bg-primary-400"
          }
        }
      }
    }
  }
})
