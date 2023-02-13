import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import PageHeader from './PageHeader';

export type PageLayoutProps = {
  children: React.ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <PageHeader />
      <div className='mx-auto max-w-7xl my-6 px-4 sm:px-6 lg:px-8'>{children}</div>
    </>
  )
}