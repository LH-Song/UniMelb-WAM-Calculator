// components/Header.tsx

'use client' // Ensure this component is rendered on the client side

import { Button } from '@/components/Button'
import { Logo } from '@/components/Logo'
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
  useMobileNavigationStore,
} from '@/components/MobileNavigation'
import { MobileSearch, Search } from '@/components/Search'
import { ThemeToggle } from '@/components/ThemeToggle'

import clsx from 'clsx'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { forwardRef } from 'react'
import Image from 'next/image'

// Import NextAuth.js hooks
import { signIn, signOut, useSession } from 'next-auth/react'

export const Header = forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<typeof motion.div>
>(function Header({ className, ...props }, ref) {
  let { isOpen: mobileNavIsOpen } = useMobileNavigationStore()
  let isInsideMobileNavigation = useIsInsideMobileNavigation()

  let { scrollY } = useScroll()
  let bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9])
  let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8])

  // Use the useSession hook to get the current session
  const { data: session, status } = useSession()

  return (
    <motion.div
      {...props}
      ref={ref}
      className={clsx(
        className,
        'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80',
        !isInsideMobileNavigation &&
          'backdrop-blur-sm lg:left-72 xl:left-80 dark:backdrop-blur',
        isInsideMobileNavigation
          ? 'bg-white dark:bg-zinc-900'
          : 'bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]',
      )}
      style={
        {
          '--bg-opacity-light': bgOpacityLight,
          '--bg-opacity-dark': bgOpacityDark,
        } as React.CSSProperties
      }
    >
      <div
        className={clsx(
          'absolute inset-x-0 top-full h-px transition',
          (isInsideMobileNavigation || !mobileNavIsOpen) &&
            'bg-zinc-900/7.5 dark:bg-white/7.5',
        )}
      />
      <Search />
      <div className="flex items-center gap-5 lg:hidden">
        <MobileNavigation />
        <Link href="/" aria-label="Home">
          <Logo className="h-6" />
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex gap-4">
          <MobileSearch />
          <ThemeToggle />
        </div>

        <div className="hidden min-[416px]:contents">
          {status === 'loading' ? null : session ? (
            <div className="flex items-center gap-4">
              {session.user?.image ? (
                <Image
                  src={session.user?.image ?? ''}
                  alt="profile image"
                  width={28}
                  height={28}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <p className="text-sm">{session.user?.name}</p>
              )}
              <Button onClick={() => signOut()}>Sign out</Button>
            </div>
          ) : (
            <Button onClick={() => signIn('google')}>Sign in</Button>
          )}
        </div>
      </div>
    </motion.div>
  )
})
