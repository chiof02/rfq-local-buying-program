import { FC } from 'react';
import {
  Form,
  FormControlProps,
  FormGroupProps,
  FormLabelProps,
} from 'react-bootstrap';

interface FormGroupWithLabelAndControlProps extends FormGroupProps {
  label?: string;
  labelProps?: FormLabelProps;
  controlProps?: FormControlProps;
}
const FormGroupWithLabelAndControl: FC<FormGroupWithLabelAndControlProps> = ({
  label,
  labelProps,
  controlProps,
  ...props
}) => {
  return (
    <Form.Group {...props}>
      {label && <Form.Label {...labelProps}>{label}</Form.Label>}
      <Form.Control {...controlProps} />
    </Form.Group>
  );
};

export default FormGroupWithLabelAndControl;
