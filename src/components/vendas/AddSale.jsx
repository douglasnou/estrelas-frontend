import React, { useState, useEffect } from 'react';
import { api } from '../../server/api';
import ProductSelect from './ProductSelect';

const AddSale = ({ onBack }) => {
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

        fetchClients();
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleProductsChange = (selectedProducts) => {
        const total = selectedProducts.reduce((acc, product) => acc + product.price, 0);
        const productIds = selectedProducts.map(product => product.id);
        setFormData({ ...formData, products: productIds, total });
    };

    const updateCaixa = async (total) => {
        try {
            const response = await api.get('/caixa');
            const caixa = response.data;

            if (caixa && caixa.valor !== undefined) {
                await api.put('/caixa', { amount: total, operation: 'add' });
            } else {
                console.error("Caixa não encontrado. Certifique-se de que ele foi criado.");
            }

            console.log("Caixa atualizado com sucesso");
        } catch (error) {
            console.error("Erro ao atualizar caixa:", error.response?.data || error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { 
                clientId: parseInt(formData.clientId), // Converter para número
                products: formData.products // Passar apenas os IDs dos produtos
            };
            await api.post('/vendas', data);
            await updateCaixa(formData.total); // Atualiza o caixa com o total da venda
            console.log("Venda adicionada com sucesso");
            onBack();
        } catch (error) {
            console.error("Erro ao adicionar venda:", error.response?.data || error.message);
        }
    };

    return (
        <div className='vendas-add'>
            <h3>Adicionar Venda</h3>
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
                <ProductSelect products={products} onChange={handleProductsChange} />
                <div>Total: R$ {formData.total.toFixed(2)}</div>
                <button type="submit">Adicionar</button>
                <button type="button" onClick={onBack}>Cancelar</button>
            </form>
        </div>
    );
};

export default AddSale;


