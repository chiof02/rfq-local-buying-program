import { GetStaticProps } from 'next';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { Button, Card, Col, Form, FormProps, Row } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';

import { motion } from 'framer-motion';
// eslint-disable-next-line import/no-unresolved
import { Except } from 'type-fest';
import request from 'utils/request';

import FormControlFile from 'components/FormControlFile/FormControlFile';
import FormGroupWithLabelAndControl from 'components/FormGroupWithLabelAndControl/FormGroupWithLabelAndControl';
import FormGroupWithLabelAndSelect from 'components/FormGroupWithLabelAndSelect/FormGroupWithLabelAndSelect';
import SectionWithContainer from 'components/SectionWithContainer/SectionWithContainer';
import { ICity } from 'models/ICity';
import { IState } from 'models/IState';
import { ISupplier } from 'models/ISupplier';
import { ISupplyCategory } from 'models/ISupplyCategory';
import { ITender } from 'models/ITender';

import MainLayout from '../layouts/MainLayout';
import renderCommonMetaTags from '../utils/renderCommonMetaTags';

interface IProps {
  statusCode?: number;
  host: string;
  tenders: ITender[];
  suppliers: ISupplier[];
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    // const api = fetcherNextJSAPI();
    // const [] = await Promise.all([
    //   // TODO: Add the requests
    // ]);
    return {
      props: {},
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

enum SubscribePageTypes {
  supplier = 'supplier',
  buyer = 'buyer',
}

interface SupplierSubscribeFormProps extends Except<FormProps, 'onSubmit'> {
  onSubmit?: (value: any) => any;
  supplyCategories?: ISupplyCategory[];
  states?: IState[];
  cities?: ICity[];
  loading?: boolean;
}

const SupplierSubscribeForm: FC<SupplierSubscribeFormProps> = ({
  onSubmit = () => {},
  supplyCategories = [],
  states = [],
  cities = [],
  loading,
  ...props
}) => {
  const { register, handleSubmit, control } = useForm();
  return (
    <Form onSubmit={handleSubmit(onSubmit)} {...props}>
      <FormGroupWithLabelAndControl
        label="Name"
        controlProps={register('Name', { required: true })}
      />
      <FormGroupWithLabelAndControl
        label="ABN"
        controlProps={{
          ...register('ABN', { required: true }),
          type: 'number',
        }}
      />
      <Form.Group>
        <Form.Label>Logo</Form.Label>
        <Controller
          name="Logo"
          control={control}
          render={({ field }) => <FormControlFile {...field} />}
        />
      </Form.Group>
      <FormGroupWithLabelAndControl
        label="Description"
        controlProps={{
          ...register('Description', { required: true }),
          as: 'textarea',
        }}
      />
      <Controller
        name="SupplyCategories"
        control={control}
        defaultValue={false}
        rules={{ required: true }}
        render={({ field }) => (
          <FormGroupWithLabelAndSelect
            {...field}
            label="Supply Categories"
            selectProps={{ options: supplyCategories }}
          />
        )}
      />
      <Controller
        name="State_ID"
        control={control}
        defaultValue={false}
        rules={{ required: true }}
        render={({ field }) => (
          <FormGroupWithLabelAndSelect
            {...field}
            label="State"
            selectProps={{
              options: states,
            }}
          />
        )}
      />
      <Controller
        name="City_ID"
        control={control}
        defaultValue={false}
        rules={{ required: true }}
        render={({ field }) => (
          <FormGroupWithLabelAndSelect
            {...field}
            label="City"
            selectProps={{
              options: cities,
            }}
          />
        )}
      />

      <Button disabled={loading} type="submit">
        Register
      </Button>
    </Form>
  );
};

interface BuyerSubscribeFormProps extends Except<FormProps, 'onSubmit'> {
  onSubmit?: (value: any) => any;
  loading?: boolean;
}

const BuyerSubscribeForm: FC<BuyerSubscribeFormProps> = ({
  onSubmit = () => {},
  loading,
  ...props
}) => {
  const { register, handleSubmit, control } = useForm();
  return (
    <Form onSubmit={handleSubmit(onSubmit)} {...props}>
      <FormGroupWithLabelAndControl
        label="Name"
        controlProps={register('Name', { required: true })}
      />
      <FormGroupWithLabelAndControl
        label="ABN"
        controlProps={{
          ...register('ABN', { required: true }),
          type: 'number',
        }}
      />
      <Form.Group>
        <Form.Label>Logo</Form.Label>
        <Controller
          name="Logo"
          control={control}
          render={({ field }) => <FormControlFile {...field} />}
        />
      </Form.Group>
      <Button disabled={loading} type="submit">
        Register
      </Button>
    </Form>
  );
};

const SubscribePage: FC<IProps> = ({ statusCode = null, host = '' }) => {
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);
  const type = query.type as SubscribePageTypes;

  if (statusCode) {
    return <ErrorPage statusCode={statusCode} />;
  }

  const onSubmit = async (value: any) => {
    setLoading(true);
    try {
      const response = await request.post('/users', value);
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
          'rfq-cres - Subscribe Page',
          'Subscribe Page - Description',
          undefined,
          `${host}/`,
          undefined,
          'Subscribe Page',
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
          <SectionWithContainer className="bg-light-grey">
            <Row>
              <Col className="offset-md-1" md={10}>
                <Card>
                  <Card.Body>
                    <h1 className="mb-5">
                      Subscribe as {(type || '').toLocaleUpperCase()}
                    </h1>
                    {SubscribePageTypes.buyer === type ? (
                      <BuyerSubscribeForm
                        loading={loading}
                        onSubmit={onSubmit}
                      />
                    ) : (
                      <SupplierSubscribeForm
                        loading={loading}
                        onSubmit={onSubmit}
                      />
                    )}
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

export default SubscribePage;
