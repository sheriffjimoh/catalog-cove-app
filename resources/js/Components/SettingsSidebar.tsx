import TabBtn from "./Tabbtn";
import { User , LockIcon} from "lucide-react";

function SettingsSidebar() {
  const location = window.location.pathname;
  const path = location.split("/")[location.split("/").length - 1];

  return (
    <aside className="col-span-3 border-r border-bgray-200 dark:border-darkblack-400">
      {/* Sidebar Tabs */}

      <div className="px-4 py-6">
        <TabBtn
          link="/settings/business-information"
          title="Business Informations"
          text="view and update your business information"
        >
            <User 
            className={`w-6 h-6 hover:text-purple-700` + (path === "business-information" || path == "settings" ? " text-purple-700" : "")}

            />
        </TabBtn>
      </div>
    
    </aside>
  );
}
export default SettingsSidebar;
