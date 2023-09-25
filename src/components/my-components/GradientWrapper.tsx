interface IProps {
    children: React.ReactNode;
  }
  
  const GradientWrapper: React.FC<IProps> = ({ children }) => {
    return (
      <div className="w-screen min-h-screen bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100">
        {children}
      </div>
    );
  };
  
  export default GradientWrapper;
  