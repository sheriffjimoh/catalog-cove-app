import { Link } from "@inertiajs/react";

interface TabBtnProps {
  title: string;
  link: string;
  text: string;
  children: React.ReactNode;
}

function TabBtn({ title, link, text, children }: TabBtnProps) {
 const location = window.location.pathname;
  const path = location.split("/")[location.split("/").length - 1];

  return (
    <Link
      href={link}
      className={`tab flex gap-x-4 p-4 rounded-lg transition-all ${
        path === link
          ? "nav-active"
          : path === "settings" && link === ""
          ? "nav-active"
          : ""
      } `}
    >
      <div className="w-12 tab-icon transition-all h-12 shrink-0 rounded-full inline-flex items-center justify-center bg-bgray-100 dark:bg-darkblack-500">
        {children}
      </div>
      <div>
        <h4 className="text-base font-bold text-bgray-900 dark:text-white">
          {title}
        </h4>
        <p className="text-sm font-medium text-bgray-700 dark:text-darkblack-300 mt-0.5">
          {text}
        </p>
      </div>
    </Link>
  );
}


export default TabBtn;
