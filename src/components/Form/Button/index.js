import "./style.scss";
const Button = ({ children, loading, className, type, onClick, disabled }) => {
  return (
    <button
      type={type}
      className={`btn f-14 fw-700 ${className}`}
      disabled={loading || disabled}
      onClick={onClick}
    >
      {!loading && <span>{children}</span>}
      {loading && <i className="fa fa-spin fa-spinner"></i>}
    </button>
  );
};
export default Button;