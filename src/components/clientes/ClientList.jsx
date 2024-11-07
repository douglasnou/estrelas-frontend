import React, { useEffect, useState } from 'react';
import UpdateClient from './UpdateClient';
import ClientDetail from './ClientDetail';
import { api } from '../../server/api';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get('/clientes');
                setClients(response.data);
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
            }
        };

        fetchClients();
        const interval = setInterval(fetchClients, 5000);
        return ()=> clearInterval(interval);
    }, []);


    const handleEditClick = (clientId) => {
        setSelectedClientId(clientId);
        setIsDetailOpen(false);
        
    };

    const handleClientClick = (clientId) => {
        setSelectedClientId(clientId);
        setIsDetailOpen(true);
    };

    const handleBackToList = () => {
        setSelectedClientId(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja deletar este cliente?")) {
            try {
                await api.delete(`/clientes/${id}`);
                setClients(clients.filter(client => client.id !== id));
                console.log("Cliente deletado com sucesso");
            } catch (error) {
                console.error("Erro ao deletar cliente:", error.response?.data || error.message);
            }
        }
    };

    return (
        <div className='clientes-lista'>
            <h2>Lista de Clientes</h2>
            {selectedClientId && isDetailOpen ? (
                <ClientDetail clientId={selectedClientId} onBack={handleBackToList} />
            ) : selectedClientId ? (
                <UpdateClient clientId={selectedClientId} onBack={handleBackToList} />
            ) : (
                <ul>
                    {clients.map((client) => (
                        <li key={client.id} onClick={() => handleClientClick(client.id)} style={{ cursor: 'pointer' }}>
                            <h3>{client.name}</h3>
                            <button onClick={(e) => { e.stopPropagation(); handleEditClick(client.id); }}>Editar</button>
                            <button onClick={()=> handleDelete(client.id)}>deletar</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ClientList;
