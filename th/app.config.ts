export default defineAppConfig({
    ui: {
        colors: {
            primary: 'violet',
            secondary: 'teal'
        },
        icons: {
            search: 'ph:magnifying-glass-duotone',
            check: 'solar:check-circle-bold-duotone',
            external: 'ph:arrow-square-out-duotone',
            loading: 'line-md:loading-twotone-loop',
            light: 'line-md:sun-rising-twotone-loop',
            dark: 'line-md:moon-alt-loop',
            caution: 'ic:baseline-report-gmailerrorred',
            error: 'ph:x-circle-duotone',
            info: 'ph:info-duotone',
            menu: 'solar:hamburger-menu-line-duotone',
            chevronUp: 'solar:round-alt-arrow-up-bold-duotone'
        },
        navigationMenu: {
            variants: {
                highlightColor: {
                    secondary: 'text-teal-500'
                },
                active: {
                    false: {
                        link: 'text-slate-300 hover:text-slate-400',
                        linkLeadingIcon: 'text-slate-300'
                    }
                }
            },
            compoundVariants: [
                {
                    active: true,
                    variant: 'link',
                    class: {
                        link: 'text-teal-500',
                        linkLeadingIcon: 'text-teal-500',
                    }
                },
                {
                    active: false,
                    variant: 'link',
                    orientation: 'vertical',
                    class: {
                        link: 'text-slate-600',
                        linkLeadingIcon: 'text-slate-600',
                    }
                },
                {
                    orientation: 'horizontal',
                    highlight: true,
                    class: {
                        link: 'after:-bottom-1'
                    }
                },
                {
                    disabled: false,
                    active: false,
                    variant: 'link',
                    class: {
                        link: 'hover:text-slate-400',
                        linkLeadingIcon: 'group-hover:text-slate-400',
                    }
                },
                {
                    disabled: false,
                    active: false,
                    variant: 'link',
                    orientation: 'horizontal',
                    class: {
                        link: 'data-[state=open]:text-slate-400',
                        linkLeadingIcon: 'group-data-[state=open]:text-slate-400'
                    }
                }
            ],
            defaultVariants: {
                color: 'secondary',
                variant: 'link',
                highlightColor: 'secondary'
            }
        },
        button: {
            compoundVariants: [
                {
                    color: 'secondary',
                    variant: 'subtle',
                    class: 'text-teal-700 ring-teal-600 bg-teal-600/10 hover:bg-teal-600/20 dark:text-teal-500 hover:shadow-md hover:shadow-teal-800 dark:hover:shadow-teal-500'
                }
            ]
        },
        buttonGroup: {
            base: 'flex-wrap'
        },
        alert: {
            slots: {
                icon: 'size-5 md:size-6',
                title: 'text-lg',
                root: 'md:w-3/4 mx-auto'
            }
        },
        select: {
            slots: {
                content: 'ring-teal-700 dark:ring-teal-500',
                trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-250'
            }
        },
        radioGroup: {
            slots: {
                fieldset: 'flex-wrap'
            },
            variants: {
                color: {
                    secondary: {
                        base: 'focus-visible:outline-teal-600 ring-teal-600',
                        indicator: 'bg-teal-600'
                    }
                }
            }
        },
        avatar: {
            slots: {
                root: 'border border-1 border-slate-500'
            }
        },
        stepper: {
            variants: {
                color: {
                    secondary: {
                        trigger: 'group-data-[state=completed]:bg-teal-800 group-data-[state=active]:bg-teal-500',
                        separator: 'group-data-[state=completed]:bg-teal-800'
                    }
                }
            }
        },
        switch: {
            slots: {
                base: 'data-[state=unchecked]:bg-emerald-500 data-[state=unchecked]:dark:bg-emerald-800', icon: 'group-data-[state=unchecked]:text-emerald-700'
            }
        }
    },
    uiPro: {
        header: {
            slots: {
                root: 'bg-violet-800',
                title: 'font-cursive text-slate-300'
            }
        },
        pageHeader: {
            slots: {
                title: 'text-slate-700 dark:text-slate-400',
                headline: 'text-teal-600'
            }
        },
        footer: {
            slots: {
                root: 'bg-violet-800'
            }
        },
        footerColumns: {
            slots: {
                root: 'xl:grid-cols-2 text-center',
                label: 'text-slate-400 text-center'
            },
            variants: {
                active: {
                    false: {
                        link: 'text-slate-300 hover:text-slate-300 hover-link',
                    }
                }
            }
        },
        pageGrid: {
            base: '2xl:grid-cols-4'
        },
        pageCard: {
            slots: {
                wrapper: 'flex flex-col items-start',
                footer: 'self-center mt-auto pt-4',
                root: 'shadow-md shadow-violet-700 dark:shadow-violet-300 hover:shadow-lg hover:shadow-violet-700 dark:hover:shadow-violet-300'
            }
        }
    }
})