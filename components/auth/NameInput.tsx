import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const NameInput: React.FC<{ onSubmit: (name: string) => void }> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(name); }}>
      <p className="text-sm text-gray-600 mb-4">Solo nos falta un detalle</p>
      <Input 
        type="text" 
        label="¿Cómo te llamas?" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
        placeholder="Juan Pérez"
        minLength={3}
      />
      <Button type="submit" className="w-full">Completar Registro</Button>
    </form>
  );
};
