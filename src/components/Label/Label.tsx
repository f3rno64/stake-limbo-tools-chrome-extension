import S from './Label.module.scss';

const Label = (props) => {
  return (
    <label {...props} className={S.slb_label} />
  );
};

export default Label;
