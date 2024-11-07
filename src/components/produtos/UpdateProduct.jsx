import React, { useEffect, useState } from 'react';
import { api } from '../../server/api';

const UpdateProduct = ({ productId, onBack }) => {
    const [formData, setFormData] = useState({ name: '', price: '', stock: '' });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/produtos/${productId}`);
                setFormData(response.data);
            } catch (error) {
                console.error("Erro ao buscar produto:", error);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) };
            await api.put(`/produtos/${productId}`, data);
            console.log("Produto atualizado com sucesso");
            onBack();
        } catch (error) {
            console.error("Erro ao atualizar produto:", error.response?.data || error.message);
        }
    };

    return (
        <div className='produtos-edit'>
            <h3>Atualizar Produto</h3>
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
                <button type="submit">Atualizar</button>
                <button type="button" onClick={onBack}>Cancelar</button>
            </form>
        </div>
    );
};

export default UpdateProduct;
