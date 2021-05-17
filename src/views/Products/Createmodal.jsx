import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { storage } from '../../firebase'
import { v4 as uuidv4 } from 'uuid';
import { useLogin } from 'contexts/Auth'

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

  import { 
    ALL_CATEGORIES,
    ALL_SUBCATEGORIES,
    SUBCLASSES,
	FILTERS
} from './Query'

import axios from 'axios'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Button from '@material-ui/core/Button';

function Createmodal ({ classes, toggle, className, modal, setModal, enqueueSnackbar }) {

  const [ disabled, setDisabled ] = useState(false)
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
  const [ imgData, setImgData] = useState("")
  const [ variant ] = useState("success")
  const [ errorVariant ] = useState("danger")
  const [ token ] = useLogin()

  const { data: allCategories } = useQuery(ALL_CATEGORIES)

  const { data: subData } = useQuery(ALL_SUBCATEGORIES, {
    variables: { categoryID: catID }
  })

  const { data: modalSubclass } = useQuery(SUBCLASSES, {
    variables: { categoryID: catID, subcategoryID: subID }
  })

  const { data: filters } = useQuery(FILTERS, {
    variables: { subcategoryID: subID }
  })

  useEffect(() => {
    catID.length <= 0 || subID.length <= 0 || classID.length <= 0 
    || productName.length <= 0  || price <= 0 || definition.length <= 0 
    || !preview || !imgData || !selectedFile || filter.length === 0 || amount <= 0 ? setDisabled(true) : setDisabled(false)
  }, [ 
      catID,
      subID,
      classID,
      productName,
      price,
      definition,
      preview,
      amount,
      imgData,
      selectedFile,
      filter
  ])

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
      if (!e.target.files || e.target.files.length === 0) {
          setSelectedFile(undefined)
      }

      setSelectedFile(e.target.files[0])

      const readyFile = e.target.files[0]

      const newImageID = uuidv4()

      if(readyFile) {
          const uploadFire = storage.ref(`images/${newImageID}`).put(readyFile)
          uploadFire.on(
              "state has been changed",
              snapshot => {},
              error => {
                  console.log(error)
              },
              () => {
                  storage
                    .ref("images")
                    .child(newImageID)
                    .getDownloadURL()
                    .then(url => {
                        console.log(url)
                        setImgData(url)
                    })
              }
          )
        }
    }
    
    const submitForm = (e) => {
        e.preventDefault()

        axios.post('https://meros-master.herokuapp.com/new-product', {
            data: {
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
            },
            image: {
                url: imgData
            },
            filter
        })
        .then((response) => {
            if(response) {
                setModal(!modal)
                enqueueSnackbar("Product has successfullly been created", { variant })
            }
        }, (error) => {
            enqueueSnackbar("Error while creating product", { variant: errorVariant})
        })
    }

    useEffect(() => {
		if(!token) {
			window.location.href = '/login'
		}
	}, [token])

    return (
        <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>New product</ModalHeader>
            <ModalBody>
                <Form onSubmit={(e) => submitForm(e)}>
                    <FormGroup>
                        <Label>Category</Label>
                        <Input onChange={e => setCatID(e.target.value)} style={{"color": "black", "height": "60px", "marginBottom": "10px"}} type="select" name="select" id="exampleSelect">
                        <option value style={{"display": "none"}}>Choose category</option>
                        {
                            allCategories && allCategories.categories.map((e, i) => (
                            	<option key={i} value={e.id}>{e.name}</option>
                            ))
                        }
                        </Input>
                    </FormGroup>
                    <FormGroup>
                    <Label>Subcategory</Label>
                    <Input onChange={e => setSubID(e.target.value)} style={{"color": "black", "height": "60px", "marginBottom": "10px"}} type="select" name="select" id="exampleSelect1">
                        <option value style={{"display": "none"}}>Choose subcategory</option>
                        {
                            subData && subData.subcategories.map((e, i) => (
                            	<option key={i} value={e.id}>{e.name}</option>
                            ))
                        }
                    </Input>
                    </FormGroup>
                    <FormGroup>
                    <Label>Subclass</Label>
                    <Input onChange={e => setClassID(e.target.value)} style={{"color": "black", "height": "60px", "marginBottom": "20px"}} type="select" name="select" id="exampleSelect2">
                        <option value style={{"display": "none"}}>Choose subclass</option>
                        {
                            modalSubclass && modalSubclass.subclasses.map((e, i) => (
                                <option key={i} value={e.id}>{e.name}</option>
                            ))
                        }
                    </Input>
                    </FormGroup>
                        <Label>Product name</Label>
                        <Input onKeyUp={e => setProductName(e.target.value)} placeholder="Product name" type="text" style={{"color": "black"}} name="select" />
                        <Label>Product price</Label>
                        <Input maxLength="6" onKeyUp={e => setProductPrice(e.target.value)} placeholder="100 000" type="number" style={{"color": "black"}} name="select" />
                        <Label>Product sale</Label>
                        <Input maxLength="2" onKeyUp={e => setSale(e.target.value)} placeholder="50%" type="number" style={{"color": "black"}} name="select" />
                        <Label>Product amount</Label>
                        <Input onKeyUp={e => setAmount(e.target.value)} placeholder="10 or more" type="number" style={{"color": "black"}} name="select" />
                        <Label>Product definition</Label>
                        <Input maxLength="256" onKeyUp={e => setDefinition(e.target.value)} placeholder="Definition" type="textarea" style={{"color": "black"}} name="text" id="exampleText" />
                    <Col sm={12} style={{"marginTop": "20px"}}>
                        <CustomInput checked={isnew} onChange={e => setIsNew(isnew === false ? true: false)} type="checkbox" id="exampleCustomInline" label="New product" inline />
                        <CustomInput type="checkbox" onChange={e => setIsBest(isbest === false ? true: false)} id="exampleCustomInline2" label="Best product" inline />
                        <CustomInput type="checkbox" onChange={e => setIsSale(issale === false ? true: false)} id="exampleCustomInline3" label="Sale product" inline />
                        <CustomInput type="checkbox" onChange={e => setIsRecom(isRecom === false ? true: false)} id="exampleCustomInline4" label="Recommended product" inline />
                        <CustomInput type="checkbox" onChange={e => setIsGift(isgift === false ? true: false)} id="exampleCustomInline5" label="Gift product" inline />
                    </Col>
                        {
                            filters && filters.filters.map((e, i) => (
                                <Col key={i} sm={6}>
                                <Label>{e.name}</Label>
                                <Input key={i} onChange={e => setFilter([...filter, { filterID:  e.target.value }])} style={{"color": "black", "height": "60px", "marginBottom": "1px"}} type="select" name="select">
                                    <option value style={{"display": "none"}}>Choose {e.name}</option>
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
                    <Col sm={12}>
                        {selectedFile &&  <img src={preview} alt="error while" /> }
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
                            { preview ? "File ready" : "Choose file"}
                            </Button>
                        </label>
                    </Col>
                <MatButton type="submit" disabled={disabled} style={{"margin": "0 auto", "marginTop": "50px", "marginBottom": "40px", "width": "100%"}} color="primary">Submit</MatButton>{' '}
                </Form>
            </ModalBody>
        </Modal>
    )
}

export default Createmodal