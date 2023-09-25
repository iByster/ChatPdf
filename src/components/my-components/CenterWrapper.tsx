interface IProps {
  children: React.ReactNode;
}

const CenterWrapper: React.FC<IProps> = ({ children }) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      {children}
    </div>
  );
};

export default CenterWrapper;
