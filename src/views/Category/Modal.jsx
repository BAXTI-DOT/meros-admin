import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'

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

import { BY_CATEGORY_ID, UPDATE_CATEGORY } from './Query'

function CategoryModal ({ modal, setModal, toggle, className, enqueueSnackbar, variant, categoryID }) {

    const [ category, setCategory ] = useState("")
    const [ disabled ] = useState(false)
    const [ isNavbar, setIsNavbar ] = useState(false)
    const [ isPopular, setIsPopular ] = useState(false)

    const { data, loading, error } = useQuery(BY_CATEGORY_ID, {
      variables: { categoryID }
    })

    const [ update, { error: updateError } ] = useMutation(UPDATE_CATEGORY, {
      update: (cache, data) => {
        if(data) enqueueSnackbar('Category has successfully been updated', { variant })
      }
    })

    useEffect(() => {
      if(data) {
        setIsNavbar(data.byCategoryID.isNavbar)
        setIsPopular(data.byCategoryID.isPopular)
      }
    }, [data])

    const toggleCategory = e => {

        const categoryName = category
    
        update({
          variables: {
            categoryID,
            categoryName,
            isNavbar,
            isPopular
          }
        })
    
        setModal(!modal)
        setCategory("")
        e.target.value = ""
     }

    return (
        <>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}>Category title</ModalHeader>
                <ModalBody>
                    { loading && <>loading</>}
                    { error && <>error</>}
                    {
                      data &&
                      <Input defaultValue={data.byCategoryID.name} onKeyUp={e => setCategory(e.target.value)} style={{"width": "100%", "height": "60px", "color": "black"}} type="text"/>
                    }
                    { updateError && <>updateError</>}
                    {
                      data &&
                      <Col style={{marginTop: "30px"}} sm={12}>
                          <CustomInput checked={isNavbar} onChange={() => setIsNavbar(isNavbar === false ? true: false)} type="checkbox" id="exampleCustomInline1" label="Navbar" inline />{ ' ' }
                          <CustomInput checked={isPopular} onChange={() => setIsPopular(isPopular === false ? true: false)} type="checkbox" id="exampleCustomInline2" label="Popular" inline />{' '}
                      </Col>
                    }
                </ModalBody>
                <ModalFooter>
                <MatButton disabled={disabled} style={{"margin": "0 auto", "marginTop": "70px", "marginBottom": "40px", "width": "90%"}} color="primary" onClick={e => toggleCategory(e)}>Submit</MatButton>{' '}
                </ModalFooter>
            </Modal>
        </>
    )
}

export default CategoryModal