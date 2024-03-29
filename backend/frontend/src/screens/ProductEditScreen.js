import React, {useState, useEffect} from 'react'
// import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button, } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import axios from 'axios'

function ProductEditScreen() {
    const {id} = useParams()

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [brand, setBrand] = useState('')
    const [image, setImage] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [uploading, setUploading] = useState(false)



    const dispatch = useDispatch()

    const navigate = useNavigate()


    const productDetails = useSelector(state => state.productDetails)
    const {error, loading, product} = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const {error: errorUpdate, loading: loadingUpdate, success: successUpdate} = productUpdate

    useEffect(() => {
      if(successUpdate){
        dispatch({type: PRODUCT_UPDATE_RESET})
        navigate('/admin/productlist')
      }else{
        
        if (!product.name || product._id !== Number(id)) {
          dispatch(listProductDetails(id));
        } else {
          setName(product.name);
          setPrice(product.price);
          setBrand(product.brand);
          setImage(product.image);
          setCountInStock(product.countInStock);
          setDescription(product.description);
          setCategory(product.category);
        }
      }

    },[dispatch, product, id, navigate, successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
          _id: id,
          name,
          brand,
          price,
          image,
          countInStock,
          category,
          description,
        }))
      }

    const uploadFileHandler = async (e) =>{
      // console.log('Uploaded')
      const file = e.target.files[0]
      const formData = new FormData()

      formData.append('image', file)
      formData.append('product_id', id)

      setUploading(true)

      try{

        const config = {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        }

        const {data} = await axios.post('/api/products/upload/', formData, config)

        setImage(data)
        setUploading(false)
      }
      catch(error){
        setUploading(false)
      }
    }
  return (
    <div>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit product</h1>

        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image-file">
              <Form.Control
                type="file"
                onChange={uploadFileHandler}
              ></Form.Control>

              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="stock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
}

export default ProductEditScreen