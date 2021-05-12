import { FC } from 'react';
import { Form, FormGroupProps, FormLabelProps } from 'react-bootstrap';

import Select, { SelectProps } from 'components/Select/Select';

interface FormGroupWithLabelAndControlProps extends FormGroupProps {
  label?: string;
  labelProps?: FormLabelProps;
  selectProps: SelectProps;
}
const FormGroupWithLabelAndSelect: FC<FormGroupWithLabelAndControlProps> = ({
  label,
  labelProps,
  selectProps,
  ...props
}) => {
  return (
    <Form.Group {...props}>
      {label && <Form.Label {...labelProps}>{label}</Form.Label>}
      <Select {...selectProps} />
    </Form.Group>
  );
};

export default FormGroupWithLabelAndSelect;
