import React, { useState, useEffect } from 'react';
import { api } from '../../server/api';

const UpdateClient = ({ clientId, onBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await api.get(`/clientes/${clientId}`);
                setFormData(response.data);
            } catch (error) {
                console.error("Erro ao carregar cliente:", error);
            }
        };

        fetchClient();
    }, [clientId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await api.put(`/clientes/${clientId}`, formData);
            console.log("Cliente atualizado com sucesso");
            onBack();
        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
        }
    };

    return (
        <div className='clientes-edit'>
            <h2>Atualizar Cliente</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Atualizar Cliente</button>
                <button type="button" onClick={onBack}>Voltar</button>
            </form>
        </div>
    );
};

export default UpdateClient;
