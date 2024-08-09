import classes from './inputContainer.module.css';

export default function InputContainer({ label, bgColor, borderColor, children }) {
  return (
    <div 
      className={classes.container} 
      style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
    >
      <label className={classes.label}>{label}</label>
      <div className={classes.content}>{children}</div>
    </div>
  );
}
