import { useState, useEffect } from "react";
import "./App.css";

// Import all your components
import Machine from "./data/machine";
import AddMachine from "./data/work";
import SearchMachine from "./data/consumables";
import WorkTable from "./data/work_table";
import ConsumablesTable from "./data/consumables_table";
import MachineTable from "./data/machine_table";
import ConsumablesDetails from "./data/cosumables_work";
import ConsumablesDetailsTable from "./data/cosumables_work_table";
import SubConsumablesForm from "./data/sub_consumables";
import SubConsumablesTable from "./data/sub_consumables_table";
import SubConsumableWork from "./data/sub_consumable_work";
import SubConsumableWorkTable from "./data/sub_consumable_work_table";
import SubConsumableMain from "./data/sub_consumable_main";
import SubConsumableMainTable from "./data/sub_consumable_main_table";

// SVG Icons as components
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

const MachineIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5s-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.79 2.59 5.01 4 8.19 4s6.4-1.41 8.19-4H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8z"/>
  </svg>
);

const WorkIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M14 6h-4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-4zm-4 6h4v2h-4v-2z"/>
  </svg>
);

const ConsumablesIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
  </svg>
);

const DetailsIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
  </svg>
);

const SubIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

const TableIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h4v4H7V7zm0 6h4v4H7v-4zm6-6h4v4h-4V7zm0 6h4v4h-4v-4z"/>
  </svg>
);

