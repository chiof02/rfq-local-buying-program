import { GetStaticProps } from 'next';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { FC } from 'react';

import { motion } from 'framer-motion';
import renderCommonMetaTags from 'utils/renderCommonMetaTags';

import BuyerProfile from 'components/BuyerProfile/BuyerProfile';
import { IBuyer } from 'models/IBuyer';
import { ITender } from 'models/ITender';

import MainLayout from '../../layouts/MainLayout';

export const getStaticPaths = async () => {
  return {
    paths: [
      {
        params: { id: '1' },
      },
      {
        params: { id: '2' },
      },
      {
        params: { id: '3' },
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
    const buyer: IBuyer = {
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
    };
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
      ClosingAt: '2022-03-01',
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
    const tenders = [tender, tender, tender, tender];
    return {
      props: {
        buyer,
        tenders,
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

interface IProps {
  statusCode?: number;
  host: string;
  buyer: IBuyer;
  tenders: ITender[];
}

const BuyerProfilePage: FC<IProps> = ({
  buyer,
  tenders,
  statusCode = null,
  host = '',
}) => {
  if (statusCode || !buyer) {
    return <ErrorPage statusCode={statusCode || 400} />;
  }
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
          <BuyerProfile buyer={buyer} tenders={tenders} />
        </motion.div>
      </MainLayout>
    </>
  );
};

export default BuyerProfilePage;
