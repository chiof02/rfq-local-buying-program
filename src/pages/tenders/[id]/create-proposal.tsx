import { GetStaticProps } from 'next';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { FC } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { motion } from 'framer-motion';
import moment from 'moment';
import renderCommonMetaTags from 'utils/renderCommonMetaTags';

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
  return {
    paths: [
      {
        params: { id: '1' },
      },
      {
        params: { id: '2' },
      },
    ],
    fallback: true, // See the "fallback" section below
  };
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    // const api = fetcherNextJSAPI();
    // const [] = await Promise.all([
    //   // TODO: Add the requests
    // ]);
    const tender: ITender = {
      ID: 1,
      Buyer_ID: 1,
      Buyer: {
        ABN: '21321',
        ID: 1,
        Name: 'Name',
        Logo:
          'https://images.unsplash.com/photo-1584715787746-75b93b83bf14?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
        Description: 'Description',
        State_ID: 1,
        State: {
          ID: 1,
          Name: 'City',
          Acronym: 'CIT',
        },
        City_ID: 1,
        City: {
          ID: 1,
          Name: 'Cool City',
          State_ID: 1,
        },
        DeletedAt: '2022-03-01',
        CreatedAt: '2022-03-01',
        UpdatedAt: '2022-03-01',
      },
      PublishedAt: '2022-03-01',
      ClosingAt: '2021-04-29',
      Title: 'Title',
      HeadingImage:
        'https://images.unsplash.com/photo-1584715787746-75b93b83bf14?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
      Description: 'Description',
      State_ID: 1,
      State: {
        ID: 1,
        Name: 'City',
        Acronym: 'CIT',
      },
      City_ID: 1,
      City: {
        ID: 1,
        Name: 'Cool City',
        State_ID: 1,
      },
      Offer: 2323.23,
      DeletedAt: '2022-03-01',
      CreatedAt: '2022-03-01',
      UpdatedAt: '2022-03-01',
      SupplyCategories: [
        {
          ID: 1,
          Name: 'Name',
          Description: 'Name',
        },
        {
          ID: 1,
          Name: 'Name',
          Description: 'Other Name',
        },
      ],
    };
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
  if (statusCode) {
    return <ErrorPage statusCode={statusCode} />;
  }

  function onSubmit(values: any) {
    console.info(values);
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
                      <Button type="submit">Register</Button>
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