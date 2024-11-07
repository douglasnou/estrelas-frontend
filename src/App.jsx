import ClientList from './components/clientes/ClientList';
import AddClient from './components/clientes/AddClient';
import ExpenseList from './components/gastos/ExpenseList';
import PaymentList from './components/pagamentos/PaymentList';
import ProductList from './components/produtos/ProductList';
import SaleList from './components/vendas/SaleList';
import { useEffect, useState } from 'react';
import { api } from './server/api';
import "./styles/index.scss";

function App() {
  const [cashValue, setCashValue] = useState(0);

  useEffect(() => {
    const fetchCash = async () => {
      try {
        const response = await api.get('/caixa');
        // Verificar se a resposta está no formato esperado
        if (response.data && typeof response.data.valor === 'number') {
          setCashValue(response.data.valor);
        } else {
          console.error("Formato inesperado da resposta da API:", response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar valor em caixa:", error);
      }
    };
    fetchCash();
    const interval = setInterval(fetchCash, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateCash = async (amount, operation) => {
    try {
      const response = await api.put('/caixa', { amount, operation });
      // Verificar se a atualização foi bem-sucedida
      if (response.data && typeof response.data.valor === 'number') {
        setCashValue(response.data.valor);
      } else {
        console.error("Formato inesperado da resposta da API:", response.data);
      }
    } catch (error) {
      console.error("Erro ao atualizar caixa:", error.response?.data || error.message);
    }
  };

  return (
    <div className='section'>
      <div className='container'>
        <h1>Ótica - Gerenciamento</h1>
        <p>Valor em Caixa: R$ {cashValue.toFixed(2)}</p>

        <AddClient />
        <ClientList />
        <PaymentList />
        <ProductList />
        <SaleList />
        <ExpenseList />
      </div>
    </div>
  );
}

export default App;
