import React, { useEffect, useState } from 'react';
import { api } from '../../server/api';
import ProductSelect from './ProductSelect';

const UpdateSale = ({ saleId, onBack }) => {
    const [formData, setFormData] = useState({ clientId: '', products: [], total: 0 });
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            const response = await api.get('/clientes');
            setClients(response.data);
        };

        const fetchProducts = async () => {
            const response = await api.get('/produtos');
            setProducts(response.data);
        };

        const fetchSale = async () => {
            const response = await api.get(`/vendas/${saleId}`);
            // Mapeia os produtos para incluir apenas os IDs
            const productIds = response.data.products.map(product => product.id);
            setFormData({ clientId: response.data.clientId, products: productIds, total: response.data.total });
        };

        fetchClients();
        fetchProducts();
        fetchSale();
    }, [saleId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleProductsChange = (selectedProducts) => {
        const total = selectedProducts.reduce((acc, product) => acc + product.price, 0);
        setFormData({ ...formData, products: selectedProducts.map(p => p.id), total });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...formData, total: parseFloat(formData.total) };
            await api.put(`/vendas/${saleId}`, data);
            console.log("Venda atualizada com sucesso");
            onBack();
        } catch (error) {
            console.error("Erro ao atualizar venda:", error.response?.data || error.message);
        }
    };

    return (
        <div className='vendas-edit'>
            <h3>Atualizar Venda</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Cliente:
                    <select name="clientId" value={formData.clientId} onChange={handleChange} required>
                        <option value="">Selecione um cliente</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </label>
                <ProductSelect
                    products={products}
                    selectedProducts={formData.products.map(id => products.find(p => p.id === id))}
                    onChange={handleProductsChange}
                />
                <button type="submit">Atualizar</button>
                <button type="button" onClick={onBack}>Cancelar</button>
            </form>
        </div>
    );
};

export default UpdateSale;
