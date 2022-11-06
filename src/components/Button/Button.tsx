import S from './Button.module.scss';

const Button = (props) => {
  return (
    <button {...props} className={S.slb_button} />
  );
};

export default Button;
