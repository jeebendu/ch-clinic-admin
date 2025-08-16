
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { useMenuItems, MenuItem } from '../../hooks/useMenuItems';
import { getIcon } from '../../utils/iconUtils';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const menuItems = useMenuItems();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const SidebarContent = () => (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <img
          className="h-8 w-auto"
          src="/logo.svg"
          alt="ClinicHub"
        />
        <span className="ml-2 text-xl font-semibold text-gray-900">ClinicHub</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  {!item.subMenu ? (
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? 'bg-gray-50 text-indigo-600'
                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )
                      }
                    >
                      {({ isActive }) => {
                        const IconComponent = getIcon(item.icon);
                        return (
                          <>
                            <IconComponent
                              className={classNames(
                                isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                'h-6 w-6 shrink-0'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </>
                        );
                      }}
                    </NavLink>
                  ) : (
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={classNames(
                          'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                          'group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm leading-6 font-semibold'
                        )}
                      >
                        {(() => {
                          const IconComponent = getIcon(item.icon);
                          return (
                            <>
                              <IconComponent
                                className="text-gray-400 group-hover:text-indigo-600 h-6 w-6 shrink-0"
                                aria-hidden="true"
                              />
                              <span className="flex-1">{item.name}</span>
                              <ChevronRightIcon
                                className={classNames(
                                  expandedItems.includes(item.name) ? 'rotate-90 text-gray-500' : 'text-gray-400',
                                  'ml-auto h-5 w-5 shrink-0'
                                )}
                                aria-hidden="true"
                              />
                            </>
                          );
                        })()}
                      </button>
                      {expandedItems.includes(item.name) && (
                        <ul className="mt-1 px-2">
                          {item.subMenu?.map((subItem) => (
                            <li key={subItem.name}>
                              <NavLink
                                to={subItem.href}
                                className={({ isActive }) =>
                                  classNames(
                                    isActive
                                      ? 'bg-gray-50 text-indigo-600'
                                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-md p-2 pl-9 text-sm leading-6'
                                  )
                                }
                              >
                                {({ isActive }) => {
                                  const SubIconComponent = getIcon(subItem.icon);
                                  return (
                                    <>
                                      <SubIconComponent
                                        className={classNames(
                                          isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                          'h-4 w-4 shrink-0'
                                        )}
                                        aria-hidden="true"
                                      />
                                      {subItem.name}
                                    </>
                                  );
                                }}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="/logo.svg"
              alt="ClinicHub"
            />
            <span className="ml-2 text-xl font-semibold text-gray-900">ClinicHub</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      {!item.subMenu ? (
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            classNames(
                              isActive
                                ? 'bg-gray-50 text-indigo-600'
                                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                            )
                          }
                        >
                          {({ isActive }) => {
                            const IconComponent = getIcon(item.icon);
                            return (
                              <>
                                <IconComponent
                                  className={classNames(
                                    isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                    'h-6 w-6 shrink-0'
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </>
                            );
                          }}
                        </NavLink>
                      ) : (
                        <div>
                          <button
                            onClick={() => toggleExpanded(item.name)}
                            className={classNames(
                              'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                              'group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm leading-6 font-semibold'
                            )}
                          >
                            {(() => {
                              const IconComponent = getIcon(item.icon);
                              return (
                                <>
                                  <IconComponent
                                    className="text-gray-400 group-hover:text-indigo-600 h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                  />
                                  <span className="flex-1">{item.name}</span>
                                  <ChevronRightIcon
                                    className={classNames(
                                      expandedItems.includes(item.name) ? 'rotate-90 text-gray-500' : 'text-gray-400',
                                      'ml-auto h-5 w-5 shrink-0'
                                    )}
                                    aria-hidden="true"
                                  />
                                </>
                              );
                            })()}
                          </button>
                          {expandedItems.includes(item.name) && (
                            <ul className="mt-1 px-2">
                              {item.subMenu?.map((subItem) => (
                                <li key={subItem.name}>
                                  <NavLink
                                    to={subItem.href}
                                    className={({ isActive }) =>
                                      classNames(
                                        isActive
                                          ? 'bg-gray-50 text-indigo-600'
                                          : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                        'group flex gap-x-3 rounded-md p-2 pl-9 text-sm leading-6'
                                      )
                                    }
                                  >
                                    {({ isActive }) => {
                                      const SubIconComponent = getIcon(subItem.icon);
                                      return (
                                        <>
                                          <SubIconComponent
                                            className={classNames(
                                              isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                              'h-4 w-4 shrink-0'
                                            )}
                                            aria-hidden="true"
                                          />
                                          {subItem.name}
                                        </>
                                      );
                                    }}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
