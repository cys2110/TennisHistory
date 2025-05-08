export default defineAppConfig({
  ui: {
    colors: {
      primary: "violet",
      secondary: "cyan",
      info: "indigo",
      success: "green",
      warning: "amber",
      error: "red"
    },
    icons: {
      arrowLeft: "line-md:arrow-left-circle-twotone",
      arrowRight: "line-md:arrow-right-circle-twotone",
      caution: "line-md:alert-circle-twotone-loop",
      check: "line-md:confirm",
      chevronDoubleLeft: "line-md:chevron-small-double-left",
      chevronDoubleRight: "line-md:chevron-small-double-right",
      chevronDown: "line-md:chevron-small-down",
      chevronLeft: "line-md:chevron-small-left",
      chevronRight: "line-md:chevron-small-right",
      chevronUp: "line-md:chevron-small-up",
      close: "line-md:close-circle-twotone",
      copy: "i-lucide-copy",
      copyCheck: "i-lucide-copy-check",
      dark: "line-md:moon-rising-twotone-alt-loop",
      ellipsis: "i-lucide-ellipsis",
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
      loading: "line-md:loading-twotone-loop",
      menu: "solar:hamburger-menu-line-duotone",
      minus: "line-md:minus",
      panelClose: "material-symbols:left-panel-close-rounded",
      panelOpen: "material-symbols:left-panel-open-rounded",
      plus: "line-md:plus",
      search: "line-md:search-twotone",
      success: "line-md:circle-to-confirm-circle-twotone-transition",
      system: "line-md:monitor-twotone",
      tip: "line-md:lightbulb-twotone",
      warning: "line-md:alert-twotone-loop"
    },
    navigationMenu: {
      slots: {
        root: "w-full",
        link: "text-xs xl:text-sm cursor-pointer"
      },
      defaultVariants: {
        color: "secondary",
        variant: "link",
        highlightColor: "secondary"
      }
    },
    breadcrumb: {
      slots: {
        link: "text-xs md:text-sm",
        linkLeadingIcon: "size-4 lg:size-5"
      },
      variants: {
        active: {
          true: {
            link: "text-(--ui-secondary)"
          }
        }
      }
    },
    dropdownMenu: {
      slots: {
        content: "max-h-80 border border-secondary-700 dark:border-secondary-600"
      }
    },
    avatar: {
      slots: {
        root: "border border-neutral-600 dark:border-neutral-400"
      },
      variants: {
        size: {
          "3xl": {
            root: "size-20 mx-auto"
          }
        }
      }
    },
    button: {
      slots: {
        base: "cursor-pointer"
      },
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
        base: "cursor-pointer w-full",
        content: "ring-secondary-700 dark:ring-secondary-600 cursor-pointer",
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
    alert: {
      slots: {
        root: "w-fit mx-auto px-16",
        icon: "size-8",
        title: "text-lg font-semibold"
      },
      defaultVariants: {
        variant: "subtle"
      }
    },
    radioGroup: {
      slots: {
        fieldset: "grid grid-cols-6 sm:grid-cols-8 md:grid-cols-16 xl:flex",
        base: "cursor-pointer"
      },
      variants: {
        color: {
          secondary: {
            base: "focus-visible:outline-secondary-600 dark:focus-visible:outline-secondary-500 ring-secondary-600 dark:ring-secondary-500",
            //@ts-ignore
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
        base: "data-[state=unchecked]:bg-emerald-500 data-[state=unchecked]:dark:bg-emerald-800 cursor-pointer",
        icon: "group-data-[state=unchecked]:text-emerald-700"
      },
      defaultVariants: {
        color: "secondary",
        size: "lg"
      }
    },
    table: {
      slots: {
        th: "text-center text-xs md:text-sm lg:text-md",
        td: "text-center text-xs md:text-sm lg:text-md p-2"
      },
      defaultVariants: {
        loadingColor: "secondary",
        loadingAnimation: "swing"
      }
    },
    stepper: {
      slots: {
        root: "my-5",
        indicator: "cursor-pointer"
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
    },
    tabs: {
      slots: {
        trigger: "cursor-pointer",
        label: "font-semibold",
        content: "text-sm"
      },
      defaultVariants: {
        color: "secondary",
        size: "sm"
      }
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
    selectMenu: {
      slots: {
        base: "cursor-pointer",
        content: "cursor-pointer"
      }
    },
    commandPalette: {
      slots: {
        input: "[&>input]:h-10",
        item: "cursor-pointer"
      }
    }
  },
  uiPro: {
    dashboardSidebar: {
      slots: {
        header: "justify-center font-cursive lg:text-lg xl:text-xl 2xl:text-2xl"
      }
    },
    dashboardPanel: {
      slots: {
        root: "h-screen",
        body: "scroll-smooth"
      }
    },
    dashboardToolbar: {
      slots: {
        root: "py-2 flex-wrap"
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
    pageCard: {
      slots: {
        footer: "self-center mt-auto pt-4 flex justify-center"
      },
      variants: {
        variant: {
          outline: {
            root: "ring-primary-700, dark:ring-primary-700 shadow-md shadow-primary-700 dark:shadow-primary-500 hover:shadow-lg hover:shadow-primary-700 dark:hover:shadow-primary-500"
          },
          orientation: {
            // @ts-ignore
            vertical: {
              wrapper: "flex flex-col items-start"
            }
          }
        }
      }
    },
    pageSection: {
      slots: {
        container: "py-4 sm:py-4 lg:py-4"
      }
    },
    pageFeature: {
      slots: {
        leadingIcon: "text-secondary"
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
    },
    prose: {
      field: {
        slots: {
          name: "text-secondary"
        }
      },
      badge: {
        base: "rounded-lg"
      }
    }
  }
})
