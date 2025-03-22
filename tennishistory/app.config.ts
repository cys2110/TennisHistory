export default defineAppConfig({
  ui: {
    colors: {
      primary: "violet",
      secondary: "teal"
    },
    icons: {
      search: "ph:magnifying-glass-duotone",
      check: "solar:check-circle-bold-duotone",
      external: "ph:arrow-square-out-duotone",
      loading: "line-md:loading-twotone-loop",
      light: "line-md:sun-rising-twotone-loop",
      dark: "line-md:moon-alt-loop",
      caution: "ic:baseline-report-gmailerrorred",
      error: "ph:x-circle-duotone",
      info: "ph:info-duotone",
      menu: "solar:hamburger-menu-line-duotone",
      chevronUp: "solar:round-alt-arrow-up-bold-duotone"
    },
    navigationMenu: {
      variants: {
        highlightColor: {
          secondary: "text-secondary-500"
        }
      },
      compoundVariants: [
        {
          orientation: "horizontal",
          highlight: true,
          class: {
            link: "after:-bottom-1"
          }
        }
      ],
      defaultVariants: {
        color: "secondary",
        variant: "link",
        highlightColor: "secondary"
      }
    },
    alert: {
      slots: {
        root: "md:w-3/4 mx-auto",
        icon: "size-8 lg:size-12",
        title: "text-lg font-semibold"
      },
      compoundVariants: [
        {
          color: "info",
          variant: "subtle",
          class: {
            root: "bg-info-700/25 text-info-800 dark:bg-info-300/10 dark:text-info-400"
          }
        }
      ],
      defaultVariants: {
        color: "info",
        variant: "subtle"
      }
    },
    button: {
      compoundVariants: [
        {
          color: "secondary",
          variant: "subtle",
          class: "text-secondary-700 dark:text-secondary-500 ring-secondary-600 bg-secondary-600/10 dark:bg-secondary-400/10 hover:bg-secondary-600/20 hover:shadow-sm hover:shadow-secondary-800 dark:hover:shadow-secondary-500"
        }
      ],
      defaultVariants: {
        color: "secondary",
        variant: "subtle"
      }
    },
    select: {
      slots: {
        content: "ring-secondary-700 dark:ring-secondary-600",
        trailingIcon: "group-data-[state=open]:rotate-180 transition-transform duration-250"
      }
    },
    formField: {
      slots: {
        label: "font-semibold"
      }
    },
    dropdownMenu: {
      slots: {
        content: "max-h-80 border border-secondary-700 dark:border-secondary-600"
      }
    },
    tabs: {
      defaultVariants: {
        color: "secondary",
        size: "sm",
        variant: "link"
      }
    },
    table: {
      slots: {
        th: "text-center text-xs md:text-sm lg:text-md",
        td: "text-center text-xs md:text-sm lg:text-md p-2"
      }
    },
    radioGroup: {
      slots: {
        fieldset: "grid grid-cols-6 sm:grid-cols-8 md:grid-cols-16 xl:flex"
      },
      variants: {
        color: {
          secondary: {
            base: "focus-visible:outline-secondary-600 dark:focus-visible:outline-secondary-500 ring-secondary-600 dark:ring-secondary-500",
            indicator: "bg-secondary-600 dark:bg-secondary-400"
          }
        }
      },
      defaultVariants: {
        color: "secondary"
      }
    },
    switch: {
      slots: {
        base: "data-[state=unchecked]:bg-emerald-500 data-[state=unchecked]:dark:bg-emerald-800",
        icon: "group-data-[state=unchecked]:text-emerald-700"
      },
      defaultVariants: {
        color: "secondary",
        size: "lg"
      }
    },
    stepper: {
      slots: {
        root: "my-5"
      },
      variants: {
        color: {
          secondary: {
            trigger: "group-data-[state=completed]:bg-secondary-800 group-data-[state=active]:bg-secondary-600",
            separator: "group-data-[state=completed]:bg-secondary-800"
          }
        }
      },
      defaultVariants: {
        color: "secondary"
      }
    },
    card: {
      slots: {
        header: "flex flex-col text-sm",
        footer: "flex justify-between"
      },
      variants: {
        variant: {
          outline: {
            root: "ring-2 ring-primary-700 dark:ring-primary-700"
          }
        }
      }
    },
    collapsible: {
      slots: {
        content: "px-4 flex flex-col gap-2"
      }
    }
  },
  uiPro: {
    header: {
      slots: {
        root: "bg-primary-800",
        container: "w-screen",
        title: "font-cursive text-2xl"
      }
    },
    footer: {
      slots: {
        root: "bg-primary-800"
      }
    },
    footerColumns: {
      slots: {
        root: "xl:grid-cols-2 text-center",
        label: "text-neutral-400 text-center"
      },
      variants: {
        active: {
          false: {
            link: "hover-link"
          }
        }
      }
    },
    error: {
      slots: {
        statusCode: "text-secondary-700 dark:text-secondary-500"
      }
    },
    pageColumns: {
      base: "xl:columns-4 2xl:columns-5"
    },
    pageGrid: {
      base: "xl:grid-cols-4 2xl:grid-cols-5"
    },
    pageHeader: {
      slots: {
        root: "py-1",
        headline: "text-secondary-600 dark:text-secondary-500",
        description: "mb-2"
      }
    },
    pageSection: {
      slots: {
        container: "py-4 sm:py-4 lg:py-4"
      }
    },
    pageCard: {
      slots: {
        root: "shadow-md shadow-primary-700 dark:shadow-primary-500 hover:shadow-lg hover:shadow-primary-700 dark:hover:shadow-primary-500",
        wrapper: "flex flex-col items-start",
        footer: "self-center mt-auto pt-4"
      },
      variants: {
        variant: {
          outline: {
            root: "ring-primary-700, dark:ring-primary-700"
          }
        }
      }
    },
    dashboardToolbar: {
      slots: {
        root: "py-2"
      }
    },
    dashboardPanel: {
      slots: {
        root: "max-h-screen",
        body: "scroll-smooth"
      }
    },
    user: {
      slots: {
        avatar: "border border-neutral-600 dark:border-neutral-400"
      },
      variants: {
        to: {
          true: {
            name: "hover-link cursor-pointer",
            avatar: "group-hover/user:scale-100"
          }
        }
      }
    }
  }
})
