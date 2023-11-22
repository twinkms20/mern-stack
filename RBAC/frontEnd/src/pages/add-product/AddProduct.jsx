import { useState, useEffect } from 'react';
import './addProduct.css';
import { useLocation, useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const [productInfo, setProductInfo] = useState({});

  useEffect(() => {
    if (location?.state !== null) {
      getProductInfo();
    }
  }, [location?.state]);

  useEffect(() => {
    if (productInfo?._id !== undefined) {
      setName(productInfo?.name);
      setPrice(productInfo?.price);
    }
  }, [productInfo?._id]);

  const getProductInfo = async () => {
    let result = await fetch(
      `http://localhost:9000/product/${location?.state}`,
      {
        method: 'get',
        headers: {
          authorization: 'bearer ' + JSON.parse(localStorage.getItem('token')),
        },
      }
    );
    result = await result.json();
    setProductInfo(result);
  };

  const handleAdd = async () => {
    if (name?.length === 0 || price?.length === 0) {
      setError(true);
    } else {
      setError(false);
    }
    if (name?.length !== 0 && price?.length !== 0) {
      if (productInfo?._id !== undefined) {
        let result = await fetch(
          `http://localhost:9000/product-update/${location?.state}`,
          {
            method: 'put',
            body: JSON.stringify({ name, price }),
            headers: {
              'Content-Type': 'application/json',
              authorization:
                'bearer ' + JSON.parse(localStorage.getItem('token')),
            },
          }
        );
        result = await result.json;
      } else {
        let result = await fetch('http://localhost:9000/add-product', {
          method: 'post',
          body: JSON.stringify({ name, price }),
          headers: {
            'Content-Type': 'application/json',
            authorization:
              'bearer ' + JSON.parse(localStorage.getItem('token')),
          },
        });
        result = await result.json;
      }

      navigate('/');
    }
  };

  return (
    <div className="form">
      <h1>
        {' '}
        {productInfo?._id !== undefined ? 'Update ' : 'Add '}
        Product
      </h1>
      <div className="fieldContainer">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Procduct Name"
        />
        {error && name?.length === 0 && (
          <span className="errorText">Please enter name</span>
        )}
      </div>
      <div className="fieldContainer">
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter Price"
        />
        {error && price?.length === 0 && (
          <span className="errorText">Please enter price</span>
        )}
      </div>
      <button onClick={() => handleAdd()}>
        {productInfo?._id !== undefined ? 'Update' : 'Add'}
      </button>
    </div>
  );
};

export default AddProduct;
