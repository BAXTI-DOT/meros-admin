import { useEffect, useState } from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import { useSnackbar } from 'notistack'
import Categorymodal from './Modal'
import Addcategory from './CreateModal'
import Papercomponent from '../../modals/Papercomponent'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useLogin } from 'contexts/Auth'

import {
    ALL_CATEGORIES,
    SUBSCRIPTION,
    DELETE_CATEGORY
} from './Query'

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button as MatButton
} from "reactstrap";


function Tables(props) {

  const [ modal, setModal] = useState(false);
  const [ modal2, setModal2] = useState(false)
  const [ categoryID, setCategoryID ] = useState("")
  const [ variant ] = useState('success')
  const [ open, setOpen ] = useState(false);
  const [ deleteingId, setDeletingId ] = useState('')
  const [ token ] = useLogin()

  useEffect(() => {
    if(!token) window.location.href = '/login'
  }, [token])

  const { enqueueSnackbar } = useSnackbar()

  const {
    className
  } = props;
  
  const { data } = useQuery(ALL_CATEGORIES)

  const [ deletedCategory ] = useMutation(DELETE_CATEGORY, {
    update: (cache, data) => {
      if(data) enqueueSnackbar('Category has successfully been deleted')
    }
  })


  useSubscription(SUBSCRIPTION, {
      onSubscriptionData: ({ client: { cache }, subscriptionData: {data} }) => {
        cache.modify({
          fields: {
            categories: (categories = []) => {
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

  const toggle = (e) => {
    setCategoryID(e.target.id)
    setModal(!modal)
  };

  const toggle2 = () => {
    setModal2(!modal2)
  };

  const handleClickOpen = (e) => {
    setDeletingId(e)

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteCategory = (e) => {

    deletedCategory({
      variables: {
        categoryID: deleteingId
      }
    })

    setOpen(false);

  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Categorymodal
              toggle={toggle} 
              modal={modal} 
              setModal={setModal}
              className={className}
              enqueueSnackbar={enqueueSnackbar}
              variant={variant}
              categoryID={categoryID}
            />
            <Addcategory 
              toggle2={toggle2}
              modal2={modal2}
              setModal2={setModal2}
              enqueueSnackbar={enqueueSnackbar}
            />
          </Col>
          <Col md="12">
            <Card className="card-plain">
              <CardHeader>
                <CardTitle tag="h4">
                  Category Table
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>EDIT</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                  {
                    data && data.categories.map((e, i) => (
                      <tbody key={i}>
                          <tr>
                            <td>{i + 1}</td>
                            <td>{e.name}</td>
                            <td><MatButton id={e.id} onClick={e => toggle(e)} color="info">EDIT</MatButton></td>
                            <td><MatButton id={e.id} onClick={e => handleClickOpen(e.target.id)} color="danger">DELETE</MatButton></td>
                          </tr>
                        </tbody>
                    ))
                  }
                </Table>
              </CardBody>
            </Card>
            <MatButton onClick={toggle2} color="primary">Add new category</MatButton>
          </Col>
          <Col style={{"marginTop": "100px"}} md="12">
            <Dialog
              open={open}
              onClose={handleClose}
              PaperComponent={Papercomponent}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Subscribe
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Do you really want to delete this category
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">
                  No
                </Button>
                <Button onClick={deleteCategory} color="primary">
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Tables;
