import React, { useState, useEffect } from 'react';
import { api } from '../../server/api';

const AddExpense = ({ onBack }) => {
    const [formData, setFormData] = useState({ description: '', amount: 0 });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const updateCaixa = async (amount) => {
        try {
            // Primeiro, tenta buscar o caixa existente
            const response = await api.get('/caixa');
            const caixa = response.data;

            if (caixa && caixa.valor !== undefined) {
                // Se o caixa existir, atualiza o valor
                await api.put('/caixa', { amount, operation: 'subtract' });
            } else {
                console.error("Caixa não encontrado. Certifique-se de que ele foi criado.");
            }

            console.log("Caixa atualizado com sucesso");
        } catch (error) {
            console.error("Erro ao atualizar caixa:", error.response?.data || error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { 
                description: formData.description,
                amount: parseFloat(formData.amount) // Certifique-se de que o valor é um número
            };
            await api.post('/despesas', data); // Substitua pelo endpoint correto para adicionar despesas
            await updateCaixa(formData.amount); // Atualiza o caixa com o valor da despesa
            console.log("Despesa adicionada com sucesso");
            onBack();
        } catch (error) {
            console.error("Erro ao adicionar despesa:", error.response?.data || error.message);
        }
    };

    return (
        <div className='gastos-add'>
            <h3>Adicionar Despesa</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Descrição:
                    <input 
                        type="text" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Valor:
                    <input 
                        type="number" 
                        name="amount" 
                        value={formData.amount} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <button type="submit">Adicionar</button>
                <button type="button" onClick={onBack}>Cancelar</button>
            </form>
        </div>
    );
};

export default AddExpense;

