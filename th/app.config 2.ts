export default defineAppConfig({
  ui: {
    colors: {
      primary: "violet",
      secondary: "emerald",
      info: "indigo",
      success: "green",
      warning: "amber",
      error: "red"
    },
    icons: {
      caution: "line-md:alert-circle-twotone-loop",
      copy: "i-lucide-copy",
      copyCheck: "i-lucide-copy-check",
      dark: "line-md:moon-rising-twotone-alt-loop",
      error: "line-md:close-circle-twotone",
      external: "line-md:external-link-rounded",
      eye: "line-md:watch-twotone",
      eyeOff: "line-md:watch-off-twotone",
      file: "line-md:file-document-twotone",
      folder: "i-lucide-folder",
      folderOpen: "i-lucide-folder-open",
      hash: "line-md:hash-small",
      info: "ic:twotone-info",
      light: "line-md:sun-rising-twotone-loop",
      menu: "solar:hamburger-menu-line-duotone",
      panelClose: "material-symbols:left-panel-close-rounded",
      panelOpen: "material-symbols:left-panel-open-rounded",
      success: "line-md:circle-to-confirm-circle-twotone-transition",
      system: "line-md:monitor-twotone",
      tip: "line-md:lightbulb-twotone",
      warning: "line-md:alert-twotone-loop",
      arrowLeft: "line-md:arrow-left-circle-twotone",
      arrowRight: "line-md:arrow-right-circle-twotone",
      check: "line-md:confirm",
      chevronDoubleLeft: "line-md:chevron-small-double-left",
      chevronDoubleRight: "line-md:chevron-small-double-right",
      chevronDown: "line-md:chevron-small-down",
      chevronLeft: "line-md:chevron-small-left",
      chevronRight: "line-md:chevron-small-right",
      chevronUp: "line-md:chevron-small-up",
      close: "line-md:close-circle-twotone",
      ellipsis: "i-lucide-ellipsis",
      loading: "line-md:loading-twotone-loop",
      minus: "line-md:minus",
      plus: "line-md:plus",
      search: "line-md:search-twotone"
    },
    navigationMenu: {
      slots: {
        link: "text-xs xl:text-sm"
      },
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
          color: "warning",
          variant: "subtle",
          class: {
            root: "bg-warning-700/25 text-warning-800 dark:bg-warning-300/10 dark:text-warning-400"
          }
        }
      ],
      defaultVariants: {
        color: "warning",
        variant: "subtle"
      }
    },
    button: {
      compoundVariants: [
        {
          color: "secondary",
          variant: "subtle",
          class:
            "text-secondary-700 dark:text-secondary-500 ring-secondary-600 bg-secondary-600/10 dark:bg-secondary-400/10 hover:bg-secondary-600/20 hover:shadow-sm hover:shadow-secondary-800 dark:hover:shadow-secondary-500"
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
      },
      defaultVariants: {
        variant: "none"
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
    dashboardSidebar: {
      slots: {
        header: "justify-center font-cursive lg:text-lg xl:text-xl 2xl:text-2xl"
      }
    },
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
            name: "hover-link cursor-pointer text-(--ui-text-muted) text-sm",
            avatar: "group-hover/user:scale-100"
          }
        }
      }
    }
  }
})
