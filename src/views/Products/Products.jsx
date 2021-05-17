import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import PaperComponent from '../../modals/Papercomponent'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSnackbar } from 'notistack'

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button as MatButton,
  Input,
  FormGroup,
  Label,
} from "reactstrap"

import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import Button from '@material-ui/core/Button';

import { 
    ALL_CATEGORIES,
    ALL_SUBCATEGORIES,
    SUBCLASSES,
    PRODUCTS,
    COUNT,
    PRODUCT_ID,
    UPDATE_PRODUCT,
    DELETE_PRODUCT
} from './Query'

import Createmodal from './Createmodal'
import Editmodal from './Editmodal'
import { useLogin } from 'contexts/Auth';

function Tables(props) {

  const [ modal, setModal] = useState(false)
  const [ editModal, setEditModal] = useState(false);
  const [ categoryID, setCategoryID ] = useState("")
  const [ subcategoryID, setSubcategoryID ] = useState("")
  const [ subclassID, setSubclassID ] = useState("")
  const [ limit ] = useState(10)
  const [ page, setPage ] = useState(1)
  const [ deletingId, setDeletingId ] = useState("")
  const [ variant ] = useState('success')
  const [ productID, setProductID ] = useState("")
  const [ open, setOpen ] = useState(false)
  const [ token ] = useLogin()

  const { enqueueSnackbar } = useSnackbar()

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

  const { data: subcategories } = useQuery(ALL_SUBCATEGORIES, {
    variables: { categoryID }
  })

  const { data: id } = useQuery(PRODUCT_ID)

  const { data: categories } = useQuery(ALL_CATEGORIES)

  const { data: subclasses } = useQuery(SUBCLASSES, {
    variables: { categoryID, subcategoryID }
  })

  const { data: products } = useQuery(PRODUCTS, {
    variables: { categoryID, subcategoryID, subclassID, limit, page }
  })

  const { loading: countLoading, error: countError, data: countData } = useQuery(COUNT, {
    variables: { categoryID, subcategoryID, subclassID, limit }
  })

  const [ updateProduct, { loading: updateLoading, error: updateError } ] = useMutation(UPDATE_PRODUCT, {
    errorPolicy: "all",
    update: (cache, data) => {
      if(data) {
        setEditModal(!editModal)
        enqueueSnackbar('Product has successfully been updated', { variant })
      }
    }
  })

  const [ deleteProduct ] = useMutation(DELETE_PRODUCT, {
    errorPolicy: "all",
    update: (cache, data) => {
      if(data) {
        enqueueSnackbar('Product has successfully been deleted')
      }
    }
  })

  const toggle = () => {
    setModal(!modal)
  };

  const editToggle = (e) => {
    setProductID(e.target.id)
    setEditModal(!editModal)
  }

  const handlePage = (e, v) => {
    console.log(v)
    setPage(v)
  }

  const deletingProduct = (e) => {

    deleteProduct({
      variables: {
        productID: deletingId
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

return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Createmodal 
              classes={classes}
              toggle={toggle}
              className={className}
              modal={modal}
              setModal={setModal}
              enqueueSnackbar={enqueueSnackbar}
            />
            { updateLoading && <>updateLoading</> }
            { updateError && <>updateError</> }
            <Editmodal
              editModal={editModal}
              classes={classes}
              className={className}
              editToggle={editToggle}
              id={id}
              productID={productID}
              updateProduct={updateProduct}
            />
          </Col>
          <Col md="12">
            <Card className="card-plain">
              <FormGroup row>
                <Col sm={4}>
                  <Label>Category</Label>
                  <Input value={1} onChange={e => setCategoryID(e.target.value)} style={{"color": "white"}} type="select" name="select" id="exampleSelect">
                    <option value="Choose category" style={{"display": "none"}}>Choose category</option>
                    {
                      categories && categories.categories.map((e, i) => (
                        <option key={i} value={e.id}>{e.name}</option>
                      ))
                    }
                  </Input>
                </Col>
                <Col sm={4}>
                  <Label>Subcategory</Label>
                  <Input  onChange={e => setSubcategoryID(e.target.value)} style={{"color": "white"}} type="select" name="select" id="exampleSelect">
                    <option value style={{"display": "none"}}>Choose subcategory</option>
                    {
                      subcategories && subcategories.subcategories.map((e, i) => (
                        <option key={i} value={e.id}>{e.name}</option>
                      ))
                    }
                  </Input>
                </Col>
                <Col sm={4}>
                  <Label>Subclass</Label>
                  <Input onChange={e => setSubclassID(e.target.value)} style={{"color": "white"}} type="select" name="select" id="exampleSelect">
                    <option value style={{"display": "none"}}>Choose subclass</option>
                    {
                      subclasses && subclasses.subclasses.map((e, i) => (
                        <option key={i} value={e.id}>{e.name}</option>
                      ))
                    }
                  </Input>
                </Col>
              </FormGroup>
              <CardHeader>
                <CardTitle tag="h4">
                  Products table
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                        <th>#</th>
                        <th>Product name</th>
                        <th>Product amount</th>
                        <th>Edit product</th>
                        <th>Delete product</th>
                      </tr>
                    </thead>
                  {
                    products && products.products.map((e, i) => (
                      <tbody key={i}>
                          <tr>
                            <td>{i + 1}</td>
                            <td>{e.name}</td>
                            <td>1</td>
                            <td><MatButton id={e.id} onClick={e => editToggle(e)} color="info">EDIT</MatButton></td>
                            <td><MatButton id={e.id} onClick={e => handleClickOpen(e.target.id)} color="danger">DELETE</MatButton></td>
                          </tr>
                        </tbody>
                    ))
                  }
                  </Table>
                  { countLoading && <>countLoading</> }
                  { countError && <>countError</> }
                  {
                    countData && countData.countOfProducts > 1 && <Pagination className="text-white" onChange={(e, v) => handlePage(e, v)} count={countData.countOfProducts} color="secondary" size="large" />
                  }
              </CardBody>
            </Card>
            <MatButton color="primary" onClick={toggle}>Add new product</MatButton>
          </Col>
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
                <Button onClick={deletingProduct} color="primary">
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
        </Row>
      </div>
    </>
  );
}

export default Tables;
