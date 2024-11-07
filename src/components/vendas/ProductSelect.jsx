import React from 'react';

const ProductSelect = ({ products, selectedProducts = [], onChange }) => {
    const handleChange = (e) => {
        const { options } = e.target;
        const selected = Array.from(options).filter(option => option.selected).map(option => {
            return products.find(product => product.id === Number(option.value));
        });
        onChange(selected);
    };

    return (
        <label>
            Produtos:
            <select multiple onChange={handleChange}>
                {products.map(product => (
                    <option key={product.id} value={product.id}>
                        {product.name} - R$ {product.price.toFixed(2)}
                    </option>
                ))}
            </select>
        </label>
    );
};

export default ProductSelect;
