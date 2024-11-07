import React, { useState } from 'react';
import { api } from '../../server/api';

const AddProduct = ({ onBack }) => {
    const [formData, setFormData] = useState({ name: '', price: '', stock: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) };
            await api.post('/produtos', data);
            console.log("Produto adicionado com sucesso");
            onBack();
        } catch (error) {
            console.error("Erro ao adicionar produto:", error.response?.data || error.message);
        }
    };

    return (
        <div className='produtos-add'>
            <h3>Adicionar Produto</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Nome:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </label>
                <label>
                    Preço:
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                </label>
                <label>
                    Estoque:
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                </label>
                <button type="submit">Adicionar</button>
                <button type="button" onClick={onBack}>Cancelar</button>
            </form>
        </div>
    );
};

export default AddProduct;
