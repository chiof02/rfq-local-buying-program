import { GetStaticProps } from 'next';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { FC, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { motion } from 'framer-motion';
import moment from 'moment';
import renderCommonMetaTags from 'utils/renderCommonMetaTags';
import request from 'utils/request';

import RowWithOffsetCol from 'components/RowWithOffsetCol/RowWithOffsetCol';
import SectionWithContainer from 'components/SectionWithContainer/SectionWithContainer';
import { ITender } from 'models/ITender';

import MainLayout from '../../../layouts/MainLayout';

interface IProps {
  statusCode?: number;
  host: string;
  tender: ITender;
}

export const getStaticPaths = async () => {
  const { data: tenders } = await request.get<ITender[]>('/tenders');
  return {
    paths: tenders.map(tender => ({
      params: { id: tender.ID.toString() },
    })),
    fallback: true, // See the "fallback" section below
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const { data: tender } = await request.get<ITender[]>(
      `/tenders/${params?.id || '0'}`,
    );
    return {
      props: {
        tender,
      },
      revalidate: 60, // time in seconds
    };
  } catch (error) {
    console.error('[ERROR]', error);
    return {
      props: {
        statusCode: error.status || null,
      },
      revalidate: 1, // time in seconds
    };
  }
};

const CreateProposalPage: FC<IProps> = ({
  tender,
  statusCode = null,
  host = '',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  if (statusCode) {
    return <ErrorPage statusCode={statusCode} />;
  }

  async function onSubmit(values: any) {
    setLoading(true);
    try {
      const response = await request.post('/proposal', {
        Tender_ID: tender.ID,
        ...values,
      });
      console.info(response);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

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
          key="my-tenders"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ ease: 'easeInOut', duration: 0.3 }}
        >
          <SectionWithContainer className="bg-primary d-flex justify-content-between flex-column flex-grow-1">
            <RowWithOffsetCol offset={2}>
              <Card
                body
                style={{ background: `url(${tender.HeadingImage})` }}
                className="mb-3"
              >
                <Row>
                  <Col md="auto">
                    <span className="text-white">Logo</span>
                  </Col>
                  <Col md="auto">
                    <h5 className="d-block text-white">ESTIMATED DELIVERY</h5>
                    <span className="text-white">
                      {moment(tender.ClosingAt).format('DD/MM/YYYY')}
                    </span>
                  </Col>
                </Row>
              </Card>
              <Card>
                <Card.Body className="p-4">
                  <h3>Create Proposal</h3>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group>
                      <Form.Label>
                        Can you describe your solution / product?
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        {...register('Description')}
                      />
                      {errors.Description && (
                        <span className="text-error">{errors.Description}</span>
                      )}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>How much is going to cost?</Form.Label>
                      <Form.Control type="number" {...register('Offer')} />
                      {errors.Offer && (
                        <span className="text-error">{errors.Offer}</span>
                      )}
                    </Form.Group>
                    <Form.Group>
                      <Button disabled={loading} type="submit">
                        Register
                      </Button>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </RowWithOffsetCol>
          </SectionWithContainer>
        </motion.div>
      </MainLayout>
    </>
  );
};

export default CreateProposalPage;
