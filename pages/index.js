import React, { useState, useEffect } from 'react';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [addedProducts, setAddedProducts] = useState([]);
  const [inputId, setInputId] = useState("");
  const [inputQuantity, setInputQuantity] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        console.log(data)
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    const product = products.find((p) => p.id === parseInt(inputId));
    if (product) {
      const existingProduct = addedProducts.find((p) => p.id === product.id);

      if (existingProduct) {
        setAddedProducts(
          addedProducts.map((p) =>
            p.id === product.id
              ? { ...p, quantity: p.quantity + parseInt(inputQuantity) }
              : p
          )
        );
      } else {
        setAddedProducts([
          ...addedProducts,
          { ...product, quantity: parseInt(inputQuantity) },
        ]);
      }
    }
    setInputId("");
    setInputQuantity(1);
  };

  const calculateProductTotal = (product) =>
    product.price * product.quantity;

  const totalPrice = addedProducts.reduce(
    (sum, product) => sum + calculateProductTotal(product),
    0
  );

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Wallbit
      </h1>
      <div className="bg-gray-100 shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4 items-center">
            <input
              type="number"
              placeholder="Cantidad"
              min="1"
              value={inputQuantity}
              onChange={(e) => setInputQuantity(e.target.value)}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              placeholder="ID del producto"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-wallbitBlue text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            Agregar
          </button>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Carrito de compra
          </h2>
          <div className="overflow-x-auto">
            {addedProducts.length === 0 ?
              <p className='font-bold'>No hay productos en el carro aun, prueba agregando arriba con su id y la cantidad que deseas ingresar</p>
              :
              <table className="w-full text-left border-collapse bg-white rounded-lg shadow-md">
                <thead className="bg-wallbitBlue text-white">
                  <tr>
                    <th className="px-4 py-2">Cantidad</th>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Precio U</th>
                    <th className="px-4 py-2">Precio T</th>
                    <th className="px-4 py-2">Foto</th>
                  </tr>
                </thead>
                <tbody>
                  {addedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border">{product.quantity}</td>
                      <td className="px-4 py-2 border">{product.title}</td>
                      <td className="px-4 py-2 border">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 border">
                        ${calculateProductTotal(product).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        <img
                          src={product.image}
                          alt="Producto"
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-200 font-semibold">
                    <td className="px-4 py-2 border text-right" colSpan="3">
                      Precio total del carrito
                    </td>
                    <td className="px-4 py-2 border">${totalPrice.toFixed(2)}</td>
                    <td className="px-4 py-2 border"></td>
                  </tr>
                </tfoot>
              </table>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductTable;
