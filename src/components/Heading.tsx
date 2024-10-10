'use client'

import { useSectionStore } from '@/components/SectionProvider'
import { useEffect, useRef } from 'react'

export function Heading<Level extends 2 | 3>({
  children,
  tag,
  label,
  level,
  ...props
}: React.ComponentPropsWithoutRef<`h${Level}`> & {
  id: string
  tag?: string
  label?: string
  level?: Level
}) {
  level = level ?? (2 as Level)
  let Component = `h${level}` as 'h2' | 'h3'
  let ref = useRef<HTMLHeadingElement>(null)
  let registerHeading = useSectionStore((s) => s.registerHeading)

  useEffect(() => {
    if (level === 2) {
      registerHeading({ id: props.id, ref, offsetRem: tag || label ? 8 : 6 })
    }
  })

  return (
    <>
      {(tag || label) && (
        <div className="flex items-center gap-x-3">
          {tag && (
            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset">
              {tag}
            </span>
          )}
          {tag && label && (
            <span className="h-0.5 w-0.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          )}
          {label && (
            <span className="font-mono text-xs text-zinc-400">{label}</span>
          )}
        </div>
      )}
      <Component
        ref={ref}
        className={tag || label ? 'mt-2 scroll-mt-32' : 'scroll-mt-24'}
        {...props}
      >
        {children}
      </Component>
    </>
  )
}
