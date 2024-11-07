import React, { useEffect, useState } from 'react';
import UpdateExpense from './UpdateExpense';
import AddExpense from './AddExpense';
import { api } from '../../server/api';

const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    const [selectedExpenseId, setSelectedExpenseId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await api.get('/despesas');
                setExpenses(response.data);
            } catch (error) {
                console.error("Erro ao buscar gastos:", error);
            }
        };

        fetchExpenses();
        const interval = setInterval(fetchExpenses, 5000);
        return ()=> clearInterval(interval);
    }, []);

    const handleEditClick = (expenseId) => {
        setSelectedExpenseId(expenseId);
    };

    const handleAddClick = () => {
        setIsAdding(true);
    };

    const handleBackToList = () => {
        setSelectedExpenseId(null);
        setIsAdding(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja deletar este gasto?")) {
            try {
                await api.delete(`/despesas/${id}`);
                setExpenses(expenses.filter(expense => expense.id !== id));
                console.log("Despesa deletada com sucesso");
            } catch (error) {
                console.error("Erro ao deletar gasto:", error.response?.data || error.message);
            }
        }
    };

    return (
        <div className='lista'>
            <h2>Lista de Gastos</h2>
            {selectedExpenseId ? (
                <UpdateExpense expenseId={selectedExpenseId} onBack={handleBackToList} />
            ) : isAdding ? (
                <AddExpense onBack={handleBackToList} />
            ) : (
                <>
                    <button onClick={handleAddClick}>Adicionar Gasto</button>
                    <ul>
                        {expenses.map((expense) => (
                            <li key={expense.id}>
                                {expense.description} - R$ {expense.amount.toFixed(2)} - {new Date(expense.date).toLocaleDateString()}
                                <button onClick={() => handleEditClick(expense.id)}>Editar</button>
                                <button onClick={() => handleDelete(expense.id)}>Deletar</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default ExpenseList;
