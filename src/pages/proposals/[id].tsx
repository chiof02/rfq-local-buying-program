import { GetStaticProps } from 'next';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { FC } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

import { motion } from 'framer-motion';
import moment from 'moment';
import renderCommonMetaTags from 'utils/renderCommonMetaTags';

import SectionWithContainer from 'components/SectionWithContainer/SectionWithContainer';
import { IProposal } from 'models/IProposal';
import { ISupplier } from 'models/ISupplier';
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
    const supplier: ISupplier = {
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
    const proposal: IProposal = {
      ApprovedAt: '',
      CreatedAt: '',
      DeletedAt: '',
      Description: '',
      Offer: 0,
      Supplier: supplier,
      Supplier_ID: 0,
      Tender: tender,
      Tender_ID: 0,
      UpdatedAt: '',
      ID: 1,
    };
    return {
      props: {
        proposal,
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
  proposal: IProposal;
}

const ProposalDetailPage: FC<IProps> = ({
  proposal,
  statusCode = null,
  host = '',
}) => {
  if (statusCode || !proposal) {
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
          <SectionWithContainer>
            <h4>{proposal.Tender?.Title}</h4>
            <div>
              <small className="d-block">ESTIMATED DELIVERY</small>
              <span>
                {moment(proposal.Tender?.ClosingAt).format('DD/MM/YYYY')}
              </span>
              <Row className="justify-content-between">
                <Col md="auto">
                  <Row>
                    <Col md="auto">
                      <img
                        className="img-thumbnail"
                        src={proposal.Supplier?.Logo}
                        alt={proposal.Supplier?.Name}
                        width={80}
                      />
                    </Col>
                    <Col md="auto">
                      <strong className="d-block">
                        {proposal.Supplier?.Name}
                      </strong>
                      <span className="text-success">{proposal.Offer}</span>
                    </Col>
                  </Row>
                </Col>
                <Col md="auto">
                  <Row>
                    <Col md="auto">
                      <Button size="sm" variant="outline-success">
                        <strong>4</strong> Attachments
                      </Button>
                    </Col>
                    <Col md="auto">
                      <Button size="sm" variant="outline-primary">
                        Contact the local business
                      </Button>
                    </Col>
                    <Col md="auto">
                      <Button size="sm" variant="success">
                        Choose the company
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </SectionWithContainer>
          <SectionWithContainer>
            <h2>Description</h2>
            <div dangerouslySetInnerHTML={{ __html: proposal.Description }} />
          </SectionWithContainer>
        </motion.div>
      </MainLayout>
    </>
  );
};

export default ProposalDetailPage;
