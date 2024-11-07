import React, { useState } from 'react';
import { api } from '../../server/api';

const AddClient = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await api.post('/clientes', formData);
            console.log("Cliente adicionado com sucesso:", response.data);
            setFormData({ name: '', email: '', phone: '', address: '' });
        } catch (error) {
            console.error("Erro ao adicionar cliente:", error);
        }
    };

    return (
        <form className='clientes-cadastro' onSubmit={handleSubmit}>
            <h2>Cadastro de Cliente</h2>
            <div>
                <label>Nome:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
                <label>Telefone:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div>
                <label>Endereço:</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <button type="submit">Cadastrar Cliente</button>
        </form>
    );
};

export default AddClient;
