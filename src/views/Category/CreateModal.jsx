import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'

import {
    Button as MatButton,
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    Input,
    CustomInput,
    Col
  } from "reactstrap";

import { ADD_CATEGORY } from './Query'

function CategoryModal ({ modal2, setModal2, toggle2, className, enqueueSnackbar, variant }) {

    const [ category, setCategory ] = useState("")
    const [ disabled, setDisabled ] = useState(false)
    const [ isNavbar, setIsNavbar ] = useState(false)
    const [ isPopular, setIsPopular ] = useState(false)

    const [ add ] = useMutation(ADD_CATEGORY, {
        update: (cache, data) => {
          if(data) enqueueSnackbar('Category has successfully been added', { variant })
        }
    })

    useEffect(() => {
      category.length <= 0 ? setDisabled(true) : setDisabled(false)
    }, [ category ])

    const toggleCategory = e => {

        const categoryName = category
    
        add({
          variables: {
            categoryName,
            isNavbar,
            isPopular
          }
        })

        setModal2(!modal2)
        setCategory("")
    }

    return (
        <>
            <Modal isOpen={modal2} toggle={toggle2} className={className}>
                <ModalHeader toggle={toggle2}>Category title</ModalHeader>
                <ModalBody>
                    <Input onKeyUp={e => setCategory(e.target.value)} style={{"width": "100%", "height": "60px", "color": "black"}} type="text"/>
                    <Col style={{marginTop: "30px"}} sm={12}>
                        <CustomInput type="checkbox" onChange={e => setIsNavbar(isNavbar === false ? true: false)} id="exampleCustomInline1" label="Navbar" inline />
                        <CustomInput type="checkbox" onChange={e => setIsPopular(isPopular === false ? true: false)} id="exampleCustomInline2" label="Popular" inline />
                    </Col>
                </ModalBody>
                <ModalFooter>
                <MatButton disabled={disabled} style={{"margin": "0 auto", "marginTop": "70px", "marginBottom": "40px", "width": "90%"}} color="primary" onClick={e => toggleCategory(e)}>Submit</MatButton>{' '}
                </ModalFooter>
            </Modal>
        </>
    )
}

export default CategoryModal