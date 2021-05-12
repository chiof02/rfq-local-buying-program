import { FC } from 'react';
import { Col, Row } from 'react-bootstrap';

import cx from 'classnames';

type RowWithOffsetColProps = {
  colProps?: any;
  offset?: number;
  className?: string;
};
const RowWithOffsetCol: FC<RowWithOffsetColProps> = ({
  offset,
  colProps,
  children,
  ...props
}) => {
  const { className: colClassName, ...restColProps } = colProps || {};
  const finalOffset = offset || 1;
  const columnSize = 12 - finalOffset * 2;
  return (
    <Row {...props}>
      <Col
        className={cx(`offset-lg-${finalOffset}`, colClassName)}
        lg={columnSize}
        {...restColProps}
      >
        {children}
      </Col>
    </Row>
  );
};

export default RowWithOffsetCol;
