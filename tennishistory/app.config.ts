export default defineAppConfig({
    ui: {
        colors: {
            primary: 'violet',
            secondary: 'emerald'
        },
        alert: {
            slots: {
                icon: 'size-5 md:size-6',
                title: 'text-lg',
                root: 'md:w-3/4 mx-auto'
            }
        },
        card: {
            slots: {
                root: 'flex flex-col ring-violet-600 dark:ring-violet-800 shadow-violet-800 dark:shadow-violet-800 hover:shadow-md hover:shadow-violet-800 dark:hover:shadow-violet-600',
                body: 'flex-1',
                footer: 'flex justify-center mt-auto'
            }
        },
        tooltip: {
            slots: {
                text: 'text-slate-400'
            }
        },
        formField: {
            slots: {
                label: 'text-emerald-600'
            }
        }
    },
    uiPro: {
        pageLinks: {
            variants: {
                active: {
                    true: {
                        link: 'text-emerald-600'
                    }
                }
            }
        },
        pageHeader: {
            slots: {
                title: 'text-slate-600 dark:text-slate-300',
                headline: 'text-emerald-600'
            }
        },
        pageGrid: {
            base: 'md:grid-cols-3 2xl:grid-cols-4 gap-8'
        },
        pageAnchors: {
            variants: {
                active: {
                    true: {
                        link: 'text-emerald-600'
                    }
                }
            }
        },
        pageFeature: {
            slots: {
                title: 'text-slate-400',
                description: 'text-slate-300'
            }
        },
        pageSection: {
            slots: {
                title: 'text-slate-300'
            }
        },
        pageCard: {
            slots: {
                root: 'flex flex-col ring-violet-600 dark:ring-violet-800 shadow-violet-800 dark:shadow-violet-800 hover:shadow-md hover:shadow-violet-800 dark:hover:shadow-violet-600',
            }
        },
    }
})