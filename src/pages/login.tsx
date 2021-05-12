import ErrorPage from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import { FC, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { motion } from 'framer-motion';
import request from 'utils/request';

import SectionWithContainer from 'components/SectionWithContainer/SectionWithContainer';
import { ISupplier } from 'models/ISupplier';
import { ITender } from 'models/ITender';

import MainLayout from '../layouts/MainLayout';
import renderCommonMetaTags from '../utils/renderCommonMetaTags';

interface IProps {
  statusCode?: number;
  host: string;
  tenders: ITender[];
  suppliers: ISupplier[];
}

const LoginPage: FC<IProps> = ({ statusCode = null, host = '' }) => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  if (statusCode) {
    return <ErrorPage statusCode={statusCode} />;
  }

  const onSubmit = async (value: any) => {
    setLoading(true);
    try {
      const response = await request.post('/login', value);
      console.info(response);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  return (
    <>
      <Head>
        {renderCommonMetaTags(
          'rfq-cres',
          'rfq-cres Description',
          undefined,
          `${host}/`,
          undefined,
          'rfq-cres',
          undefined,
        )}
      </Head>
      <MainLayout>
        <motion.div
          key="homepage"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ ease: 'easeInOut', duration: 0.3 }}
        >
          <SectionWithContainer className="bg-primary vh-100 d-flex align-items-center justify-content-between">
            <Row>
              <Col className="offset-md-4" md={4}>
                <Card>
                  <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control {...register('email')} />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          {...register('password')}
                          type="password"
                        />
                      </Form.Group>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-100 mt-3 mb-3"
                      >
                        Login
                      </Button>
                      <p className="text-center">
                        Don't you have an account? <br />
                        <Link href="/subscribe" passHref>
                          <a>Create one!</a>
                        </Link>
                      </p>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </SectionWithContainer>
        </motion.div>
      </MainLayout>
    </>
  );
};

export default LoginPage;
