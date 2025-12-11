import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ name, image }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Disclosure
      as="nav"
      className="bg-blue-50 border-b border-blue-200 shadow-sm"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              {/* Left: Logo + Greeting */}
              <div className="flex items-center space-x-4">
                <div className="font-bold text-xl text-blue-700">
                  ExpenseTracker
                </div>
                {name && (
                  <span className="text-blue-800 font-medium hidden sm:inline">
                    Hey, {name} 👋
                  </span>
                )}
              </div>

              {/* Desktop Menu */}
              <div className="hidden sm:flex space-x-6 items-center">
                <Link
                  to="/user/expense/add"
                  className="text-blue-700 hover:text-black font-medium"
                >
                  Add Expense
                </Link>

                {/* Profile Menu */}
                <Menu as="div" className="relative">
                  <MenuButton className="flex items-center">
                    <img
                      src={image || "https://i.pravatar.cc/50"}
                      className="w-9 h-9 rounded-full border"
                      alt="profile"
                    />
                  </MenuButton>

                  <MenuItems className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border p-1">
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          to="user/edit"
                          className={`block w-full text-left py-1 px-2 rounded text-black ${
                            active ? "bg-gray-100" : ""
                          }`}
                        >
                          Profile Edit
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left py-1 px-2 rounded text-red-600 ${
                            active ? "bg-red-100" : ""
                          }`}
                        >
                          Logout
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>

              {/* Mobile Button */}
              <div className="sm:hidden flex items-center">
                <Disclosure.Button className="p-2 text-blue-700">
                  {open ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Panel */}
          <Disclosure.Panel className="sm:hidden px-4 pb-4 space-y-2">
            {name && (
              <div className="text-blue-800 font-medium py-1">
                Hey, {name} 👋
              </div>
            )}

            <Link
              to="/user/expense/add"
              className="block text-blue-700 font-semibold"
            >
              Add Expense
            </Link>

            <Link
              to="user/edit"
              className="block w-full text-left text-black py-1 hover:bg-gray-100 rounded"
            >
              Profile Edit
            </Link>

            <button
              onClick={handleLogout}
              className="block w-full text-left text-red-600 py-1 hover:bg-red-100 rounded"
            >
              Logout
            </button>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
