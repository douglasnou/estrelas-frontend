import React, { useEffect, useState } from 'react';
import { api } from '../../server/api';

const ClientDetail = ({ clientId, onBack }) => {
    const [client, setClient] = useState(null);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await api.get(`/clientes/${clientId}`);
                setClient(response.data);
            } catch (error) {
                console.error("Erro ao buscar cliente:", error);
            }
        };

        fetchClient();
    }, [clientId]);

    if (!client) {
        return <p>Carregando...</p>;
    }

    return (
        <div className='clientes-dados'>
            <h2>Detalhes do Cliente</h2>
            <p><strong>Nome:</strong> {client.name}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Telefone:</strong> {client.phone}</p>
            <p><strong>Endereço:</strong> {client.address}</p>
            <button onClick={onBack}>Voltar</button>
        </div>
    );
};

export default ClientDetail;
