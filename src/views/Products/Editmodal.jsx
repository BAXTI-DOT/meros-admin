import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import axios from 'axios'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';

import { 
    ALL_CATEGORIES,
    ALL_SUBCATEGORIES,
    SUBCLASSES,
    EDIT_FILTERS,
    EDIT_PRODUCTS,
    PRODUCT_IMAGES
} from './Query'

import {
    Col,
    Button as MatButton,
    Modal, 
    ModalHeader, 
    ModalBody, 
    Input,
    FormGroup,
    Label,
    CustomInput,
    Form
  } from "reactstrap"

function Editmodal({ editModal, classes, className, editToggle, productID, updateProduct }) {

    const [ catID, setCatID ] = useState("")
    const [ subID, setSubID ] = useState("")
    const [ classID, setClassID ] = useState("")
    const [ selectedFile, setSelectedFile] = useState()
    const [ preview, setPreview] = useState()
    const [ productName, setProductName ] = useState("")
    const [ definition, setDefinition ] = useState("")
    const [ price, setProductPrice ] = useState(0)
    const [ amount, setAmount ] = useState(0)
    const [ sale, setSale ] = useState(0)
    const [ isnew, setIsNew ] = useState(false)
    const [ issale, setIsSale ] = useState(false)
    const [ isRecom, setIsRecom ] = useState(false)
    const [ isgift, setIsGift ] = useState(false)
    const [ isbest, setIsBest ] = useState(false)
    const [ filter, setFilter ] = useState([])
    const [ imgData, setImgData] = useState({})

    const { data: allCategories } = useQuery(ALL_CATEGORIES)

    const { data: subData } = useQuery(ALL_SUBCATEGORIES, {
        variables: { categoryID: catID }
    })

    const { data: editData } = useQuery(EDIT_PRODUCTS, {
        variables: { productID }
      })
    
    const { data: imageData } = useQuery(PRODUCT_IMAGES, {
        variables: { productID }
    })

    const { data: editFilters } = useQuery(EDIT_FILTERS, {
        variables: { productID }
    })

    console.log(editFilters)

    const { data: modalSubclass } = useQuery(SUBCLASSES, {
        variables: { categoryID: catID, subcategoryID: subID }
    })

    useEffect(() => {
        if(editData) {
          setIsNew(editData.editProducts.isNew)
          setIsSale(editData.editProducts.isSale)
          setIsRecom(editData.editProducts.isRecommended)
          setIsGift(editData.editProducts.isGift)
          setIsBest(editData.editProducts.isBest)
        }
      }, [editData])
    
      useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }
    
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)
    
        return () => URL.revokeObjectURL(objectUrl)
      }, [selectedFile])
    
      const onSelectFile = e => {
        console.log(e.target.files[0])
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
    
        let data = new FormData()
        let file = e.target.files[0]
    
        data.append("file", file)
    
        axios.post("http://localhost:4000/uploadFile", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if(response) {
            setImgData(response.data)
          }
        }, (error) => {
          console.log(error);
        });
    
        setSelectedFile(e.target.files[0])
      }
    
    const submitUpdate = e => {
      e.preventDefault()
    
      updateProduct({
        variables: {
          productID,
          categoryID: catID,
          subcategoryID: subID,
          subclassID: classID,
          name: productName,
          price: parseInt(price),
          isGift: isgift,
          isRecommended: isRecom,
          isNew: isnew,
          isBest: isbest,
          isSale: issale,
          sale: parseInt(sale),
          amount: parseInt(amount),
          definition: definition,
        }
      })

      if(filter) {
        axios.post('http://localhost:4000/updateFilter', {
          data: filter
        })
        .then((response) => {
          if(response) {
            
            return response
          }
        }, (error) => {
            console.log(error);
        });
      }
      
      axios.post('http://localhost:4000/updateImage', {
        data: imgData,
        imageID: imageData.getImage.id
      })
      .then((response) => {
        if(response) {
          
          return response
        }
      }, (error) => {
          console.log(error);
      });

    }

    return (
        <Modal isOpen={editModal} toggle={editToggle} className={className}>
            <ModalHeader toggle={editToggle}>New product</ModalHeader>
            <ModalBody>
              <Form onSubmit={(e) => submitUpdate(e)}>
                  <FormGroup>
                      <Label>Category</Label>
                      <Input onChange={e => setCatID(e.target.value)} style={{"color": "black", "height": "60px", "marginBottom": "10px"}} type="select" name="select" id="exampleSelect10">
                        {
                          editData && 
                          <option value hidden>{editData.editProducts.category.name}</option>
                        }
                        {
                          allCategories && allCategories.categories.map((e, i) => (
                            <option key={i} value={e.id}>{e.name}</option>
                          ))
                        }
                      </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label>Subcategory</Label>
                    <Input onChange={e => setSubID(e.target.value)} style={{"color": "black", "height": "60px", "marginBottom": "10px"}} type="select" name="select" id="exampleSelect5">
                      {
                        editData && 
                        <option value={editData.editProducts.subcategory.name} hidden>{editData.editProducts.subcategory.name}</option>
                      }
                      {
                        subData && subData.subcategories.map((e, i) => (
                          <option key={i} value={e.id}>{e.name}</option>
                        ))
                      }
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label>Subclass</Label>
                    <Input onChange={e => setClassID(e.target.value)} style={{"color": "black", "height": "60px", "marginBottom": "20px"}} type="select" name="select" id="exampleSelect6">
                      {
                        editData && 
                        <option  value={editData.editProducts.subclass.name} hidden>{editData.editProducts.subclass.name}</option>
                      }
                      {
                        modalSubclass && modalSubclass.subclasses.map((e, i) => (
                          <option key={i} value={e.id}>{e.name}</option>
                        ))
                      }
                    </Input>
                  </FormGroup>
                      <Label>Product name</Label>
                      {
                        editData &&
                        <Input defaultValue={editData.editProducts.name} onKeyUp={e => setProductName(e.target.value)} placeholder="Product name" type="text" style={{"color": "black"}} name="select" />
                      }
                      <Label>Product price</Label>
                      {
                        editData &&
                        <Input defaultValue={editData.editProducts.price} maxLength="6" onKeyUp={e => setProductPrice(e.target.value)} placeholder="100 000" type="number" style={{"color": "black"}} name="select" />
                      }
                      <Label>Product sale</Label>
                      {
                        editData &&
                        <Input defaultValue={editData.editProducts.sale} maxLength="2" onKeyUp={e => setSale(e.target.value)} placeholder="50%" type="number" style={{"color": "black"}} name="select" />
                      }
                      <Label>Product amount</Label>
                      {
                        editData &&
                        <Input defaultValue={editData.editProducts.amount} onKeyUp={e => setAmount(e.target.value)} placeholder="10 or more" type="number" style={{"color": "black"}} name="select" />
                      }
                      <Label>Product definition</Label>
                      {
                        editData &&
                        <Input defaultValue={editData.editProducts.definition} maxLength="256" onKeyUp={e => setDefinition(e.target.value)} placeholder="Definition" type="textarea" style={{"color": "black"}} name="text" id="exampleText" />
                      }
                      {
                        editData &&
                        <Col sm={12} style={{"marginTop": "20px"}}>
                          <CustomInput checked={isnew} onChange={e => setIsNew(isnew === false ? true: false)} type="checkbox" id="exampleCustomInline" label="New product" inline />
                          <CustomInput checked={isbest} type="checkbox" onChange={e => setIsBest(isbest === false ? true: false)} id="exampleCustomInline2" label="Best product" inline />
                          <CustomInput checked={issale} type="checkbox" onChange={e => setIsSale(issale === false ? true: false)} id="exampleCustomInline3" label="Sale product" inline />
                          <CustomInput checked={isRecom} type="checkbox" onChange={e => setIsRecom(isRecom === false ? true: false)} id="exampleCustomInline4" label="Recommended product" inline />
                          <CustomInput checked={isgift} type="checkbox" onChange={e => setIsGift(isgift === false ? true: false)} id="exampleCustomInline5" label="Gift product" inline />
                        </Col>
                      }
                      {
                        editFilters && editFilters.editFilters.map((e, i) => (
                          <Col key={i} sm={12}>
                            <Label>{e.name}</Label>
                              <Input 
                                key={i} 
                                onChange={m => setFilter([...filter, { filterID:  m.target.value, filteredID: e.oldDetail.filteredID }])} 
                                style={{"color": "black", "height": "60px", "marginBottom": "1px"}} 
                                type="select" 
                                name="select" 
                               >
                                  <option key={i} value>{e.oldDetail.name}</option>
                                {
                                  e && e.detail.map((e, i) => (
                                    <option key={i} value={e.id}>{e.name}</option>
                                    )) 
                                }
                              </Input>
                          </Col>
                        ))
                      }
                    <Label>Upload image</Label>
                    {
                      imageData &&
                    <Col sm={12}>
                        {selectedFile &&  <img src={preview} alt="" /> }
                        {!selectedFile &&  <img src={imageData.getImage.url} alt="" /> }
                        <input
                          accept="image/*"
                          className={classes.input}
                          id="contained-button-file"
                          multiple
                          type="file"
                          onChange={onSelectFile}
                        />
                        <label style={{"width": "100%"}} htmlFor="contained-button-file">
                          <Button variant="contained" color="default" component="span" className={classes.button} startIcon={<CloudUploadIcon />}>
                           { preview ? "File ready" : "Choose to update"}
                          </Button>
                        </label>
                    </Col>
                    }
                <MatButton type="submit" style={{"margin": "0 auto", "marginTop": "50px", "marginBottom": "40px", "width": "100%"}} color="primary">Submit</MatButton>{' '}
              </Form>
            </ModalBody>
          </Modal>
    )
}

export default Editmodal