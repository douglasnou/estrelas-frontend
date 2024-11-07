import React, { useEffect, useState } from 'react';
import { api } from '../../server/api';

const UpdatePayment = ({ paymentId, onBack }) => {
    const [formData, setFormData] = useState({ date: '', amount: '', paymentMethod: '', installments: '' });
    const [installmentValue, setInstallmentValue] = useState(null);

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const response = await api.get(`/pagamentos/${paymentId}`);
                setFormData(response.data);
                calculateInstallmentValue(response.data.amount, response.data.installments);
            } catch (error) {
                console.error("Erro ao buscar pagamento:", error);
            }
        };

        fetchPayment();
    }, [paymentId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Recalcula o valor de cada parcela se o campo amount ou installments mudar
        if (name === 'amount' || (name === 'installments' && formData.paymentMethod === 'Cartão de Crédito')) {
            calculateInstallmentValue(name === 'amount' ? parseFloat(value) : formData.amount, name === 'installments' ? parseInt(value) : formData.installments);
        }
    };

    const calculateInstallmentValue = (amount, installments) => {
        if (formData.paymentMethod === 'Cartão de Crédito' && amount && installments > 0) {
            setInstallmentValue((amount / installments).toFixed(2));
        } else {
            setInstallmentValue(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                amount: parseFloat(formData.amount),
                installments: formData.paymentMethod === 'Cartão de Crédito' 
                    ? (formData.installments && parseInt(formData.installments) > 0 ? parseInt(formData.installments) || 1 : null) 
                    : null,
            };
    
            await api.put(`/pagamentos/${paymentId}`, data);
            console.log("Pagamento atualizado com sucesso");
            onBack();
        } catch (error) {
            console.error("Erro ao atualizar pagamento:", error.response?.data || error.message);
        }
    };
    
    return (
        <div className='pagamentos-edit'>
            <h3>Atualizar Pagamento</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Data:
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                </label>
                <label>
                    Valor:
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
                </label>
                <label>
                    Forma de Pagamento:
                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
                        <option value="">Selecione</option>
                        <option value="Dinheiro/PIX">Dinheiro/PIX</option>
                        <option value="Carnê">Carnê</option>
                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                    </select>
                </label>
                {formData.paymentMethod === 'Cartão de Crédito' && (
                    <>
                        <label>
                            Quantidade de Parcelas:
                            <input
                                type="number"
                                name="installments"
                                value={formData.installments || ''}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </label>
                        {installmentValue && (
                            <p>Valor por parcela: R$ {installmentValue}</p>
                        )}
                    </>
                )}
                <button type="submit">Atualizar</button>
                <button type="button" onClick={onBack}>Cancelar</button>
            </form>
        </div>
    );
};

export default UpdatePayment;

