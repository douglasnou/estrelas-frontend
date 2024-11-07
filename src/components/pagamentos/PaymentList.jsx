import React, { useEffect, useState } from 'react';
import UpdatePayment from './UpdatePayment';
import AddPayment from './AddPayment';
import { api } from '../../server/api';

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await api.get('/pagamentos');
                setPayments(response.data);
            } catch (error) {
                console.error("Erro ao buscar pagamentos:", error);
            }
        };

        fetchPayments();
        const interval = setInterval(fetchPayments, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleEditClick = (paymentId) => {
        setSelectedPaymentId(paymentId);
    };

    const handleAddClick = () => {
        setIsAdding(true);
    };

    const handleBackToList = () => {
        setSelectedPaymentId(null);
        setIsAdding(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja deletar este pagamento?")) {
            try {
                await api.delete(`/pagamentos/${id}`);
                setPayments(payments.filter(payment => payment.id !== id));
                console.log("Pagamento deletado com sucesso");
            } catch (error) {
                console.error("Erro ao deletar pagamento:", error.response?.data || error.message);
            }
        }
    };

    return (
        <div className='lista'>
            <h2>Lista de Pagamentos</h2>
            {selectedPaymentId ? (
                <UpdatePayment paymentId={selectedPaymentId} onBack={handleBackToList} />
            ) : isAdding ? (
                <AddPayment onBack={handleBackToList} />
            ) : (
                <>
                    <button onClick={handleAddClick}>Adicionar Pagamento</button>
                    <ul>
                        {payments.map((payment) => (
                            <li key={payment.id}>
                                {payment.client.name} - R$ {payment.amount.toFixed(2)} - {new Date(payment.date).toLocaleDateString()}
                                <br />
                                Forma de Pagamento: {payment.paymentMethod}
                                {payment.paymentMethod === 'Cartão de Crédito' && (
                                    <>
                                        {" - Parcelas: "}{payment.installments}
                                        {" - Valor por parcela: R$ "}
                                        {(payment.amount / payment.installments).toFixed(2)}
                                    </>
                                )}
                                <button onClick={() => handleEditClick(payment.id)}>Editar</button>
                                <button onClick={() => handleDelete(payment.id)}>Deletar</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default PaymentList;

