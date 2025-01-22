export default defineAppConfig({
    ui: {
        colors: {
            primary: 'violet',
            secondary: 'emerald'
        },
        alert: {
            slots: {
                icon: 'size-6',
                title: 'text-lg',
                root: 'w-3/4 mx-auto'
            }
        },
        card: {
            slots: {
                root: 'flex flex-col ring-violet-800 shadow-violet-600 hover:shadow-md hover:shadow-violet-600',
                body: 'flex-1',
                footer: 'flex justify-center mt-auto'
            }
        },
        tooltip: {
            slots: {
                text: 'text-slate-400'
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
                title: 'text-slate-300'
            }
        },
        pageGrid: {
            base: '2xl:grid-cols-4'
        }
    }
})