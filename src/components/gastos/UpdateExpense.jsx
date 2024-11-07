import React, { useState, useEffect } from 'react';
import { api } from '../../server/api';

const UpdateExpense = ({ expenseId, onBack }) => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        date: ''
    });

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const response = await api.get(`/despesas/${expenseId}`);
                const expense = response.data;
                setFormData({
                    description: expense.description,
                    amount: expense.amount,
                    date: new Date(expense.date).toISOString().split('T')[0]
                });
            } catch (error) {
                console.error("Erro ao carregar gasto:", error);
            }
        };

        fetchExpense();
    }, [expenseId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const dataToSend = {
            ...formData,
            amount: parseFloat(formData.amount),
        };

        try {
            await api.put(`/despesas/${expenseId}`, dataToSend);
            console.log("Gasto atualizado com sucesso");
            onBack();
        } catch (error) {
            console.error("Erro ao atualizar gasto:", error);
        }
    };

    return (
        <form className='gastos-edit' onSubmit={handleSubmit}>
            <h2>Atualizar Gasto</h2>
            <div>
                <label>Descrição:</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <div>
                <label>Valor:</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
            </div>
            <div>
                <label>Data:</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>
            <button type="submit">Atualizar Gasto</button>
            <button type="button" onClick={onBack}>Voltar</button>
        </form>
    );
};

export default UpdateExpense;
