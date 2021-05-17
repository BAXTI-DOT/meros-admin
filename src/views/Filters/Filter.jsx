import { useEffect, useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import PaperComponent from '../../modals/Papercomponent'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FilterModal from './Modal'
import NewdetailModal from './NewdetailModal'
import DetailModal from './DetailModal'

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button as MatButton,
  FormGroup,
  Label,
  Input
} from "reactstrap"

import { useLogin } from 'contexts/Auth';
import { DELETE_FILTER } from './Query';

const ALL_SUBCATEGORIES = gql`
  query subcategory($categoryID: ID!) {
    subcategory(categoryID: $categoryID) {
      id
      name
    }
  }
`
const FILTERS = gql`
    query filters($subcategoryID: ID!) {
        filters(subcategoryID: $subcategoryID) {
            id
            name
        }
    }
`
function Filter(props) {

  const [ modal, setModal] = useState(false);
  const [ modal2, setModal2] = useState(false);
  const [ modal3, setModal3] = useState(false);
  const [ categoryID ] = useState("")
  const [ subcategoryID, setSubcategoryID ] = useState("")
  const [ open, setOpen ] = useState(false)
  const [ deletingId, setDeletingId ] = useState("")
  const [ variant ] = useState("success")
  const [ filterID, setFilterID ] = useState("")
  const [ token ] = useLogin()

  const {
    className
  } = props;

  const { enqueueSnackbar } = useSnackbar()

  const { data: subcategories } = useQuery(ALL_SUBCATEGORIES, {
    variables: { categoryID }
  })

  const { data: subData } = useQuery(ALL_SUBCATEGORIES, {
    variables: { categoryID }
  })

  const { data: filters } = useQuery(FILTERS, {
      variables: { subcategoryID }
  })

  const [ deleteFilter ] = useMutation(DELETE_FILTER, {
      update: (cache, data) => {
          if(data) enqueueSnackbar("Filter deleted", { variant })
      }
  })
      
  const toggle = () => {
    setModal(!modal)
  };

  const toggle2 = () => {
    setModal2(!modal2)
  };

  const toggle3 = () => {
    setModal3(!modal3)
  };

  const deletingFilter = (e) => {

    deleteFilter({
      variables: {
        filterID: deletingId
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
            <FilterModal
                modal={modal}
                toggle={toggle}
                className={className}
                subData={subData}
                setModal={setModal}
                enqueueSnackbar={enqueueSnackbar}
            />
            <DetailModal
                modal2={modal2}
                toggle2={toggle2}
                className={className}
                subData={subData}
                setModal2={setModal2}
                filterID={filterID}
                enqueueSnackbar={enqueueSnackbar}
            />
            <NewdetailModal
                setModal3={setModal3}
                modal3={modal3}
                toggle3={toggle3}
                className={className}
                filterID={filterID}
                enqueueSnackbar={enqueueSnackbar}
            />
          </Col>
          <Col md="12">
            <Card className="card-plain">
              <FormGroup row>
                <Col sm={12}>
                  <Label>Subcategory</Label>
                  <Input onChange={e => setSubcategoryID(e.target.value)} style={{"color": "white"}} type="select" name="select" id="exampleSelect">
                    <option value style={{"display": "none"}}>Choose subcategory</option>
                        {
                            subcategories && subcategories.subcategory.map((e, i) => (
                                <option key={i} value={e.id}>{e.name}</option>
                            ))
                        }
                  </Input>
                </Col>
              </FormGroup>
              <CardHeader>
                <CardTitle tag="h4">
                  Filters table
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Details</th>
                        <th>New detail</th>
                        <th>Delete</th>
                        </tr>
                    </thead>
                    {
                        filters && filters.filters.map((e, i) => (
                        <tbody key={i}>
                            <tr>
                                <td>{i + 1}</td>
                                <td>{e.name}</td>
                                <td><MatButton id={e.id} onClick={() => {
                                    toggle2()
                                    setFilterID(e.id)
                                }} color="info">Details</MatButton></td>
                                <td><MatButton id={e.id} onClick={toggle3} color="success">New detail</MatButton></td>
                                <td><MatButton id={e.id} onClick={() => handleClickOpen(e.id)} color="danger">DELETE</MatButton></td>
                            </tr>
                            </tbody>
                        ))
                    }
                </Table>
              </CardBody>
            </Card>
            <MatButton color="primary" onClick={toggle}>Add new filter</MatButton>
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
                <Button onClick={deletingFilter} color="primary">
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

export default Filter;
