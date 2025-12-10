import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Navbar({ image }) {
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Left Logo */}
          <div className="flex items-center font-bold text-xl text-blue-700">
            ExpenseTracker
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex space-x-6 items-center">
            <a
              href="/user/expense/add"
              className="text-blue-700 hover:text-black font-medium"
            >
              Add Expense
            </a>

            {/* Profile & Menu */}
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center">
                <img
                  // src="https://i.pravatar.cc/50"
                  src={`http://127.0.0.1:8000${image}`}
                  className="w-9 h-9 rounded-full border"
                  alt="profile"
                />
              </MenuButton>

              <MenuItems className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border p-1">
                <MenuItem>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>

          {/* Mobile Button */}
          <div className="sm:hidden flex items-center">
            <DisclosureButton className="p-2 text-blue-700">
              <Bars3Icon className="block h-6 w-6 data-open:hidden" />
              <XMarkIcon className="hidden h-6 w-6 data-open:block" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      {/* Mobile Panel */}
      <DisclosurePanel className="sm:hidden px-4 pb-4 space-y-2">
        <a
          href="/user/expense/add"
          className="block text-blue-700 font-semibold"
        >
          Add Expense
        </a>

        <button
          onClick={handleLogout}
          className="block w-full text-left text-red-600 py-1 hover:bg-red-100 rounded"
        >
          Logout
        </button>
      </DisclosurePanel>
    </Disclosure>
  );
}
