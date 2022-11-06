import S from './Input.module.scss';

const Input = (props) => {
  return (
    <input {...props} className={S.slb_input} />
  );
};

export default Input;
