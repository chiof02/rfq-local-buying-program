import { GetStaticProps } from 'next';
import ErrorPage from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import { FC, useMemo, useState } from 'react';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';

import { motion } from 'framer-motion';
import moment from 'moment';
import { $enum } from 'ts-enum-util';
import renderCommonMetaTags from 'utils/renderCommonMetaTags';
import request from 'utils/request';

import SectionWithContainer from 'components/SectionWithContainer/SectionWithContainer';
import TenderDetailCard from 'components/TenderDetailCard/TenderDetailCard';
import { ITender } from 'models/ITender';

import MainLayout from '../../layouts/MainLayout';

interface IProps {
  statusCode?: number;
  host: string;
  tenders: ITender[];
}

enum TenderState {
  closed = 'Closed',
  active = 'Active',
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const { data: tenders } = await request.get<ITender[]>('/tenders');
    return {
      props: {
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

const MyTendersPage: FC<IProps> = ({
  tenders,
  statusCode = null,
  host = '',
}) => {
  const [tenderFilter, setTenderFilter] = useState<TenderState>();
  const filteredTender = useMemo(() => {
    switch (tenderFilter) {
      case TenderState.closed:
        return tenders.filter(tender => {
          return moment().startOf('day').isAfter(moment(tender.ClosingAt));
        });
      case TenderState.active:
        return tenders.filter(tender => {
          return moment()
            .startOf('day')
            .isSameOrBefore(moment(tender.ClosingAt));
        });
      default:
        return tenders;
    }
  }, [tenderFilter, tenders]);

  if (statusCode) {
    return <ErrorPage statusCode={statusCode} />;
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
          <SectionWithContainer>
            <Row className="justify-content-between">
              <Col md="auto">
                <h1 className="mb-3">My Tenders</h1>
              </Col>
              <Col md="auto">
                <ButtonGroup size="sm">
                  <Button
                    onClick={() => setTenderFilter(undefined)}
                    variant={
                      tenderFilter === undefined ? undefined : 'outline-primary'
                    }
                  >
                    All
                  </Button>
                  {$enum(TenderState).map(value => (
                    <Button
                      onClick={() => setTenderFilter(value)}
                      key={value}
                      variant={
                        value === tenderFilter ? 'primary' : 'outline-primary'
                      }
                    >
                      {value}
                    </Button>
                  ))}
                </ButtonGroup>
              </Col>
            </Row>
            <Row>
              {filteredTender.map((tender: ITender) => (
                <Col key={tender.ID} md={3} className="mb-3">
                  <Link href={`/tenders/${tender.ID}`} passHref>
                    <Button
                      variant="link"
                      className="p-0 text-dark text-left radius-0"
                      as="a"
                    >
                      <TenderDetailCard tender={tender} />
                    </Button>
                  </Link>
                </Col>
              ))}
            </Row>
          </SectionWithContainer>
        </motion.div>
      </MainLayout>
    </>
  );
};

export default MyTendersPage;
