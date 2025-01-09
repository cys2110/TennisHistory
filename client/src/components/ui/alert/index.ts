import { cva, type VariantProps } from 'class-variance-authority'

export { default as Alert } from './Alert.vue'
export { default as AlertDescription } from './AlertDescription.vue'
export { default as AlertTitle } from './AlertTitle.vue'

export const alertVariants = cva('relative w-5/6 mx-auto rounded-lg border flex justify-center items-center gap-2 border-slate-200 px-4 py-3 text-lg dark:border-slate-800 dark:[&>svg]:text-slate-50', {
  variants: {
    variant: {
      default: 'bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50',
      destructive: 'border-amber-500 text-amber-500 dark:border-red-500 [&>svg]:text-amber-500 dark:border-amber-500 dark:text-amber-500 dark:dark:border-amber-500 dark:[&>svg]:text-amber-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type AlertVariants = VariantProps<typeof alertVariants>
