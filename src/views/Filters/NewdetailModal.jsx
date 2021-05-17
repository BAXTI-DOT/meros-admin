import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import {
    Button as MatButton,
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    Input
  } from "reactstrap"
import { NEW_DETAIL } from "./Query"
  
function NewdetailModal ({toggle3, modal3, className, setModal3, filterID, enqueueSnackbar }) {

    const [ name, setName ] = useState("")
    const [ disabled, setDisabled ] = useState(false)
    const [ variant ] = useState("success")

    const [ newFilter ] = useMutation(NEW_DETAIL, {
        update: (cache, data) => {
            enqueueSnackbar("Success detail create", { variant })
        }
    })

    useEffect(() => {
        name.length <= 0 ? setDisabled(true) : setDisabled(false)
    }, [ name ])

    const toggleSubcategory = () => {
        newFilter({
            variables: {
                title: name,
                filterID: filterID
            }
        })
      }

    return (
        <Modal isOpen={modal3} toggle={toggle3} className={className}>
            <ModalHeader toggle={toggle3}>Filter title</ModalHeader>
            <ModalBody>
              <Input placeholder="Filter name" onKeyUp={e => setName(e.target.value)} style={{"width": "100%", "height": "60px", "color": "black"}} type="text"/>
            </ModalBody>
            <ModalFooter>
              <MatButton disabled={disabled} style={{"margin": "0 auto", "marginTop": "50px", "marginBottom": "40px", "width": "90%"}} color="primary" onClick={() => {
                  toggleSubcategory()
                  setModal3(!modal3)
              }} > Submit</MatButton>{' '}
            </ModalFooter>
        </Modal>
    )
}

export default NewdetailModal