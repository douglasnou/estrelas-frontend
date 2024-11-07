import React, { useState, useEffect } from 'react';
import { api } from '../../server/api';

const AddPayment = ({ onBack }) => {
    const [formData, setFormData] = useState({ date: '', amount: '', clientId: '', paymentMethod: '', installments: '' });
    const [clients, setClients] = useState([]);
    const [installmentValue, setInstallmentValue] = useState(0); // Estado para o valor da parcela

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
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Recalcula o valor da parcela quando o valor total ou o número de parcelas muda
        if (name === 'amount' || name === 'installments') {
            const amount = name === 'amount' ? parseFloat(value) : parseFloat(formData.amount);
            const installments = name === 'installments' ? parseInt(value) : parseInt(formData.installments);
            if (amount && installments && installments > 0) {
                setInstallmentValue(amount / installments);
            } else {
                setInstallmentValue(0); // Define para 0 caso os valores sejam inválidos
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                amount: parseFloat(formData.amount),
                clientId: parseInt(formData.clientId),
                installments: formData.paymentMethod === 'Cartão de Crédito' && formData.installments ? parseInt(formData.installments) || 1 : null,
            };
            await api.post('/pagamentos', data);
            console.log("Pagamento adicionado com sucesso");
            onBack();
        } catch (error) {
            console.error("Erro ao adicionar pagamento:", error.response?.data || error.message);
        }
    };

    return (
        <div className='pagamentos-adicionar'>
            <h3>Adicionar Pagamento</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Cliente:
                    <select name="clientId" value={formData.clientId} onChange={handleChange} required>
                        <option value="">Selecione um cliente</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Data:
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                </label>
                <label>
                    Valor:
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
                </label>
                <label>
                    Método de Pagamento:
                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
                        <option value="">Selecione o método</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Pix">Pix</option>
                        <option value="Carnê">Carnê</option>
                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                    </select>
                </label>
                {formData.paymentMethod === 'Cartão de Crédito' && (
                    <label>
                        Parcelas:
                        <input
                            type="number"
                            name="installments"
                            value={formData.installments}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                        {installmentValue > 0 && (
                            <span style={{ marginLeft: '10px' }}>
                                Valor por parcela: R$ {installmentValue.toFixed(2)}
                            </span>
                        )}
                    </label>
                )}
                <button type="submit">Adicionar</button>
                <button type="button" onClick={onBack}>Cancelar</button>
            </form>
        </div>
    );
};

export default AddPayment;



