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
  FormGroup,
  Label
} from "reactstrap"
import { useLogin } from 'contexts/Auth';

const ALL_CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
`
const ALL_SUBCATEGORIES = gql`
  query subcategories($categoryID: ID!) {
    subcategories(categoryID: $categoryID) {
      id
      name
    }
  }
`

const SUBCLASSES = gql`
  query subClass($categoryID: ID! $subcategoryID: ID!) {
    subClass(categoryID: $categoryID subcategoryID: $subcategoryID) {
      id
      name
    }
  }
`
const SUBSCRIPTION = gql`
  subscription subClass($categoryID: ID! $subcategoryID: ID!) {
    subClass(categoryID: $categoryID subcategoryID: $subcategoryID) {
      id
      name
    }
  }
`
const ADD_SUBCLASS = gql`
  mutation addSubclass($subclassName: String! $subcategoryID: ID! $categoryID: ID!) {
    addSubclass(subclassName: $subclassName subcategoryID: $subcategoryID categoryID: $categoryID)
  }
`
const DELETE_SUBCLASS = gql`
  mutation deleteSubclass($subclassID: ID!) {
    deleteSubclass(subclassID: $subclassID)
  }
`
function Tables(props) {

  const [ modal, setModal] = useState(false);
  const [ disabled, setDisabled ] = useState(false)
  const [ name, setName ] = useState("")
  const [ categoryID, setCategoryID ] = useState("")
  const [ subcategoryID, setSubcategoryID ] = useState("")
  const [ catID, setCatID ] = useState("")
  const [ subID, setSubID ] = useState("")
  const [ open, setOpen ] = useState(false)
  const [ deletingId, setDeletingId ] = useState("")
  const [ variant ] = useState('success')
  const [ token ] = useLogin()

  const {
    className
  } = props;

  const { enqueueSnackbar } = useSnackbar()

  const { data: subcategories } = useQuery(ALL_SUBCATEGORIES, {
    variables: { categoryID }
  })

  const { data: subData } = useQuery(ALL_SUBCATEGORIES, {
    variables: { categoryID: catID }
  })

  const { data: categories } = useQuery(ALL_CATEGORIES)
  const { data: allCategories } = useQuery(ALL_CATEGORIES)

  const { data: subclasses } = useQuery(SUBCLASSES, {
    variables: { categoryID, subcategoryID }
  })

  const [ add, { loading, error } ] = useMutation(ADD_SUBCLASS , {
    errorPolicy: "all",
    update: (cache, data) => {
      if(data) enqueueSnackbar('Subclass has successfully been added', { variant })
    }
  })

  const [ deleteSubclass, { error: deleteError } ] = useMutation(DELETE_SUBCLASS, {
    errorPolicy: "all",
    update: (cache, data) => {
      if(data) enqueueSnackbar('Subclass has successfully been deleted')
    }
  })

  
  useSubscription(SUBSCRIPTION, {
    variables: { categoryID, subcategoryID },
    onSubscriptionData: ({ client: { cache }, subscriptionData: {data}}) => {
      cache.modify({
        fields: {
          subClass: (subClass = []) => {
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
        subclassName: name,
        subcategoryID: subID,
        categoryID: catID
      }
    })

    setModal(!modal)
  }


  const deletingSubclass = (e) => {

    deleteSubclass({
      variables: {
        subclassID: deletingId
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

  if(deleteError) return <>deleteError</>
  if(loading) return <>loading</>

  if(!token) window.location.href = '/login'

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
          <Modal isOpen={modal} toggle={toggle} className={className}>
            <ModalHeader toggle={toggle}>Category title</ModalHeader>
            <ModalBody>
              <FormGroup row>
                <Col sm={12}> {
                    error && <>{error.message}</>
                  }
                  <Input onChange={e => setCatID(e.target.value)} style={{"color": "black", "height": "60px"}} type="select" name="select" id="exampleSelect">
                    <option value style={{"display": "none"}}>Choose category</option>
                    {
                      allCategories && allCategories.categories.map((e, i) => (
                        <option key={i} value={e.id}>{e.name}</option>
                      ))
                    }
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={12}>
                  <Input onChange={e => setSubID(e.target.value)} style={{"color": "black", "height": "60px"}} type="select" name="select" id="exampleSelect">
                    <option value style={{"display": "none"}}>Choose subcategory</option>
                    {
                      subData && subData.subcategories.map((e, i) => (
                        <option key={i} value={e.id}>{e.name}</option>
                      ))
                    }
                  </Input>
                </Col>
              </FormGroup>
              <Input placeholder="Subcategory name" onKeyUp={e => setName(e.target.value)} style={{"width": "100%", "height": "60px", "color": "black"}} type="text"/>
            </ModalBody>
            <ModalFooter>
              <MatButton disabled={disabled} style={{"margin": "0 auto", "marginTop": "50px", "marginBottom": "40px", "width": "90%"}} color="primary" onClick={toggleSubcategory}>Submit</MatButton>{' '}
            </ModalFooter>
          </Modal>
          </Col>
          <Col md="12">
            <Card className="card-plain">
              <FormGroup row>
                <Col sm={6}>
                  <Label>Category</Label>
                  <Input onChange={e => setCategoryID(e.target.value)} style={{"color": "white"}} type="select" name="select" id="exampleSelect">
                    <option value style={{"display": "none"}}>Choose category</option>
                    {
                      categories && categories.categories.map((e, i) => (
                        <option key={i} value={e.id}>{e.name}</option>
                      ))
                    }
                  </Input>
                </Col>
                <Col sm={6}>
                  <Label>Subcategory</Label>
                  <Input onChange={e => setSubcategoryID(e.target.value)} style={{"color": "white"}} type="select" name="select" id="exampleSelect">
                    <option value style={{"display": "none"}}>Choose subcategory</option>
                    {
                      subcategories && subcategories.subcategories.map((e, i) => (
                        <option key={i} value={e.id}>{e.name}</option>
                      ))
                    }
                  </Input>
                </Col>
              </FormGroup>
              <CardHeader>
                <CardTitle tag="h4">
                  Subclass table
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
                    subclasses && subclasses.subClass.map((e, i) => (
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
            <MatButton color="primary" onClick={toggle}>Add new subclass</MatButton>
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
                  Do you really want to delete this subclass
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">
                  No
                </Button>
                <Button onClick={deletingSubclass} color="primary">
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
