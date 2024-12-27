const PageHeader = ({ icon: Icon, title, children }) => {
    return (
      <>
        <div>
          <div className="flex h-16 items-center px-6 justify-between bg-white">
            <div className="flex items-center gap-3">
              {Icon && <Icon className="h-6 w-6 text-gray-500" />}
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            </div>
            {children && (
              <div className="flex items-center gap-3">
                {children}
              </div>
            )}
          </div>
        </div>
        <div className="h-[1px] bg-gray-200"></div>
      </>
    );
  };
  
  export default PageHeader;