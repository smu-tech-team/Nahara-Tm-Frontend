const Button = ({ children, onClick, className, type = "button" }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`bg-blue-600 text-white py-2 px-4 rounded ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  