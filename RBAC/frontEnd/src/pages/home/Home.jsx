import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    getProductsData({ name: name });
  }, [name]);

  const getProductsData = async () => {
    let result = await fetch('http://localhost:9000/products', {
      method: 'post',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json',
        authorization: 'bearer ' + JSON.parse(localStorage.getItem('token')),
      },
    });
    result = await result.json();
    setProducts(result);
  };

  const handleDelete = async (id) => {
    let result = await fetch(`http://localhost:9000/product/${id}`, {
      method: 'delete',
      headers: {
        authorization: 'bearer ' + JSON.parse(localStorage.getItem('token')),
      },
    });
    result = await result.json();
    if (result) {
      getProductsData();
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name"
        onChange={(e) => setName(e.target.value)}
      />
      {products?.length > 0 ? (
        products?.map((item, index) => {
          return (
            <div className="flexRow" key={index}>
              <h1>{item?.name}</h1>
              <h3
                style={{ marginLeft: '10px', cursor: 'pointer' }}
                onClick={() =>
                  navigate(`/add`, {
                    state: item?._id,
                  })
                }
              >
                {' '}
                📝
              </h3>
              <h1
                style={{ marginLeft: '10px', cursor: 'pointer' }}
                onClick={() => handleDelete(item?._id)}
              >
                {' '}
                🗑
              </h1>
            </div>
          );
        })
      ) : (
        <h1>No records found</h1>
      )}
    </div>
  );
};

export default Home;
