export default defineAppConfig({
    ui: {
        colors: {
            primary: 'violet',
            secondary: 'emerald'
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