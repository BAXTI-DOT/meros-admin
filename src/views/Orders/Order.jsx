import { useEffect, useState } from 'react'
import { useQuery, useSubscription } from '@apollo/client'
import Chip from '@material-ui/core/Chip';
import moment from 'moment'
import 'moment/locale/uz-latn'

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button as MatButton,
} from "reactstrap"

import { makeStyles } from '@material-ui/core/styles';
// import Pagination from '@material-ui/lab/Pagination';
// import Button from '@material-ui/core/Button';

import OrderModal from './Modal'
import { useLogin } from 'contexts/Auth';
import { ORDERS, SUBSCRIPTION } from './Query';

function Order(props) {

  const [ modal, setModal] = useState(false)
  // const [ limit ] = useState(10)
  // const [ page, setPage ] = useState(1)
  const [ orderID, setOrderID ] = useState("")
  const [ token ] = useLogin()

  const { data } = useQuery(ORDERS)

  useSubscription(SUBSCRIPTION, {
    onSubscriptionData: ({ client: { cache }, subscriptionData: {data} }) => {
      cache.modify({
        fields: {
          getOrder: (getOrder = []) => {
            // const newClassifiedRef = cache.writeFragment({
            // 	data: data.newClassified,
            // 	fragment: gql `
            // 		fragment NewClassified on Classified {
            // 			id
            // 			type
            // 		}
            // 	`
            // })
          }
        }
      })
    },
  })

  useEffect(() => {
    if(!token) window.location.href = '/login'
  }, [token])

  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: 'none',
    },
  }));

  const classes = useStyles();

  const {
    className
  } = props

    const toggle = (orderID) => {
      setModal(!modal)
    };
    
    const orderHandler = (orderID) => {
        if(orderID) {
            setOrderID(orderID)
        }
    }

  // const handlePage = (e, v) => {
  //   console.log(v)
  //   setPage(v)
  // }

return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <OrderModal 
              classes={classes}
              toggle={toggle}
              className={className}
              modal={modal}
              orderID={orderID}
              setModal={setModal}
            />
          </Col>
          <Col md="12">
            <Card className="card-plain">
              <CardHeader>
                <CardTitle tag="h4">
                  Orders table
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                        <tr>
                            <th>#</th>
                            <th>Order number</th>
                            <th>Order status</th>
                            <th>Ordered at</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                        {
                            data && data.getOrder.map((e, i) => (
                                <tbody key={i}>
                                    <tr>
                                        <td>{i + 1}</td>
                                        <td>M{e.orderNumber}</td>
                                        <td><Chip color={e.orderStatus ? "primary" : "secondary"} label={e.orderStatus ? "RECEIVED" : "UNRECEIVED"} /></td>
                                        <td>{moment(e.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                        <td><MatButton color="secondary" onClick={() => {
                                            toggle()
                                            orderHandler(e.id)
                                        }}>DETAILS</MatButton></td>
                                    </tr>
                                </tbody>
                            ))
                        }
                  </Table>
                  {/* {
                    countData && countData.countOfProducts > 1 && <Pagination className="text-white" onChange={(e, v) => handlePage(e, v)} count={countData.countOfProducts} color="secondary" size="large" />
                  } */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Order;
