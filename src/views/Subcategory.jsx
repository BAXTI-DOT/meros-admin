import { useEffect, useState } from 'react'
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client'
import { useSnackbar } from 'notistack'
import PaperComponent from '../modals/Papercomponent'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useLogin } from 'contexts/Auth'

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button as MatButton,
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Input,
  FormGroup
} from "reactstrap";

const ALL_CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
`
const ALL_SUBCATEGORIES = gql`
  query categoryID($categoryID: ID!) {
    subcategory(categoryID: $categoryID) {
      id
      name
    }
  }
`

const SUBSCRIPTION = gql`
  subscription subcategory($categoryID: ID!) {
    subcategory(categoryID: $categoryID) {
      id
      name
    }
  }
`

const ADD_SUBCATEGORY = gql`
  mutation addSubcategory($subcategoryName: String! $categoryID: ID!) {
    addSubcategory(subcategoryName: $subcategoryName categoryID: $categoryID)
  }
`

const DELETE_SUBCATEGORY = gql`
  mutation deleteSubcategory($subcategoryID: ID!) {
    deleteSubcategory(subcategoryID: $subcategoryID)
  }
`

function Tables(props) {

  const {
    className
  } = props;

  const { enqueueSnackbar } = useSnackbar()

  const [ modal, setModal] = useState(false);
  const [ name, setName ] = useState("")
  const [ disabled, setDisabled ] = useState(false)
  const [ catID2, setCatID2 ] = useState("")
  const [ catID, setCatID ] = useState("")
  const [ open, setOpen ] = useState(false)
  const [ deletingId, setDeletingId ] = useState("")
  const [ variant ] = useState('success')

  const [ token ] = useLogin()

  const { data } = useQuery(ALL_SUBCATEGORIES, {
    variables: { categoryID: catID }
  })

  const { data: categories } = useQuery(ALL_CATEGORIES)

  const [ add ] = useMutation(ADD_SUBCATEGORY , {
    errorPolicy: "all",
    update: (cache, data) => {
      if(data) enqueueSnackbar('Subcategory has successfully been added', { variant })
    }
  })

  const [ deleteSubcategory ] = useMutation(DELETE_SUBCATEGORY, {
    errorPolicy: "all",
    update: (cache, data) => {
      if(data) enqueueSnackbar('Subcategory has successfully been deleted')
    }
  })

  useSubscription(SUBSCRIPTION, {
    variables: { categoryID: catID },
    onSubscriptionData: ({ client: { cache }, subscriptionData: {data}}) => {
      cache.modify({
        fields: {
          subcategory: (subcategory = []) => {
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
    name.length <= 0 ? setDisabled(true) : setDisabled(false)
  }, [ name ])


  const toggle = () => {
    setModal(!modal)
  };

  const toggleSubcategory = () => {

    add({
      variables: {
        subcategoryName: name,
        categoryID: catID2
      }
    })

    setModal(!modal)
  }

  const deletingSubcategory = (e) => {

    deleteSubcategory({
      variables: {
        subcategoryID: deletingId
      }
    })

    setOpen(false);
  }

  const handleClickOpen = (e) => {

    setDeletingId(e)

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
		if(!token) {
			window.location.href = '/login'
		}
	}, [token])

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
          <Modal isOpen={modal} toggle={toggle} className={className}>
            <ModalHeader toggle={toggle}>Category title</ModalHeader>
            <ModalBody>
            <FormGroup row>
                <Col sm={12}>
                  <Input onChange={e => setCatID2(e.target.value)} style={{"color": "black", "height": "60px"}} type="select" name="select" id="exampleSelect">
                    <option value style={{"display": "none"}}>Choose category</option>
                    {
                      categories && categories.categories.map((e, i) => (
                        <option key={i} value={e.id}>{e.name}</option>
                      ))
                    }
                  </Input>
                </Col>
              </FormGroup>
            <Input placeholder="Subcategory name" onKeyUp={e => setName(e.target.value)} style={{"width": "100%", "height": "60px", "marginTop": "50px", "color": "black"}} type="text"/>
            </ModalBody>
            <ModalFooter>
              <MatButton disabled={disabled} style={{"margin": "0 auto", "marginTop": "50px", "marginBottom": "40px", "width": "90%"}} color="primary" onClick={toggleSubcategory}>Submit</MatButton>{' '}
            </ModalFooter>
          </Modal>
          </Col>
          <Col md="12">
            <Card className="card-plain">
              <FormGroup row>
                <Col sm={12}>
                  <Input onChange={e => setCatID(e.target.value)} style={{"color": "white"}} type="select" name="select" id="exampleSelect">
                    <option value style={{"display": "none"}}>Choose category</option>
                    {
                      categories && categories.categories.map((e, i) => (
                        <option key={i} value={e.id}>{e.name}</option>
                      ))
                    }
                  </Input>
                </Col>
              </FormGroup>
              <CardHeader>
                <CardTitle tag="h4">
                  Subcategory table
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                      <thead className="text-primary">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                  {
                    data && data.subcategory.map((e, i) => (
                      <tbody key={i}>
                          <tr>
                            <td>{i + 1}</td>
                            <td>{e.name}</td>
                            <td><MatButton id={e.id} onClick={e => handleClickOpen(e.target.id)} color="danger">DELETE</MatButton></td>
                          </tr>
                        </tbody>
                    ))
                  }
                </Table>
              </CardBody>
            </Card>
            <MatButton color="primary" onClick={toggle}>Add new subcategory</MatButton>
            <Dialog
              open={open}
              onClose={handleClose}
              PaperComponent={PaperComponent}
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
                <Button onClick={deletingSubcategory} color="primary">
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
