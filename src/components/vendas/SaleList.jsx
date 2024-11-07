import React, { useEffect, useState } from 'react';
import UpdateSale from './UpdateSale';
import AddSale from './AddSale';
import { api } from '../../server/api';

const SaleList = () => {
    const [sales, setSales] = useState([]);
    const [selectedSaleId, setSelectedSaleId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await api.get('/vendas');
                setSales(response.data);
            } catch (error) {
                console.error("Erro ao buscar vendas:", error);
            }
        };

        fetchSales();
        const interval = setInterval(fetchSales, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleEditClick = (saleId) => {
        setSelectedSaleId(saleId);
    };

    const handleAddClick = () => {
        setIsAdding(true);
    };

    const handleBackToList = () => {
        setSelectedSaleId(null);
        setIsAdding(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja deletar esta venda?")) {
            try {
                // Obtenha o valor da venda antes de deletar
                const saleToDelete = await api.get(`/vendas/${id}`);
                const saleTotal = saleToDelete.data.total;

                // Atualize o caixa subtraindo o total da venda
                await api.put('/caixa', { amount: saleTotal, operation: 'subtract' });

                // Agora delete a venda
                await api.delete(`/vendas/${id}`);
                
                // Atualize a lista de vendas
                setSales(sales.filter(sale => sale.id !== id));
                console.log("Venda deletada e caixa atualizado");
            } catch (error) {
                console.error("Erro ao deletar venda:", error.response?.data || error.message);
            }
        }
    };

    return (
        <div className='lista'>
            <h2>Lista de Vendas</h2>
            {selectedSaleId ? (
                <UpdateSale saleId={selectedSaleId} onBack={handleBackToList} />
            ) : isAdding ? (
                <AddSale onBack={handleBackToList} />
            ) : (
                <>
                    <button onClick={handleAddClick}>Adicionar Venda</button>
                    <ul>
                        {sales.map((sale) => (
                            <li key={sale.id}>
                                <p>{sale.client?.name} - R$ {sale.total.toFixed(2)} - Produtos: {sale.products.length}</p>
                                <button onClick={() => handleEditClick(sale.id)}>Editar</button>
                                <button onClick={() => handleDelete(sale.id)}>Deletar</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default SaleList;
