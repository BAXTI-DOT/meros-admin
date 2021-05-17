import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import {
    Button as MatButton,
    Modal, 
    ModalHeader, 
    ModalBody, 
    Col,
    FormGroup,
    ModalFooter,
    Input
  } from "reactstrap"
import { NEW_FILTER } from "./Query"
  
function FilterModal ({toggle, modal, className, setModal, subData }) {

    const [ name, setName ] = useState("")
    const [ subID, setSubID ] = useState("")
    const [ disabled, setDisabled ] = useState(false)

    const [ newFilter ] = useMutation(NEW_FILTER, {
        update: (cache, data) => {
            console.log(data)
        }
    })

    useEffect(() => {
        name.length <= 0 ? setDisabled(true) : setDisabled(false)
    }, [ name ])

    const toggleSubcategory = () => {

        newFilter({
            variables: {
                title: name,
                subcategoryID: subID
            }
        })

        setModal(!modal)
      }

    return (
        <Modal isOpen={modal} toggle={toggle} className={className}>
            <ModalHeader toggle={toggle}>Category title</ModalHeader>
            <ModalBody>
              <FormGroup row>
                <Col sm={12}>
                  <Input onChange={e => setSubID(e.target.value)} style={{"color": "black", "height": "60px"}} type="select" name="select" id="exampleSelect">
                    <option value style={{"display": "none"}}>Choose subcategory</option>
                    {
                      subData && subData.subcategory.map((e, i) => (
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
    )
}

export default FilterModal