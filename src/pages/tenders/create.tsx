import { GetStaticProps } from 'next';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { FC } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';

import { motion } from 'framer-motion';
import renderCommonMetaTags from 'utils/renderCommonMetaTags';

import FormControlFile from 'components/FormControlFile/FormControlFile';
import RowWithOffsetCol from 'components/RowWithOffsetCol/RowWithOffsetCol';
import SectionWithContainer from 'components/SectionWithContainer/SectionWithContainer';
import Select from 'components/Select/Select';
import { ICity } from 'models/ICity';
import { IState } from 'models/IState';
import { ISupplyCategory } from 'models/ISupplyCategory';

import MainLayout from '../../layouts/MainLayout';

interface IProps {
  statusCode?: number;
  host: string;
  states: IState[];
  cities: ICity[];
  supplyCategories: ISupplyCategory[];
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    // const api = fetcherNextJSAPI();
    // const [] = await Promise.all([
    //   // TODO: Add the requests
    // ]);
    return {
      props: {
        cities: [],
        states: [],
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

const CreateTenderPage: FC<IProps> = ({
  cities,
  states,
  supplyCategories,
  statusCode = null,
  host = '',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
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
              <Card>
                <Card.Body className="p-4">
                  <h3>Create Tender</h3>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group>
                      <Form.Label>What is the name of your project?</Form.Label>
                      <Form.Control {...register('Title')} />
                      {errors.Title && (
                        <span className="text-error">{errors.Title}</span>
                      )}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Could you provide an image?</Form.Label>
                      <Controller
                        name="HeadingImage"
                        control={control}
                        render={({ field }) => <FormControlFile {...field} />}
                      />
                      {errors.HeadingImage && (
                        <span className="text-error">
                          {errors.HeadingImage}
                        </span>
                      )}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>What kind of services you need?</Form.Label>
                      <Controller
                        name="SupplyCategories"
                        control={control}
                        render={({ field }) => (
                          <Select {...field} options={supplyCategories} />
                        )}
                      />
                      {errors.SupplyCategories && (
                        <span className="text-error">
                          {errors.SupplyCategories}
                        </span>
                      )}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        When do you need this project to be delivered?
                      </Form.Label>
                      <Form.Control type="date" {...register('ClosingAt')} />
                      {errors.ClosingAt && (
                        <span className="text-error">{errors.ClosingAt}</span>
                      )}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        Where is this service/supply needs to come from?
                      </Form.Label>
                      <Row>
                        <Col md="auto">
                          <Form.Group>
                            <Form.Label>City</Form.Label>
                            <Controller
                              name="City_ID"
                              control={control}
                              render={({ field }) => (
                                <Select {...field} options={cities} />
                              )}
                            />
                          </Form.Group>
                        </Col>
                        <Col md="auto">
                          <Form.Group>
                            <Form.Label>State</Form.Label>
                            <Controller
                              name="State_ID"
                              control={control}
                              render={({ field }) => (
                                <Select {...field} options={states} />
                              )}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>How much is the maximum price?</Form.Label>
                      <Form.Control {...register('Offer')} type="number" />
                      {errors.Offer && (
                        <span className="text-error">{errors.Offer}</span>
                      )}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        Can you describe in detail what are the requirements?
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        {...register('Description')}
                      />
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

export default CreateTenderPage;