function App() {
  const [activePage, setActivePage] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (page) => {
    setActivePage(page);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "Enter Machine Details":
        return <Machine />;
      case "View Machine Details":
        return <MachineTable />;
      case "Enter Work Details":
        return <AddMachine />;
      case "View Work Details":
        return <WorkTable />;
      case "Enter Consumable Details":
        return <SearchMachine />;
      case "View Consumable Details":
        return <ConsumablesTable />;
      case "Enter Consumable Work Details":
        return <ConsumablesDetails />;
      case "View Consumable Work Details":
        return <ConsumablesDetailsTable />;
      case "Enter Consumable (Sub-type) Details":
        return <SubConsumablesForm />;
      case "View Consumable (Sub-type) Details":
        return <SubConsumablesTable />;
      case "Enter Consumable (Sub-type) Category Details":
        return <SubConsumableWork />;
      case "View Consumable (Sub-type) Category Details":
        return <SubConsumableWorkTable />;
      case "Enter Consumable (Sub-type) Work Details":
        return <SubConsumableMain />;
      case "View Consumable (Sub-type) Work Details":
        return <SubConsumableMainTable />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-grid">
      <div className="dashboard-card" >
        <div className="dashboard-card-icon">
          <MachineIcon />
        </div>
       
      </div>

      <div className="dashboard-card" >
        <div className="dashboard-card-icon">
          <WorkIcon />
        </div>
       
      </div>

      <div className="dashboard-card" >
        <div className="dashboard-card-icon">
          <ConsumablesIcon />
        </div>
      </div>

      <div className="dashboard-card" >
        <div className="dashboard-card-icon">
          <DetailsIcon />
        </div>
        
      </div>

      <div className="dashboard-card" >
        <div className="dashboard-card-icon">
          <SubIcon />
        </div>
       
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-icon">
          <WorkIcon />
        </div>
      
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-icon">
          <MachineIcon />
        </div>
      </div>
    </div>
  );

  const NavItem = ({ page, icon, label, onClick, isActive }) => (
    <button
      className={`nav-item ${isActive ? 'active' : ''}`}
      onClick={() => onClick(page)}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="app-container">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
<img src="https://i.ibb.co/6RVwBkWp/download-1.png" />
</div>

        <button className="new-chat-btn" onClick={() => handleNavigation(null)}>
          <DashboardIcon />
          Dashboard
        </button>

        <div className="sidebar-nav">
          {/* Machine Section */}
          <div className="nav-section">
            <div className="nav-section-title">Machine segment</div>
            <NavItem 
              page="Enter Machine Details" 
              icon={<MachineIcon />} 
              label="Enter Machine" 
              onClick={handleNavigation}
              isActive={activePage === "Enter Machine Details"}
            />
            <NavItem 
              page="View Machine Details" 
              icon={<TableIcon />} 
              label="Machine Table" 
              onClick={handleNavigation}
              isActive={activePage === "View Machine Details"}
            />
          </div>

          {/* Work Section */}
          <div className="nav-section">
            <div className="nav-section-title">Work segment</div>
            <NavItem 
              page="Enter Work Details" 
              icon={<WorkIcon />} 
              label="Enter Work" 
              onClick={handleNavigation}
              isActive={activePage === "Enter Work Details"}
            />
            <NavItem 
              page="View Work Details" 
              icon={<TableIcon />} 
              label="Work Table" 
              onClick={handleNavigation}
              isActive={activePage === "View Work Details"}
            />
          </div>

          {/* Consumables Section */}
          <div className="nav-section">
            <div className="nav-section-title">Consumable segment</div>
            <NavItem 
              page="Enter Consumable Details" 
              icon={<ConsumablesIcon />} 
              label="Enter Consumable" 
              onClick={handleNavigation}
              isActive={activePage === "Enter Consumable Details"}
            />
            <NavItem 
              page="View Consumable Details" 
              icon={<TableIcon />} 
              label="Consumable Table" 
              onClick={handleNavigation}
              isActive={activePage === "View Consumable Details"}
            />
          </div>

          {/* Consumable Details Section */}
          <div className="nav-section">
            <div className="nav-section-title">Consumable Work segment</div>
            <NavItem 
              page="Enter Consumable Work Details" 
              icon={<DetailsIcon />} 
              label="Enter Consumable Work" 
              onClick={handleNavigation}
              isActive={activePage === "Enter Consumable Work Details"}
            />
            <NavItem 
              page="View Consumable Work Details" 
              icon={<TableIcon />} 
              label="Consumable Work Table" 
              onClick={handleNavigation}
              isActive={activePage === "View Consumable Work Details"}
            />
          </div>

          {/* Sub Consumables Section */}
          <div className="nav-section">
            <div className="nav-section-title"> Consumable (Sub-Type) segment</div>
            <NavItem 
              page="Enter Consumable (Sub-type) Details" 
              icon={<SubIcon />} 
              label="Enter Consumable (Sub-type)" 
              onClick={handleNavigation}
              isActive={activePage === "Enter Consumable (Sub-type) Details"}
            />
            <NavItem 
              page="View Consumable (Sub-type) Details" 
              icon={<TableIcon />} 
              label="Consumable (Sub-type) Table" 
              onClick={handleNavigation}
              isActive={activePage === "View Consumable (Sub-type) Details"}
            />
          </div>

          {/* Sub Consumable Work Section */}
          <div className="nav-section">
            <div className="nav-section-title">Consumable (Sub-type) Category segment</div>
            <NavItem 
              page="Enter Consumable (Sub-type) Category Details" 
              icon={<WorkIcon />} 
              label="Enter Consumable (Sub-type) Category" 
              onClick={handleNavigation}
              isActive={activePage === "Enter Consumable (Sub-type) Category Details"}
            />
            <NavItem 
              page="View Consumable (Sub-type) Category Details" 
              icon={<TableIcon />} 
              label="Consumable (Sub-type) Category Table" 
              onClick={handleNavigation}
              isActive={activePage === "View Consumable (Sub-type) Category Details"}
            />
          </div>

          {/* Sub Consumable Main Section */}
          <div className="nav-section">
            <div className="nav-section-title">Consumable (Sub-type) Work segment</div>
            <NavItem 
              page="Enter Consumable (Sub-type) Work Details" 
              icon={<MachineIcon />} 
              label="Enter Consumable (Sub-type) Work" 
              onClick={handleNavigation}
              isActive={activePage === "Enter Consumable (Sub-type) Work Details"}
            />
            <NavItem 
              page="View Consumable (Sub-type) Work Details" 
              icon={<TableIcon />} 
              label="Consumable (Sub-type) Table" 
              onClick={handleNavigation}
              isActive={activePage === "View Consumable (Sub-type) Work Details"}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1>
            {activePage 
              ? activePage.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
              : 'Welcome to Dashboard'
            }
          </h1>

          <div>
            <p>Santi Rice Group Machinery Management System</p> <small> System v1.0 (March, 2026)</small>
          </div>
          
        </div>

        <div className="content-body">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;