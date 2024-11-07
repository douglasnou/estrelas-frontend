import React, { useEffect, useState } from 'react';
import UpdateProduct from './UpdateProduct';
import AddProduct from './AddProduct';
import { api } from '../../server/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/produtos');
                setProducts(response.data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };

        fetchProducts();
        const interval = setInterval(fetchProducts, 5000);
        return ()=> clearInterval(interval);
    }, []);

    const handleEditClick = (productId) => {
        setSelectedProductId(productId);
    };

    const handleAddClick = () => {
        setIsAdding(true);
    };

    const handleBackToList = () => {
        setSelectedProductId(null);
        setIsAdding(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja deletar este produto?")) {
            try {
                await api.delete(`/produtos/${id}`);
                setProducts(products.filter(product => product.id !== id));
                console.log("Produto deletado com sucesso");
            } catch (error) {
                console.error("Erro ao deletar produto:", error.response?.data || error.message);
            }
        }
    };

    return (
        <div className='lista'>
            <h2>Lista de Produtos</h2>
            {selectedProductId ? (
                <UpdateProduct productId={selectedProductId} onBack={handleBackToList} />
            ) : isAdding ? (
                <AddProduct onBack={handleBackToList} />
            ) : (
                <>
                    <button onClick={handleAddClick}>Adicionar Produto</button>
                    <ul>
                        {products.map((product) => (
                            <li key={product.id}>
                                {product.name} - R$ {product.price.toFixed(2)} - Estoque: {product.stock}
                                <button onClick={() => handleEditClick(product.id)}>Editar</button>
                                <button onClick={() => handleDelete(product.id)}>Deletar</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default ProductList;
